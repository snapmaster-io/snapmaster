import React from 'react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts'

const StackedLineChart = ({
  data,
  dataKey,
  lines,
  width,
  height,
  margin
}) => {
  return (
    <LineChart
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
        lines && lines.map(l => 
          <Line 
            key={l.dataKey}
            type="monotone" 
            dataKey={l.dataKey} 
            stroke={l.stroke} 
            activeDot={{ r: 8 }}/>
        )
      }
    </LineChart>
  )
}

export default StackedLineChart