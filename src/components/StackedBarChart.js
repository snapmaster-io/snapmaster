import React from 'react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'

const StackedBarChart = ({
  data,
  dataKey,
  bars,
  width,
  height,
  margin
}) => {
  //const jsfiddleUrl = 'https://jsfiddle.net/alidingling/90v76x08/';
  // if the width or height was passed in as a %, return a responsive container
  if (('' + width).includes('%') || ('' + height).includes('%')) {
    return (
      <ResponsiveContainer width={width} height={height}>
        <BarChart
          data={data}
          margin={margin}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey={dataKey} />
          <YAxis />
          <Tooltip />
          <Legend />
          {
            bars.map(b => 
              <Bar dataKey={b.dataKey} stackId={b.stackId} fill={b.fill} />
            )
          }
        </BarChart>
      </ResponsiveContainer>
    )      
  }

  return (
    <BarChart
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
        bars.map(b => 
          <Bar dataKey={b.dataKey} stackId={b.stackId} fill={b.fill} />
        )
      }
    </BarChart>
  )
}

export default StackedBarChart