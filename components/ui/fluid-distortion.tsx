"use client"

import { useRef, useEffect, useCallback, ReactNode } from "react"
import html2canvas from "html2canvas"

// Vertex shader
const quadVert = `
  attribute vec2 aPosition;
  varying vec2 vUv;
  void main() {
    vUv = aPosition * 0.5 + 0.5;
    gl_Position = vec4(aPosition, 0.0, 1.0);
  }
`

// Splat shader - adds velocity/dye at mouse position
const splatFrag = `
  precision highp float;
  varying vec2 vUv;
  uniform sampler2D uTarget;
  uniform float aspectRatio;
  uniform vec3 color;
  uniform vec2 point;
  uniform float radius;
  
  void main() {
    vec2 p = vUv - point;
    p.x *= aspectRatio;
    vec3 splat = exp(-dot(p, p) / radius) * color;
    vec3 base = texture2D(uTarget, vUv).xyz;
    gl_FragColor = vec4(base + splat, 1.0);
  }
`

// Advection shader - moves values along velocity field
const advectionFrag = `
  precision highp float;
  varying vec2 vUv;
  uniform sampler2D uVelocity;
  uniform sampler2D uSource;
  uniform vec2 texelSize;
  uniform float dt;
  uniform float dissipation;
  
  void main() {
    vec2 coord = vUv - dt * texture2D(uVelocity, vUv).xy * texelSize;
    vec4 result = dissipation * texture2D(uSource, coord);
    gl_FragColor = result;
  }
`

// Divergence shader
const divergenceFrag = `
  precision highp float;
  varying vec2 vUv;
  uniform sampler2D uVelocity;
  uniform vec2 texelSize;
  
  void main() {
    float L = texture2D(uVelocity, vUv - vec2(texelSize.x, 0.0)).x;
    float R = texture2D(uVelocity, vUv + vec2(texelSize.x, 0.0)).x;
    float T = texture2D(uVelocity, vUv + vec2(0.0, texelSize.y)).y;
    float B = texture2D(uVelocity, vUv - vec2(0.0, texelSize.y)).y;
    float div = 0.5 * (R - L + T - B);
    gl_FragColor = vec4(div, 0.0, 0.0, 1.0);
  }
`

// Pressure solver shader
const pressureFrag = `
  precision highp float;
  varying vec2 vUv;
  uniform sampler2D uPressure;
  uniform sampler2D uDivergence;
  uniform vec2 texelSize;
  
  void main() {
    float L = texture2D(uPressure, vUv - vec2(texelSize.x, 0.0)).x;
    float R = texture2D(uPressure, vUv + vec2(texelSize.x, 0.0)).x;
    float T = texture2D(uPressure, vUv + vec2(0.0, texelSize.y)).x;
    float B = texture2D(uPressure, vUv - vec2(0.0, texelSize.y)).x;
    float divergence = texture2D(uDivergence, vUv).x;
    float pressure = (L + R + B + T - divergence) * 0.25;
    gl_FragColor = vec4(pressure, 0.0, 0.0, 1.0);
  }
`

// Gradient subtraction shader
const gradientSubtractFrag = `
  precision highp float;
  varying vec2 vUv;
  uniform sampler2D uPressure;
  uniform sampler2D uVelocity;
  uniform vec2 texelSize;
  
  void main() {
    float L = texture2D(uPressure, vUv - vec2(texelSize.x, 0.0)).x;
    float R = texture2D(uPressure, vUv + vec2(texelSize.x, 0.0)).x;
    float T = texture2D(uPressure, vUv + vec2(0.0, texelSize.y)).x;
    float B = texture2D(uPressure, vUv - vec2(0.0, texelSize.y)).x;
    vec2 velocity = texture2D(uVelocity, vUv).xy;
    velocity.xy -= vec2(R - L, T - B);
    gl_FragColor = vec4(velocity, 0.0, 1.0);
  }
`

// Final display shader - distorts the content texture using velocity field
const displayFrag = `
  precision highp float;
  varying vec2 vUv;
  uniform sampler2D uTexture;
  uniform sampler2D uVelocity;
  uniform float uDistortionStrength;
  
  void main() {
    // Get velocity at this point
    vec2 vel = texture2D(uVelocity, vUv).xy;
    
    // Use velocity to displace the texture coordinates
    vec2 distortedUv = vUv - vel * uDistortionStrength;
    
    // Sample the content texture with distorted coordinates
    vec4 color = texture2D(uTexture, distortedUv);
    
    gl_FragColor = color;
  }
`

