'use client'

import React, { type ReactElement, useState, useEffect } from 'react'
import { Chart, EPlotTypes, type IPlot } from '@axdspub/axiom-charts'
import FavoriteButton from '@/Components/FavoriteButton/FavoriteButton'
import { ISensor } from '@/Contexts/FavoritesContext'
import SensorService from '@/Services/Sensor'

export interface ISensorProps extends Omit<ISensor, 'type'> {}

export default function Sensor (props: ISensorProps): ReactElement {
  const emptyPlot: IPlot = {
    id: `${props.datasetId}.${props.name}.line`,
    dimensions: {
      x: {
        parameter: 'time'
      },
      y: {
        parameter: `${props.valueName} (${props.valueUnits})`
      }
    },
    style: {
      strokeColor: '#3b82f6ff',
      strokeWidth: 2
    },
    type: EPlotTypes.line
  }
  const [plots, setPlots] = useState<IPlot[]>([])

  function getData (): void {
    const newPlot = Object.assign({}, emptyPlot)
    newPlot.dataService = SensorService.getDataServiceForSensorChart(props)
    setPlots([newPlot])
  }

  useEffect(getData, [])

  if (plots.length > 0) {
    return (
      <div>
        <div className='flex justify-between pr-4 pt-4'>
          <div className='text-md uppercase font-semibold text-slate-500 px-4 pt-4 break-words max-w-[calc(100vw-32px-8px)]'>{props.valueName} ({props.valueUnits})</div>
          <FavoriteButton
            favorite={{
              ...props,
              type: 'sensor'
            }}
          />
        </div>
        <Chart
          // TODO: How to ensure that y axis labels are not cut off?
          settings={{ width: 'auto', height: 300, margin: { left: 40, right: 40, bottom: 30, top: 10 } }}
          plots={plots}
        />
      </div>
    )
  } else {
    return <div>loading</div>
  }
}
