"use client"

import Link from "next/link"
import { colors } from "@/lib/colors"

interface AnimatedLinkProps {
  href: string
  children: React.ReactNode
  className?: string
  defaultColor?: string
  hoverColor?: string
  external?: boolean
}

export function AnimatedLink({ 
  href, 
  children, 
  className = "",
  defaultColor = colors.olive.black,
  hoverColor = colors.coral.DEFAULT,
  external = false
}: AnimatedLinkProps) {
  const linkProps = external 
    ? { target: "_blank", rel: "noopener noreferrer" } 
    : {}

  const content = (
    <span className={`group relative inline-block overflow-hidden ${className}`} style={{ height: "1.25em" }}>
      <span className="flex flex-col transition-transform duration-300 ease-out transform group-hover:-translate-y-1/2">
        <span style={{ color: defaultColor }}>{children}</span>
        <span style={{ color: hoverColor }}>{children}</span>
      </span>
    </span>
  )

  if (external) {
    return (
      <a href={href} {...linkProps} className="inline-block">
        {content}
      </a>
    )
  }

  return (
    <Link href={href} className="inline-block">
      {content}
    </Link>
  )
}

export default AnimatedLink

