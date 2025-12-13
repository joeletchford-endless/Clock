"use client"

import { useState, useEffect } from "react"

export function HourDayClock() {
  const [time, setTime] = useState(new Date())

  const days = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"]

  useEffect(() => {
    const interval = setInterval(() => {
      setTime(new Date())
    }, 1000)
    return () => clearInterval(interval)
  }, [])

  // Current values
  const currentDayOfWeek = time.getDay()
  const currentHour = time.getHours() % 12 || 12
  const currentMinute = time.getMinutes()
  const currentSecond = time.getSeconds()

  // Calculate rotations for hour, minute, and day of week hands
  // Hour hand: add 7.2 degree offset to match the 2% label offset
  const hourDeg = ((time.getHours() % 12) / 12) * 360 + (currentMinute / 60) * 30 + 7.2
  const minuteDeg = (currentMinute / 60) * 360 + (currentSecond / 60) * 6
  const dayOfWeekDeg = (currentDayOfWeek / 7) * 360

  const size = 700
  const center = size / 2
  
  // Ring radii - only two rings now
  const outerRadius = 310   // Hours (12:00, 1:00, etc.)
  const innerRadius = 230   // Days of week

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
        height: size
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
          {/* Full circle paths for text */}
          <path
            id="hourDayOuterCircle"
            d={createCirclePath(outerRadius)}
            fill="none"
          />
          <path
            id="hourDayInnerCircle"
            d={createCirclePath(innerRadius)}
            fill="none"
          />
        </defs>

        {/* OUTER RING: Hours (12:00, 1:00, 2:00...) on curved path */}
        {Array.from({ length: 12 }, (_, i) => {
          const hour = i === 0 ? 12 : i
          const displayHour = `${hour}:00`
          // Path starts at 3 o'clock, 75% is 12 o'clock (top)
          // Shift by 2% to avoid 0% seam issue
          const offsetPercent = (77 + (i / 12) * 100) % 100
          
          return (
            <text
              key={`hour-${i}`}
              fontSize="36"
              fontWeight="700"
              fill="rgba(255,255,255,0.6)"
            >
              <textPath
                href="#hourDayOuterCircle"
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
          // Path starts at 3 o'clock, 75% is 12 o'clock (top)
          const offsetPercent = (75 + (i / 7) * 100) % 100
          
          return (
            <text
              key={`weekday-${i}`}
              fontSize="36"
              fontWeight="700"
              fill={isActive ? "#00FF6F" : "rgba(255,255,255,0.4)"}
            >
              <textPath
                href="#hourDayInnerCircle"
                startOffset={`${offsetPercent}%`}
                textAnchor="middle"
              >
                {day}
              </textPath>
            </text>
          )
        })}

        {/* Clock hands */}
        <g>
          {/* LONG HAND - Minutes - White */}
          <line
            x1={center}
            y1={center}
            x2={center}
            y2={center - outerRadius + 30}
            stroke="#ffffff"
            strokeWidth="4"
            strokeLinecap="butt"
            transform={`rotate(${minuteDeg} ${center} ${center})`}
          />

          {/* SHORT HAND - Hours - White */}
          <line
            x1={center}
            y1={center}
            x2={center}
            y2={center - innerRadius + 30}
            stroke="white"
            strokeWidth="6"
            strokeLinecap="butt"
            transform={`rotate(${hourDeg} ${center} ${center})`}
          />

          {/* SHORTEST HAND - Points to Day of Week (inner ring) - Green */}
          <line
            x1={center}
            y1={center}
            x2={center}
            y2={center - innerRadius + 80}
            stroke="#00FF6F"
            strokeWidth="6"
            strokeLinecap="butt"
            transform={`rotate(${dayOfWeekDeg} ${center} ${center})`}
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
            fill="#00FF6F"
          />
        </g>
      </svg>
    </div>
  )
}

export default HourDayClock