interface FluidDistortionProps {
  children: ReactNode
  distortionStrength?: number
}

export function FluidDistortion({ children, distortionStrength = 0.15 }: FluidDistortionProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const glRef = useRef<WebGLRenderingContext | null>(null)
  const programsRef = useRef<Record<string, WebGLProgram>>({})
  const fbosRef = useRef<Record<string, { fbo: WebGLFramebuffer; texture: WebGLTexture; swap?: () => void }>>({})
  const contentTextureRef = useRef<WebGLTexture | null>(null)
  const mouseRef = useRef({ x: 0, y: 0, prevX: 0, prevY: 0 })
  const rafRef = useRef<number>(0)
  const simResRef = useRef(128)
  const needsContentUpdateRef = useRef(true)

  const compileShader = useCallback((gl: WebGLRenderingContext, type: number, source: string) => {
    const shader = gl.createShader(type)
    if (!shader) return null
    gl.shaderSource(shader, source)
    gl.compileShader(shader)
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
      console.error("Shader compile error:", gl.getShaderInfoLog(shader))
      gl.deleteShader(shader)
      return null
    }
    return shader
  }, [])

  const createProgram = useCallback((gl: WebGLRenderingContext, vertSrc: string, fragSrc: string) => {
    const vert = compileShader(gl, gl.VERTEX_SHADER, vertSrc)
    const frag = compileShader(gl, gl.FRAGMENT_SHADER, fragSrc)
    if (!vert || !frag) return null

    const program = gl.createProgram()
    if (!program) return null

    gl.attachShader(program, vert)
    gl.attachShader(program, frag)
    gl.linkProgram(program)

    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      console.error("Program link error:", gl.getProgramInfoLog(program))
      return null
    }

    return program
  }, [compileShader])

  const createDoubleFBO = useCallback((gl: WebGLRenderingContext, width: number, height: number, type: number) => {
    let fbo1 = createFBO(gl, width, height, type)
    let fbo2 = createFBO(gl, width, height, type)
    
    return {
      get fbo() { return fbo1.fbo },
      get texture() { return fbo1.texture },
      swap() {
        const temp = fbo1
        fbo1 = fbo2
        fbo2 = temp
      },
      get read() { return fbo1 },
      get write() { return fbo2 }
    }
  }, [])

  const createFBO = (gl: WebGLRenderingContext, width: number, height: number, type: number) => {
    const texture = gl.createTexture()!
    gl.bindTexture(gl.TEXTURE_2D, texture)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE)
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, width, height, 0, gl.RGBA, type, null)

    const fbo = gl.createFramebuffer()!
    gl.bindFramebuffer(gl.FRAMEBUFFER, fbo)
    gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, texture, 0)

    return { fbo, texture }
  }

  const updateContentTexture = useCallback(async () => {
    const gl = glRef.current
    const content = contentRef.current
    if (!gl || !content) return

    try {
      const canvas = await html2canvas(content, {
        backgroundColor: null,
        scale: 1,
        logging: false,
        useCORS: true,
      })

      if (!contentTextureRef.current) {
        contentTextureRef.current = gl.createTexture()
      }

      gl.bindTexture(gl.TEXTURE_2D, contentTextureRef.current)
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR)
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR)
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE)
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE)
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, canvas)
    } catch (e) {
      console.error("Failed to capture content:", e)
    }
  }, [])

  useEffect(() => {
    const canvas = canvasRef.current
    const container = containerRef.current
    if (!canvas || !container) return

    const gl = canvas.getContext("webgl", {
      alpha: true,
      depth: false,
      stencil: false,
      antialias: false,
      preserveDrawingBuffer: false,
    })
    if (!gl) return

    glRef.current = gl

    // Get extensions
    const halfFloat = gl.getExtension("OES_texture_half_float")
    gl.getExtension("OES_texture_half_float_linear")
    const texType = halfFloat ? halfFloat.HALF_FLOAT_OES : gl.UNSIGNED_BYTE

    // Set canvas size
    const size = 700
    canvas.width = size
    canvas.height = size

    gl.clearColor(0, 0, 0, 0)

    // Create programs
    programsRef.current = {
      splat: createProgram(gl, quadVert, splatFrag)!,
      advection: createProgram(gl, quadVert, advectionFrag)!,
      divergence: createProgram(gl, quadVert, divergenceFrag)!,
      pressure: createProgram(gl, quadVert, pressureFrag)!,
      gradientSubtract: createProgram(gl, quadVert, gradientSubtractFrag)!,
      display: createProgram(gl, quadVert, displayFrag)!,
    }

    // Create vertex buffer
    const vertexBuffer = gl.createBuffer()
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer)
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, -1, 1, 1, 1, 1, -1]), gl.STATIC_DRAW)

    const indexBuffer = gl.createBuffer()
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer)
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array([0, 1, 2, 0, 2, 3]), gl.STATIC_DRAW)

    // Create FBOs
    const simRes = simResRef.current
    fbosRef.current = {
      velocity: createDoubleFBO(gl, simRes, simRes, texType) as any,
      pressure: createDoubleFBO(gl, simRes, simRes, texType) as any,
      divergence: createFBO(gl, simRes, simRes, texType) as any,
    }

    const blit = (target: WebGLFramebuffer | null, width: number, height: number) => {
      gl.bindFramebuffer(gl.FRAMEBUFFER, target)
      gl.viewport(0, 0, width, height)
      gl.drawElements(gl.TRIANGLES, 6, gl.UNSIGNED_SHORT, 0)
    }

    const useProgram = (program: WebGLProgram) => {
      gl.useProgram(program)
      const posLoc = gl.getAttribLocation(program, "aPosition")
      gl.enableVertexAttribArray(posLoc)
      gl.vertexAttribPointer(posLoc, 2, gl.FLOAT, false, 0, 0)
    }

    const splat = (x: number, y: number, dx: number, dy: number) => {
      const program = programsRef.current.splat
      useProgram(program)

      const velocity = fbosRef.current.velocity as any

      gl.uniform1i(gl.getUniformLocation(program, "uTarget"), 0)
      gl.uniform1f(gl.getUniformLocation(program, "aspectRatio"), 1.0)
      gl.uniform2f(gl.getUniformLocation(program, "point"), x, y)
      gl.uniform3f(gl.getUniformLocation(program, "color"), dx * 10, dy * 10, 0)
      gl.uniform1f(gl.getUniformLocation(program, "radius"), 0.001)

      gl.activeTexture(gl.TEXTURE0)
      gl.bindTexture(gl.TEXTURE_2D, velocity.read.texture)
      blit(velocity.write.fbo, simRes, simRes)
      velocity.swap()
    }

    const step = (dt: number) => {
      const simRes = simResRef.current
      const texelSize = 1.0 / simRes
      const velocity = fbosRef.current.velocity as any
      const pressure = fbosRef.current.pressure as any
      const divergence = fbosRef.current.divergence

      gl.disable(gl.BLEND)

      // Advection
      const advectionProg = programsRef.current.advection
      useProgram(advectionProg)
      gl.uniform2f(gl.getUniformLocation(advectionProg, "texelSize"), texelSize, texelSize)
      gl.uniform1i(gl.getUniformLocation(advectionProg, "uVelocity"), 0)
      gl.uniform1i(gl.getUniformLocation(advectionProg, "uSource"), 0)
      gl.uniform1f(gl.getUniformLocation(advectionProg, "dt"), dt)
      gl.uniform1f(gl.getUniformLocation(advectionProg, "dissipation"), 0.98)

      gl.activeTexture(gl.TEXTURE0)
      gl.bindTexture(gl.TEXTURE_2D, velocity.read.texture)
      blit(velocity.write.fbo, simRes, simRes)
      velocity.swap()

      // Divergence
      const divProg = programsRef.current.divergence
      useProgram(divProg)
      gl.uniform2f(gl.getUniformLocation(divProg, "texelSize"), texelSize, texelSize)
      gl.uniform1i(gl.getUniformLocation(divProg, "uVelocity"), 0)
      gl.bindTexture(gl.TEXTURE_2D, velocity.read.texture)
      blit(divergence.fbo, simRes, simRes)

      // Pressure (clear first)
      gl.bindFramebuffer(gl.FRAMEBUFFER, pressure.read.fbo)
      gl.clear(gl.COLOR_BUFFER_BIT)
      gl.bindFramebuffer(gl.FRAMEBUFFER, pressure.write.fbo)
      gl.clear(gl.COLOR_BUFFER_BIT)

      // Pressure iterations
      const pressProg = programsRef.current.pressure
      useProgram(pressProg)
      gl.uniform2f(gl.getUniformLocation(pressProg, "texelSize"), texelSize, texelSize)
      gl.uniform1i(gl.getUniformLocation(pressProg, "uDivergence"), 1)
      gl.activeTexture(gl.TEXTURE1)
      gl.bindTexture(gl.TEXTURE_2D, divergence.texture)
      gl.uniform1i(gl.getUniformLocation(pressProg, "uPressure"), 0)

      for (let i = 0; i < 20; i++) {
        gl.activeTexture(gl.TEXTURE0)
        gl.bindTexture(gl.TEXTURE_2D, pressure.read.texture)
        blit(pressure.write.fbo, simRes, simRes)
        pressure.swap()
      }

      // Gradient subtraction
      const gradProg = programsRef.current.gradientSubtract
      useProgram(gradProg)
      gl.uniform2f(gl.getUniformLocation(gradProg, "texelSize"), texelSize, texelSize)
      gl.uniform1i(gl.getUniformLocation(gradProg, "uPressure"), 0)
      gl.uniform1i(gl.getUniformLocation(gradProg, "uVelocity"), 1)

      gl.activeTexture(gl.TEXTURE0)
      gl.bindTexture(gl.TEXTURE_2D, pressure.read.texture)
      gl.activeTexture(gl.TEXTURE1)
      gl.bindTexture(gl.TEXTURE_2D, velocity.read.texture)
      blit(velocity.write.fbo, simRes, simRes)
      velocity.swap()
    }

    const render = () => {
      if (!contentTextureRef.current) return

      gl.viewport(0, 0, canvas.width, canvas.height)
      gl.enable(gl.BLEND)
      gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA)

      const displayProg = programsRef.current.display
      useProgram(displayProg)

      gl.uniform1i(gl.getUniformLocation(displayProg, "uTexture"), 0)
      gl.uniform1i(gl.getUniformLocation(displayProg, "uVelocity"), 1)
      gl.uniform1f(gl.getUniformLocation(displayProg, "uDistortionStrength"), distortionStrength)

      gl.activeTexture(gl.TEXTURE0)
      gl.bindTexture(gl.TEXTURE_2D, contentTextureRef.current)
      gl.activeTexture(gl.TEXTURE1)
      gl.bindTexture(gl.TEXTURE_2D, (fbosRef.current.velocity as any).read.texture)

      blit(null, canvas.width, canvas.height)
    }

    let lastTime = performance.now()
    let frameCount = 0

    const animate = () => {
      const now = performance.now()
      const dt = Math.min((now - lastTime) / 1000, 0.016)
      lastTime = now

      // Update content texture periodically
      frameCount++
      if (frameCount % 30 === 0 || needsContentUpdateRef.current) {
        updateContentTexture()
        needsContentUpdateRef.current = false
      }

      const { x, y, prevX, prevY } = mouseRef.current
      const dx = x - prevX
      const dy = y - prevY

      if (Math.abs(dx) > 0.001 || Math.abs(dy) > 0.001) {
        splat(x, 1 - y, dx, -dy)
      }

      mouseRef.current.prevX = x
      mouseRef.current.prevY = y

      step(dt)
      render()

      rafRef.current = requestAnimationFrame(animate)
    }

    // Initial content capture
    setTimeout(() => {
      updateContentTexture()
      animate()
    }, 100)

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect()
      mouseRef.current.x = (e.clientX - rect.left) / rect.width
      mouseRef.current.y = (e.clientY - rect.top) / rect.height
    }

    container.addEventListener("mousemove", handleMouseMove)

    return () => {
      container.removeEventListener("mousemove", handleMouseMove)
      cancelAnimationFrame(rafRef.current)
    }
  }, [createProgram, createDoubleFBO, updateContentTexture, distortionStrength])

  return (
    <div ref={containerRef} className="relative" style={{ width: 700, height: 700 }}>
      {/* Hidden content for texture capture */}
      <div
        ref={contentRef}
        className="absolute inset-0"
        style={{ visibility: "hidden" }}
      >
        {children}
      </div>

      {/* WebGL canvas with fluid distortion */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0"
        style={{ width: "100%", height: "100%" }}
      />
    </div>
  )
}

export default FluidDistortion

