import React from 'react'
import { AreaChart, XAxis, YAxis, CartesianGrid, Tooltip, Area, ResponsiveContainer } from 'recharts'

interface PriceData {
  date: string
  price: number
}

interface PriceChartProps {
  data: PriceData[]
}

const PriceChart = ({ data }: PriceChartProps) => {
  return (
    <div className={'w-full h-full mt-8'}>
      <ResponsiveContainer width={'100%'} height={500}>
        <AreaChart data={data}>
          <defs>
            <linearGradient id="priceGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#6271EB" stopOpacity={0.2} />
              <stop offset="95%" stopColor="#6271EB" stopOpacity={0} />
            </linearGradient>
          </defs>
          <XAxis dataKey="date" tick={<CustomizedAxisTick />} height={200} />
          <YAxis />
          <CartesianGrid strokeDasharray="0" stroke="#808080" strokeWidth={0.1} />
          <Tooltip />
          <Area type="monotone" dataKey="price" strokeWidth={1} activeDot={{ r: 6 }} stroke="#6271EB" fill="url(#priceGradient)" />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  )
}

const CustomizedAxisTick = (props: any) => {
  const { x, y, stroke, payload } = props
  return (
    <g transform={`translate(${x},${y})`}>
      <text x={0} y={0} dy={16} textAnchor="end" fill="#666" transform="rotate(-35)">
        {payload.value}
      </text>
    </g>
  )
}

export default PriceChart
