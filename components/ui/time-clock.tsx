"use client"

import { useState, useEffect } from "react"

export function TimeClock() {
  const [time, setTime] = useState(new Date())

  useEffect(() => {
    const interval = setInterval(() => {
      setTime(new Date())
    }, 1000)
    return () => clearInterval(interval)
  }, [])

  // Current values
  const currentHour = time.getHours() % 12 || 12
  const currentMinute = time.getMinutes()
  const currentSecond = time.getSeconds()

  // Calculate rotations for hands
  const hourDeg = ((time.getHours() % 12) / 12) * 360 + (currentMinute / 60) * 30
  const minuteDeg = (currentMinute / 60) * 360 + (currentSecond / 60) * 6
  const secondDeg = (currentSecond / 60) * 360

  const days = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"]
  const currentDayOfWeek = time.getDay()

  const size = 700
  const center = size / 2
  
  // Ring radii
  const outerRadius = 310  // Hours and seconds
  const innerRadius = 200  // Days of week

  // Create arc path starting from RIGHT (3 o'clock) going clockwise
  const createCirclePath = (radius: number) => {
    return `
      M ${center + radius} ${center}
      A ${radius} ${radius} 0 1 1 ${center - radius} ${center}
      A ${radius} ${radius} 0 1 1 ${center + radius} ${center}
    `
  }

  return (
    <div
      className="relative select-none text-white"
      style={{
        width: size,
        height: size,
      }}
    >
      {/* SVG Clock Face */}
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        style={{ fontFamily: "'Helvetica Neue', 'Arial', sans-serif" }}
      >
        <defs>
          {/* Full circle paths */}
          <path
            id="timeClockOuterCircle"
            d={createCirclePath(outerRadius)}
            fill="none"
          />
          <path
            id="timeClockInnerCircle"
            d={createCirclePath(innerRadius)}
            fill="none"
          />
        </defs>

        {/* OUTER RING: Hours (12:00, 1:00, 2:00...) on curved path */}
        {Array.from({ length: 12 }, (_, i) => {
          const hour = i === 0 ? 12 : i
          const displayHour = `${hour}:00`
          const isActive = currentHour === hour
          // Path starts at 3 o'clock, so 75% is 12 o'clock (top)
          const offsetPercent = (75 + (i / 12) * 100) % 100
          
          return (
            <text
              key={`hour-${i}`}
              fontSize="36"
              fontWeight="700"
              fill={isActive ? "#ffffff" : "rgba(255,255,255,0.5)"}
            >
              <textPath
                href="#timeClockOuterCircle"
                startOffset={`${offsetPercent}%`}
                textAnchor="middle"
              >
                {displayHour}
              </textPath>
            </text>
          )
        })}

        {/* INNER RING: Days of the week on curved path */}
        {days.map((day, i) => {
          const isActive = currentDayOfWeek === i
          // Path starts at 3 o'clock, so 75% is 12 o'clock (top)
          const offsetPercent = (75 + (i / 7) * 100) % 100
          
          return (
            <text
              key={`weekday-${i}`}
              fontSize="36"
              fontWeight="700"
              fill={isActive ? "#C5D92D" : "rgba(255,255,255,0.4)"}
            >
              <textPath
                href="#timeClockInnerCircle"
                startOffset={`${offsetPercent}%`}
                textAnchor="middle"
              >
                {day}
              </textPath>
            </text>
          )
        })}

        {/* Clock hands - matching OrbitalClock style */}
        <g>
          {/* SECOND HAND - Longest, points to outer ring - GREEN */}
          <line
            x1={center}
            y1={center}
            x2={center}
            y2={center - outerRadius + 50}
            stroke="#C5D92D"
            strokeWidth="4"
            strokeLinecap="butt"
            transform={`rotate(${secondDeg} ${center} ${center})`}
          />

          {/* MINUTE HAND - Medium, points to inner ring - WHITE */}
          <line
            x1={center}
            y1={center}
            x2={center}
            y2={center - innerRadius + 30}
            stroke="white"
            strokeWidth="6"
            strokeLinecap="butt"
            transform={`rotate(${minuteDeg} ${center} ${center})`}
          />

          {/* HOUR HAND - Short - WHITE */}
          <line
            x1={center}
            y1={center}
            x2={center}
            y2={center - 120}
            stroke="#ffffff"
            strokeWidth="6"
            strokeLinecap="butt"
            transform={`rotate(${hourDeg} ${center} ${center})`}
          />

          {/* Center hub */}
          <circle
            cx={center}
            cy={center}
            r="14"
            fill="white"
            strokeWidth="3"
          />

          {/* Inner center dot */}
          <circle
            cx={center}
            cy={center}
            r="6"
            fill="#C5D92D"
          />
        </g>
      </svg>
    </div>
  )
}

export default TimeClock

