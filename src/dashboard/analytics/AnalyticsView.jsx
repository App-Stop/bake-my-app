import { useState, useId } from 'react'

const TIME_RANGES = [
  { id: '7D', label: '7D' },
  { id: '30D', label: '30D' },
  { id: '90D', label: '90D' },
  { id: '1Y', label: '1Y' },
  { id: 'LIFETIME', label: 'LIFETIME' },
]

// Y-axis tick definitions matching Figma scale ($5,000, $2,500, $1,000, $100, $0)
const Y_AXIS_TICKS = [
  { label: '$5,000', y: 15 },
  { label: '$2,500', y: 55 },
  { label: '$1,000', y: 95 },
  { label: '$100', y: 135 },
  { label: '$0', y: 175 },
]

// Map value to Y coordinate in 0-190 space
function getChartY(val) {
  if (val >= 2500) {
    return 55 - ((val - 2500) / 2500) * 40
  }
  if (val >= 1000) {
    return 95 - ((val - 1000) / 1500) * 40
  }
  if (val >= 100) {
    return 135 - ((val - 100) / 900) * 40
  }
  return 175 - (val / 100) * 40
}

const ANALYTICS_DATA = {
  '30D': {
    subtitle: 'Daily sales revenue tracking upward over the past 30 days',
    highlights: [
      {
        label: 'Revenue Growth',
        value: '+14.2%',
        subtext: 'vs last month',
        isPositive: true,
      },
      {
        label: 'New Customers',
        value: '47',
        subtext: 'Added this month',
        isPositive: true,
      },
      {
        label: 'Repeat Order Rate',
        value: '62%',
        subtext: 'Strong customer loyalty',
        isNeutral: true,
      },
      {
        label: 'Busiest Day',
        value: 'Saturday',
        subtext: 'Avg. peak hour: 10AM',
        isNeutral: true,
      },
    ],
    chartPoints: [
      { date: 'Oct 01 (Day 1)', value: 120, x: 75, valStr: '$120.00' },
      { date: 'Oct 04 (Day 4)', value: 150, x: 150, valStr: '$150.00' },
      { date: 'Oct 08 (Day 8)', value: 680, x: 270, valStr: '$680.00' },
      { date: 'Oct 12 (Day 12)', value: 450, x: 390, valStr: '$450.00' },
      { date: 'Oct 15 (Day 15)', value: 1200, x: 510, valStr: '$1,200.00' },
      { date: 'Oct 18 (Day 18)', value: 1350, x: 630, valStr: '$1,350.00' },
      { date: 'Oct 22 (Day 22)', value: 1020, x: 750, valStr: '$1,020.00' },
      { date: 'Oct 24 (Day 24)', value: 1650, x: 870, valStr: '$1,650.00' },
      { date: 'Oct 26 (Day 26)', value: 1894, x: 990, valStr: '$1,894.00', isKeyHighlight: true },
    ],
    defaultHighlightIndex: 8,
    topProducts: [
      { rank: '#1', name: 'Artisanal Sourdough', units: '420 units', revenue: '$2,520.00' },
      { rank: '#2', name: 'Flaky Butter Croissant', units: '380 units', revenue: '$950.00' },
      { rank: '#3', name: 'Iced Caramel Macchiato', units: '290 units', revenue: '$1,450.00' },
      { rank: '#4', name: 'Chocolate Ganache Cake', units: '140 units', revenue: '$910.00' },
      { rank: '#5', name: 'Almond Frangipane Croissant', units: '110 units', revenue: '$385.00' },
    ],
    categories: [
      { name: 'Croissants', percent: 38, color: 'var(--brand, #c15400)' },
      { name: 'Cakes', percent: 24, color: '#dfc5b2' },
      { name: 'Coffee', percent: 18, color: '#191919' },
      { name: 'Bread', percent: 12, color: '#595959' },
      { name: 'Pastries', percent: 8, color: '#b0b0b0' },
    ],
  },
  '7D': {
    subtitle: 'Daily sales revenue tracking upward over the past 7 days',
    highlights: [
      {
        label: 'Revenue Growth',
        value: '+8.4%',
        subtext: 'vs previous 7 days',
        isPositive: true,
      },
      {
        label: 'New Customers',
        value: '14',
        subtext: 'Added this week',
        isPositive: true,
      },
      {
        label: 'Repeat Order Rate',
        value: '68%',
        subtext: 'Strong customer loyalty',
        isNeutral: true,
      },
      {
        label: 'Busiest Day',
        value: 'Friday',
        subtext: 'Avg. peak hour: 9AM',
        isNeutral: true,
      },
    ],
    chartPoints: [
      { date: 'Oct 20 (Mon)', value: 850, x: 75, valStr: '$850.00' },
      { date: 'Oct 21 (Tue)', value: 920, x: 225, valStr: '$920.00' },
      { date: 'Oct 22 (Wed)', value: 1020, x: 375, valStr: '$1,020.00' },
      { date: 'Oct 23 (Thu)', value: 1200, x: 525, valStr: '$1,200.00' },
      { date: 'Oct 24 (Fri)', value: 1650, x: 675, valStr: '$1,650.00' },
      { date: 'Oct 25 (Sat)', value: 1820, x: 825, valStr: '$1,820.00' },
      { date: 'Oct 26 (Sun)', value: 1894, x: 990, valStr: '$1,894.00', isKeyHighlight: true },
    ],
    defaultHighlightIndex: 6,
    topProducts: [
      { rank: '#1', name: 'Artisanal Sourdough', units: '115 units', revenue: '$690.00' },
      { rank: '#2', name: 'Flaky Butter Croissant', units: '98 units', revenue: '$245.00' },
      { rank: '#3', name: 'Iced Caramel Macchiato', units: '85 units', revenue: '$425.00' },
      { rank: '#4', name: 'Chocolate Ganache Cake', units: '42 units', revenue: '$273.00' },
      { rank: '#5', name: 'Almond Frangipane Croissant', units: '30 units', revenue: '$105.00' },
    ],
    categories: [
      { name: 'Croissants', percent: 36, color: 'var(--brand, #c15400)' },
      { name: 'Cakes', percent: 25, color: '#dfc5b2' },
      { name: 'Coffee', percent: 20, color: '#191919' },
      { name: 'Bread', percent: 11, color: '#595959' },
      { name: 'Pastries', percent: 8, color: '#b0b0b0' },
    ],
  },
  '90D': {
    subtitle: 'Daily sales revenue tracking upward over the past 90 days',
    highlights: [
      {
        label: 'Revenue Growth',
        value: '+22.8%',
        subtext: 'vs previous quarter',
        isPositive: true,
      },
      {
        label: 'New Customers',
        value: '138',
        subtext: 'Added past 90 days',
        isPositive: true,
      },
      {
        label: 'Repeat Order Rate',
        value: '59%',
        subtext: 'Strong customer loyalty',
        isNeutral: true,
      },
      {
        label: 'Busiest Day',
        value: 'Saturday',
        subtext: 'Avg. peak hour: 10AM',
        isNeutral: true,
      },
    ],
    chartPoints: [
      { date: 'Aug 01', value: 450, x: 75, valStr: '$450.00' },
      { date: 'Aug 15', value: 680, x: 190, valStr: '$680.00' },
      { date: 'Sep 01', value: 890, x: 310, valStr: '$890.00' },
      { date: 'Sep 15', value: 1100, x: 440, valStr: '$1,100.00' },
      { date: 'Sep 30', value: 1350, x: 580, valStr: '$1,350.00' },
      { date: 'Oct 10', value: 1520, x: 720, valStr: '$1,520.00' },
      { date: 'Oct 20', value: 1710, x: 860, valStr: '$1,710.00' },
      { date: 'Oct 26', value: 1894, x: 990, valStr: '$1,894.00', isKeyHighlight: true },
    ],
    defaultHighlightIndex: 7,
    topProducts: [
      { rank: '#1', name: 'Artisanal Sourdough', units: '1,280 units', revenue: '$7,680.00' },
      { rank: '#2', name: 'Flaky Butter Croissant', units: '1,120 units', revenue: '$2,800.00' },
      { rank: '#3', name: 'Iced Caramel Macchiato', units: '890 units', revenue: '$4,450.00' },
      { rank: '#4', name: 'Chocolate Ganache Cake', units: '410 units', revenue: '$2,665.00' },
      { rank: '#5', name: 'Almond Frangipane Croissant', units: '320 units', revenue: '$1,120.00' },
    ],
    categories: [
      { name: 'Croissants', percent: 40, color: 'var(--brand, #c15400)' },
      { name: 'Cakes', percent: 23, color: '#dfc5b2' },
      { name: 'Coffee', percent: 17, color: '#191919' },
      { name: 'Bread', percent: 13, color: '#595959' },
      { name: 'Pastries', percent: 7, color: '#b0b0b0' },
    ],
  },
  '1Y': {
    subtitle: 'Monthly sales revenue tracking upward over the past year',
    highlights: [
      {
        label: 'Revenue Growth',
        value: '+38.5%',
        subtext: 'vs previous year',
        isPositive: true,
      },
      {
        label: 'New Customers',
        value: '524',
        subtext: 'Added past 12 months',
        isPositive: true,
      },
      {
        label: 'Repeat Order Rate',
        value: '64%',
        subtext: 'Strong customer loyalty',
        isNeutral: true,
      },
      {
        label: 'Busiest Day',
        value: 'Saturday',
        subtext: 'Avg. peak hour: 11AM',
        isNeutral: true,
      },
    ],
    chartPoints: [
      { date: 'Nov 2023', value: 380, x: 75, valStr: '$380.00' },
      { date: 'Jan 2024', value: 520, x: 220, valStr: '$520.00' },
      { date: 'Mar 2024', value: 750, x: 370, valStr: '$750.00' },
      { date: 'May 2024', value: 980, x: 520, valStr: '$980.00' },
      { date: 'Jul 2024', value: 1250, x: 670, valStr: '$1,250.00' },
      { date: 'Sep 2024', value: 1540, x: 820, valStr: '$1,540.00' },
      { date: 'Oct 2024', value: 1894, x: 990, valStr: '$1,894.00', isKeyHighlight: true },
    ],
    defaultHighlightIndex: 6,
    topProducts: [
      { rank: '#1', name: 'Artisanal Sourdough', units: '5,120 units', revenue: '$30,720.00' },
      { rank: '#2', name: 'Flaky Butter Croissant', units: '4,650 units', revenue: '$11,625.00' },
      { rank: '#3', name: 'Iced Caramel Macchiato', units: '3,800 units', revenue: '$19,000.00' },
      { rank: '#4', name: 'Chocolate Ganache Cake', units: '1,820 units', revenue: '$11,830.00' },
      { rank: '#5', name: 'Almond Frangipane Croissant', units: '1,350 units', revenue: '$4,725.00' },
    ],
    categories: [
      { name: 'Croissants', percent: 38, color: 'var(--brand, #c15400)' },
      { name: 'Cakes', percent: 24, color: '#dfc5b2' },
      { name: 'Coffee', percent: 18, color: '#191919' },
      { name: 'Bread', percent: 12, color: '#595959' },
      { name: 'Pastries', percent: 8, color: '#b0b0b0' },
    ],
  },
  'LIFETIME': {
    subtitle: 'Total historical revenue trajectory since storefront launch',
    highlights: [
      {
        label: 'Revenue Growth',
        value: '+142%',
        subtext: 'Since storefront launch',
        isPositive: true,
      },
      {
        label: 'New Customers',
        value: '1,280',
        subtext: 'Total registered customers',
        isPositive: true,
      },
      {
        label: 'Repeat Order Rate',
        value: '61%',
        subtext: 'All-time retention',
        isNeutral: true,
      },
      {
        label: 'Busiest Day',
        value: 'Saturday',
        subtext: 'All-time peak day',
        isNeutral: true,
      },
    ],
    chartPoints: [
      { date: 'Launch Q1', value: 200, x: 75, valStr: '$200.00' },
      { date: 'Year 1 Q2', value: 450, x: 220, valStr: '$450.00' },
      { date: 'Year 1 Q4', value: 780, x: 370, valStr: '$780.00' },
      { date: 'Year 2 Q2', value: 1100, x: 520, valStr: '$1,100.00' },
      { date: 'Year 2 Q4', value: 1420, x: 670, valStr: '$1,420.00' },
      { date: 'Year 3 Q2', value: 1680, x: 820, valStr: '$1,680.00' },
      { date: 'Current', value: 1894, x: 990, valStr: '$1,894.00', isKeyHighlight: true },
    ],
    defaultHighlightIndex: 6,
    topProducts: [
      { rank: '#1', name: 'Artisanal Sourdough', units: '12,400 units', revenue: '$74,400.00' },
      { rank: '#2', name: 'Flaky Butter Croissant', units: '10,800 units', revenue: '$27,000.00' },
      { rank: '#3', name: 'Iced Caramel Macchiato', units: '8,950 units', revenue: '$44,750.00' },
      { rank: '#4', name: 'Chocolate Ganache Cake', units: '4,100 units', revenue: '$26,650.00' },
      { rank: '#5', name: 'Almond Frangipane Croissant', units: '3,200 units', revenue: '$11,200.00' },
    ],
    categories: [
      { name: 'Croissants', percent: 38, color: 'var(--brand, #c15400)' },
      { name: 'Cakes', percent: 24, color: '#dfc5b2' },
      { name: 'Coffee', percent: 18, color: '#191919' },
      { name: 'Bread', percent: 12, color: '#595959' },
      { name: 'Pastries', percent: 8, color: '#b0b0b0' },
    ],
  },
}

