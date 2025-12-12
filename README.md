# Orbital Calendar Clock

A beautiful, interactive calendar clock built with Next.js and React. The clock displays three concentric rings showing days of the month, months of the year, and days of the week, with animated hands pointing to the current date.

![Orbital Clock](https://img.shields.io/badge/Next.js-15-black?style=flat-square&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=flat-square&logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-3-38bdf8?style=flat-square&logo=tailwindcss)

## Features

- **Three Concentric Rings** with curved text paths:
  - **Outer Ring**: Days of the month (1-31)
  - **Middle Ring**: Months of the year (JAN-DEC)
  - **Inner Ring**: Days of the week (SUN-SAT)

- **Three Clock Hands**:
  - **White hand** → Current day of the month
  - **Gray hand** → Current month
  - **Lime green hand** → Current day of the week

- **Interactive Features**:
  - 3D tilt effect on hover
  - Glow effects on active elements
  - Hover panel showing current time and date

- **Beautiful Design**:
  - Dark green gradient background
  - SVG-based rendering with curved text
  - Smooth animations and transitions

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone https://github.com/joeletchford-endless/Clock.git
cd Clock
```

2. Install dependencies:
```bash
npm install
```

3. Run the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Tech Stack

- **Framework**: Next.js 15
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Rendering**: SVG with textPath for curved text

## Project Structure

```
Clock/
├── app/
│   ├── globals.css      # Global styles
│   ├── layout.tsx       # Root layout
│   └── page.tsx         # Main page
├── components/
│   └── ui/
│       └── orbital-clock.tsx  # Clock component
├── lib/
│   └── utils.ts         # Utility functions
└── ...config files
```

## Customization

### Font Size
Edit the `fontSize` attribute in `components/ui/orbital-clock.tsx` for each ring:
- Line ~180: Outer ring (days)
- Line ~200: Middle ring (months)
- Line ~220: Inner ring (weekdays)

### Colors
- Hand colors are defined in the Clock hands section (~line 250)
- Background gradient is in `app/page.tsx`

### Ring Sizes
Adjust the radius values in `orbital-clock.tsx`:
```typescript
const outerRadius = 310
const middleRadius = 230
const innerRadius = 150
```

## License

MIT

## Author

Built for Endless by Joel Etchford

