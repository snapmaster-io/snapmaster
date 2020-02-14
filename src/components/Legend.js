import React from 'react'
import { LegendOrdinal, LegendLabel, LegendItem } from '@vx/legend'
import { scaleOrdinal } from '@vx/scale'

const Legend = ({
  scale,
  onSelect
}) => {
  /* scale parameter must look like the following object: 
   * a domain property that's an array of labels, 
   * and a range property that's an array of color codepoints
  {
    domain: ['positive', 'neutral', 'negative'],
    range: ['#E38627', '#C13C37', '#6A2135']
   //range: ['#66d981', '#71f5ef', '#4899f1', '#7d81f6']
  }
  */
  const ordinalColorScale = scaleOrdinal(scale);
  
  return (
    <LegendOrdinal scale={ordinalColorScale} labelFormat={label => `${label/*.toUpperCase()*/}`}>
      {labels => {
        return (
          <div style={{ display: 'flex', flexDirection: 'row' }}>
            {labels.map((label, i) => {
              const size = 15;
              return (
                <LegendItem
                  key={`legend-ordinal-${i}`}
                  margin={'0 5px'}
                  onClick={ onSelect /*event => {
                    alert(`clicked: ${JSON.stringify(label)}`);
                  } */}
                >
                  <svg width={size} height={size}>
                    <rect fill={label.value} width={size} height={size} />
                  </svg>
                  <LegendLabel align={'left'} margin={'0 10px 0 4px'}>
                    {label.text}
                  </LegendLabel>
                </LegendItem>
              );
            })}
          </div>
        );
      }}
    </LegendOrdinal>    
  )
}

export default Legend
