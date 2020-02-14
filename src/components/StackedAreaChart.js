import React from 'react'
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts'

const StackedAreaChart = ({
  data,
  dataKey,
  areas,
  width,
  height,
  margin
}) => {
  return (
    <AreaChart
      width={width}
      height={height}
      data={data}
      margin={margin}
    >
      <CartesianGrid strokeDasharray="3 3" />
      <XAxis dataKey={dataKey} />
      <YAxis />
      <Tooltip />
      <Legend />
      {
        areas.map(b => 
          <Area 
            key={b.dataKey}
            dataKey={b.dataKey} 
            stackId={b.stackId} 
            stroke={b.fill} 
            fill={b.fill} />
        )
      }
    </AreaChart>
  )
}

export default StackedAreaChart