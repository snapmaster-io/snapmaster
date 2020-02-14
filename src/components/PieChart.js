import React from 'react'
import ReactMinimalPieChart from 'react-minimal-pie-chart'

const PieChart = ({
  data,
  radius,
  style,
  onClick,
  onMouseOut,
  onMouseOver
}) => {
  return (
    <ReactMinimalPieChart
      animate={true}
      animationDuration={500}
      animationEasing="ease-out"
      cx={radius}
      cy={radius}
      data={data}
      label
      labelPosition={60}
      labelStyle={{
        fontFamily: 'sans-serif',
        fontSize: '10px'
      }}
      lengthAngle={360}
      lineWidth={20}
      onClick={onClick}
      onMouseOut={onMouseOut}
      onMouseOver={onMouseOver}
      paddingAngle={18}
      radius={radius}
      rounded
      startAngle={0}
      style={style}
      viewBoxSize={[
        2 * radius,
        2 * radius
      ]}
    />
  )
}

export default PieChart