// Generate smooth cubic bezier SVG path from points
function generateSmoothPath(points) {
  if (!points || points.length === 0) return ''
  if (points.length === 1) return `M ${points[0].x} ${points[0].y}`

  let path = `M ${points[0].x} ${points[0].y}`
  for (let i = 0; i < points.length - 1; i++) {
    const p0 = points[i === 0 ? i : i - 1]
    const p1 = points[i]
    const p2 = points[i + 1]
    const p3 = points[i + 2 < points.length ? i + 2 : i + 1]

    // Catmull-Rom to Cubic Bezier conversion
    const cp1x = p1.x + (p2.x - p0.x) / 6
    const cp1y = p1.y + (p2.y - p0.y) / 6
    const cp2x = p2.x - (p3.x - p1.x) / 6
    const cp2y = p2.y - (p3.y - p1.y) / 6

    path += ` C ${cp1x.toFixed(1)} ${cp1y.toFixed(1)}, ${cp2x.toFixed(1)} ${cp2y.toFixed(1)}, ${p2.x.toFixed(1)} ${p2.y.toFixed(1)}`
  }
  return path
}

export function AnalyticsView() {
  const [activeRange, setActiveRange] = useState('30D')
  const [hoveredPointIndex, setHoveredPointIndex] = useState(null)
  const filterId = useId()

  const currentData = ANALYTICS_DATA[activeRange] || ANALYTICS_DATA['30D']

  // Precompute pixel Y coordinates for points
  const pointsWithCoords = currentData.chartPoints.map((pt) => ({
    ...pt,
    y: getChartY(pt.value),
  }))

  const activeIndex =
    hoveredPointIndex !== null ? hoveredPointIndex : currentData.defaultHighlightIndex
  const activePoint = pointsWithCoords[activeIndex] || pointsWithCoords[pointsWithCoords.length - 1]

  const smoothLinePath = generateSmoothPath(pointsWithCoords)

  return (
    <div className="mx-auto flex w-full max-w-[1440px] 2xl:max-w-[1600px] flex-col gap-6 lg:gap-7 xl:gap-8 transition-all">
      {/* Header Row: Title & Time Range Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex flex-col gap-1">
          <h1 className="text-2xl sm:text-[26px] lg:text-[28px] font-semibold tracking-tight text-ink">
            Analytics Overview
          </h1>
          <p className="text-xs sm:text-sm text-muted">
            Revenue trends, product performance, and customer insights.
          </p>
        </div>

        {/* Time Filter Pills */}
        <div className="flex items-center rounded-full border border-[#dcdcdc] bg-[#e8e8e8] p-1 self-start sm:self-auto shadow-xs">
          {TIME_RANGES.map((range) => {
            const isSelected = activeRange === range.id
            return (
              <button
                key={range.id}
                type="button"
                onClick={() => {
                  setActiveRange(range.id)
                  setHoveredPointIndex(null)
                }}
                className={`rounded-full px-3.5 sm:px-4 py-1.5 text-xs font-semibold transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-white text-ink shadow-[0px_1px_3px_0px_rgba(16,24,40,0.1),0px_1px_2px_0px_rgba(16,24,40,0.06)]'
                    : 'text-muted hover:text-ink'
                }`}
              >
                {range.label}
              </button>
            )
          })}
        </div>
      </div>

      {/* Highlights Row (4 Cards) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 xl:gap-5">
        {currentData.highlights.map((item, index) => (
          <div
            key={index}
            className="flex flex-col justify-between rounded-[20px] bg-white p-5 lg:p-6 shadow-[0px_4px_10px_rgba(0,0,0,0.02)] border border-[#f0ece9] min-h-[120px] xl:min-h-[127px] transition-shadow hover:shadow-md"
          >
            <p className="text-sm font-medium text-muted">{item.label}</p>
            <div className="my-1.5">
              <span
                className={`text-2xl lg:text-[28px] font-semibold tracking-tight ${
                  item.isPositive ? 'text-[#39ab00]' : 'text-ink'
                }`}
              >
                {item.value}
              </span>
            </div>
            <p className="text-xs text-muted">{item.subtext}</p>
          </div>
        ))}
      </div>

      {/* Daily Revenue Trend Chart Card */}
      <div className="rounded-[20px] bg-white p-5 sm:p-6 lg:p-7 shadow-[0px_4px_10px_rgba(0,0,0,0.02)] border border-[#f0ece9]">
        <div className="mb-6 flex flex-col gap-1">
          <h2 className="text-lg lg:text-xl font-semibold text-ink">Daily Revenue Trend</h2>
          <p className="text-xs sm:text-sm text-muted">{currentData.subtitle}</p>
        </div>

        {/* Chart Canvas */}
        <div className="relative flex w-full pt-4 pb-2">
          {/* Y-Axis Labels */}
          <div className="relative flex flex-col justify-between w-12 sm:w-14 shrink-0 h-[175px] text-[11px] sm:text-xs font-normal text-muted select-none text-right pr-2 sm:pr-3">
            {Y_AXIS_TICKS.map((tick, i) => (
              <span key={i} className="leading-none transform -translate-y-1/2">
                {tick.label}
              </span>
            ))}
          </div>

          {/* SVG Chart & Grid Area */}
          <div className="relative flex-1 h-[175px]">
            <svg
              className="w-full h-full overflow-visible"
              viewBox="0 0 1020 190"
              preserveAspectRatio="none"
            >
              <defs>
                <filter id={`shadow-${filterId}`} x="-20%" y="-20%" width="140%" height="140%">
                  <feDropShadow dx="0" dy="2" stdDeviation="3" floodColor="#000" floodOpacity="0.15" />
                </filter>
              </defs>

              {/* Horizontal Gridlines */}
              {Y_AXIS_TICKS.map((tick, i) => (
                <line
                  key={i}
                  x1="0"
                  y1={tick.y}
                  x2="1020"
                  y2={tick.y}
                  stroke="#e8e8e8"
                  strokeWidth="1"
                  strokeDasharray="3 3"
                />
              ))}

              {/* Revenue Trend Line */}
              <path
                d={smoothLinePath}
                fill="none"
                stroke="var(--brand, #c15400)"
                strokeWidth="2.75"
                strokeLinecap="round"
                strokeLinejoin="round"
                vectorEffect="non-scaling-stroke"
              />
            </svg>

            {/* Interactive Data Dots (Rendered in HTML for 100% round circles on all desktop screen ratios) */}
            {pointsWithCoords.map((pt, i) => {
              const isSelected = i === activeIndex
              const leftPct = (pt.x / 1020) * 100
              const topPct = (pt.y / 190) * 100
              return (
                <div
                  key={i}
                  className="absolute -translate-x-1/2 -translate-y-1/2 cursor-pointer z-10 flex items-center justify-center select-none"
                  style={{
                    left: `${leftPct}%`,
                    top: `${topPct}%`,
                    width: '32px',
                    height: '32px',
                  }}
                  onMouseEnter={() => setHoveredPointIndex(i)}
                  onMouseLeave={() => setHoveredPointIndex(null)}
                >
                  {/* Active Point Outer Ring */}
                  {isSelected && (
                    <span
                      className="absolute rounded-full pointer-events-none shadow-xs"
                      style={{
                        width: '16px',
                        height: '16px',
                        border: '2.5px solid var(--brand, #c15400)',
                        backgroundColor: 'white',
                      }}
                    />
                  )}

                  {/* Core Point Dot */}
                  <span
                    className="rounded-full transition-transform duration-150 pointer-events-none"
                    style={{
                      width: isSelected ? '7px' : '9px',
                      height: isSelected ? '7px' : '9px',
                      backgroundColor: isSelected ? 'var(--brand, #c15400)' : 'white',
                      border: isSelected ? 'none' : '2.5px solid var(--brand, #c15400)',
                    }}
                  />
                </div>
              )
            })}

            {/* Dynamic Floating Tooltip */}
            {activePoint && (() => {
              const xPct = (activePoint.x / 1020) * 100
              const yPct = (activePoint.y / 190) * 100
              const translateX = xPct > 85 ? -82 : xPct < 15 ? -18 : -50
              const caretLeft = xPct > 85 ? '82%' : xPct < 15 ? '18%' : '50%'
              return (
                <div
                  className="pointer-events-none absolute z-20 transition-all duration-150 ease-out"
                  style={{
                    left: `${xPct}%`,
                    top: `${yPct}%`,
                    transform: `translate(${translateX}%, -125%)`,
                  }}
                >
                  <div className="relative flex flex-col items-center rounded-xl bg-[#111111] px-3.5 py-2 text-center shadow-xl">
                    <span className="text-[10px] sm:text-[11px] font-normal text-neutral-300 whitespace-nowrap">
                      {activePoint.date}
                    </span>
                    <span className="text-xs sm:text-sm font-bold text-white whitespace-nowrap">
                      {activePoint.valStr}
                    </span>
                    {/* Subtle Downward Caret */}
                    <div
                      className="absolute top-full border-4 border-transparent border-t-[#111111]"
                      style={{ left: caretLeft, transform: 'translateX(-50%)' }}
                    />
                  </div>
                </div>
              )
            })()}
          </div>
        </div>
      </div>

      {/* Lower Row: Top Selling Products (Left) & Category Breakdown (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 lg:gap-6 xl:gap-7 items-start">
        {/* Top Selling Products Card (~58% / col-span-7) */}
        <div className="lg:col-span-7 rounded-[20px] bg-white p-5 sm:p-6 lg:p-7 shadow-[0px_4px_10px_rgba(0,0,0,0.02)] border border-[#f0ece9]">
          <h2 className="text-lg lg:text-xl font-semibold text-ink mb-4 sm:mb-5">
            Top Selling Products
          </h2>

          <div className="flex flex-col divide-y divide-[#f5f5f5]">
            {currentData.topProducts.map((prod, idx) => {
              const isFirst = prod.rank === '#1'
              return (
                <div
                  key={idx}
                  className="flex items-center justify-between py-3.5 sm:py-4 px-2 -mx-2 rounded-xl transition-colors hover:bg-neutral-50/80"
                >
                  {/* Rank & Product Title */}
                  <div className="flex items-center gap-3.5 min-w-0 flex-1 pr-3">
                    <span
                      className={`text-sm sm:text-base font-bold shrink-0 w-7 ${
                        isFirst ? 'text-brand' : 'text-ink'
                      }`}
                    >
                      {prod.rank}
                    </span>
                    <span className="text-xs sm:text-sm font-medium text-ink truncate" title={prod.name}>
                      {prod.name}
                    </span>
                  </div>

                  {/* Units Sold & Total Sales */}
                  <div className="flex items-center gap-4 sm:gap-8 shrink-0 text-right">
                    <span className="text-xs sm:text-sm text-muted whitespace-nowrap w-20 sm:w-24 text-right">
                      {prod.units}
                    </span>
                    <span className="text-xs sm:text-sm lg:text-base font-semibold text-brand whitespace-nowrap w-24 sm:w-28 text-right">
                      {prod.revenue}
                    </span>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Revenue Breakdown by Categories Card (~42% / col-span-5) */}
        <div className="lg:col-span-5 rounded-[20px] bg-white p-5 sm:p-6 lg:p-7 shadow-[0px_4px_10px_rgba(0,0,0,0.02)] border border-[#f0ece9]">
          <h2 className="text-lg lg:text-xl font-semibold text-ink mb-5 sm:mb-6">
            Revenue Breakdown by Categories
          </h2>

          {/* Segmented Horizontal Progress Bar */}
          <div className="flex h-7 w-full overflow-hidden rounded-xl gap-1 bg-[#f5f5f5] p-0.5">
            {currentData.categories.map((cat, idx) => (
              <div
                key={idx}
                className="h-full rounded-lg transition-all duration-300 hover:opacity-90 relative group"
                style={{
                  width: `${cat.percent}%`,
                  backgroundColor: cat.color,
                }}
                title={`${cat.name}: ${cat.percent}%`}
              />
            ))}
          </div>

          {/* Legend Items List */}
          <div className="mt-6 flex flex-col gap-3.5 sm:gap-4">
            {currentData.categories.map((cat, idx) => (
              <div key={idx} className="flex items-center justify-between text-xs sm:text-sm">
                <div className="flex items-center gap-2.5">
                  <span
                    className="size-3 rounded-[3px] shrink-0"
                    style={{ backgroundColor: cat.color }}
                  />
                  <span className="font-normal text-body">{cat.name}</span>
                </div>
                <span className="font-semibold text-ink">{cat.percent}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
