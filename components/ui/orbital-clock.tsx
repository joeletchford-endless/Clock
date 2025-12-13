"use client"

import { useState, useEffect } from "react"

export function OrbitalClock() {
  const [time, setTime] = useState(new Date())

  const days = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"]
  const months = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"]

  useEffect(() => {
    const interval = setInterval(() => {
      setTime(new Date())
    }, 1000)
    return () => clearInterval(interval)
  }, [])

  // Current values
  const currentDayOfMonth = time.getDate()
  const currentDayOfWeek = time.getDay()
  const currentMonth = time.getMonth()
  const currentHour = time.getHours() % 12
  const currentMinute = time.getMinutes()
  const currentSecond = time.getSeconds()

  // Calculate rotations for calendar hands
  const dayOfMonthDeg = ((currentDayOfMonth - 1) / 31) * 360
  // Month hand: add 7.2 degree offset to match the 2% label offset
  const monthDeg = (currentMonth / 12) * 360 + 7.2

  const formatFullDate = () => {
    return time.toLocaleDateString("en-US", {
      weekday: "long",
      month: "long",
      day: "numeric",
      year: "numeric",
    })
  }

  const formatTime = () => {
    return time.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    })
  }

  const size = 700
  const center = size / 2
  
  // Ring radii
  const outerRadius = 310
  const middleRadius = 230
  const innerRadius = 150

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
              id="outerCircle"
              d={createCirclePath(outerRadius)}
              fill="none"
            />
            <path
              id="middleCircle"
              d={createCirclePath(middleRadius)}
              fill="none"
            />
            <path
              id="innerCircle"
              d={createCirclePath(innerRadius)}
              fill="none"
            />
            
            {/* Gradients */}
            <linearGradient id="whiteHandGradient" x1="0%" y1="100%" x2="0%" y2="0%">
              <stop offset="0%" stopColor="rgba(255,255,255,0.15)" />
              <stop offset="100%" stopColor="rgba(255,255,255,0.9)" />
            </linearGradient>
            <linearGradient id="grayHandGradient" x1="0%" y1="100%" x2="0%" y2="0%">
              <stop offset="0%" stopColor="rgba(150,150,150,0.2)" />
              <stop offset="100%" stopColor="rgba(200,200,200,0.6)" />
            </linearGradient>
            <linearGradient id="greenHandGradient" x1="0%" y1="100%" x2="0%" y2="0%">
              <stop offset="0%" stopColor="rgba(34,197,94,0.2)" />
              <stop offset="100%" stopColor="#00FF6F" />
            </linearGradient>
            <linearGradient id="minuteHandGradient" x1="0%" y1="100%" x2="0%" y2="0%">
              <stop offset="0%" stopColor="rgba(255,255,255,0.1)" />
              <stop offset="100%" stopColor="rgba(255,255,255,0.85)" />
            </linearGradient>
            <linearGradient id="secondHandGradient" x1="0%" y1="100%" x2="0%" y2="0%">
              <stop offset="0%" stopColor="rgba(239,68,68,0.3)" />
              <stop offset="100%" stopColor="rgb(239,68,68)" />
            </linearGradient>
            <radialGradient id="centerGradient">
              <stop offset="30%" stopColor="#00FF6F" />
              <stop offset="100%" stopColor="rgba(34,197,94,0.6)" />
            </radialGradient>
          </defs>

          {/* OUTER RING: Days of the month (1-31) on curved path */}
          {Array.from({ length: 31 }, (_, i) => {
            const day = i + 1
            const isActive = currentDayOfMonth === day
            // Path starts at 3 o'clock, 75% is 12 o'clock (top)
            const offsetPercent = (75 + (i / 31) * 100) % 100
            
            return (
              <text
                key={`day-${day}`}
                fontSize="36"
                fontWeight="700"
                fill={isActive ? "#ffffff" : "rgba(255,255,255,0.6)"}
              >
                <textPath
                  href="#outerCircle"
                  startOffset={`${offsetPercent}%`}
                  textAnchor="middle"
                >
                  {day}
                </textPath>
              </text>
            )
          })}

          {/* MIDDLE RING: Months on curved path */}
          {months.map((month, i) => {
            const isActive = currentMonth === i
            // Path starts at 3 o'clock, 75% is 12 o'clock (top)
            // Shift by 2% to avoid 0% seam issue for APR
            const offsetPercent = (77 + (i / 12) * 100) % 100
            
            return (
              <text
                key={`month-${i}`}
                fontSize="36"
                fontWeight="700"
                fill={isActive ? "#00FF6F" : "rgba(255,255,255,0.5)"}
              >
                <textPath
                  href="#middleCircle"
                  startOffset={`${offsetPercent}%`}
                  textAnchor="middle"
                >
                  {month}
                </textPath>
              </text>
            )
          })}


          {/* Clock hands */}
          <g>
            {/* LONG HAND - Points to Days of Month (outer ring) - White */}
            <line
              x1={center}
              y1={center}
              x2={center}
              y2={center - outerRadius + 30}
              stroke="#ffffff"
              strokeWidth="4"
              strokeLinecap="butt"
              transform={`rotate(${dayOfMonthDeg} ${center} ${center})`}
            />

            {/* MEDIUM HAND - Points to Months (middle ring) - Green */}
            <line
              x1={center}
              y1={center}
              x2={center}
              y2={center - middleRadius + 30}
              stroke="#00FF6F"
              strokeWidth="6"
              strokeLinecap="butt"
              transform={`rotate(${monthDeg} ${center} ${center})`}
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
