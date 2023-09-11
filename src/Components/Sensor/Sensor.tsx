'use client'

import React, { type ReactElement, useState, useEffect, useRef } from 'react'
import { Chart, EPlotTypes, IPlotScrubPosition, IPlotScrubPositions, type IPlot } from '@axdspub/axiom-charts'
import FavoriteButton from '@/Components/FavoriteButton/FavoriteButton'
import { ISensor } from '@/Contexts/FavoritesContext'
import SensorService from '@/Services/Sensor'
import { apStyleTitleCase } from 'ap-style-title-case'
import { DateTime } from 'luxon'

export interface ISensorProps extends Omit<ISensor, 'type'> {}

export default function Sensor (props: ISensorProps): ReactElement {
  const [scrubPosition, setScrubPosition] = useState<IPlotScrubPosition | undefined>(undefined)
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
    scrubbing: true,
    type: EPlotTypes.line
  }
  const [plots, setPlots] = useState<IPlot[]>([])
  const scrubRef = useRef<HTMLDivElement>(null)
  const [scrubLabelX, setScrubLabelX] = useState<number | undefined>()

  const getData = (): void => {
    const newPlot = Object.assign({}, emptyPlot)
    newPlot.dataService = SensorService.getDataServiceForSensorChart(props)
    setPlots([newPlot])
  }

  useEffect(getData, [])

  const getPrettyYAxisName = () => {
    return apStyleTitleCase(`${props.valueName} (${props.valueUnits})`.replace(/_/g, ' '))
  }

  const onScrub = (scrubPositions: IPlotScrubPositions) => {
    setScrubPosition(Object.values(scrubPositions)[0])
  }

  useEffect(() => {
    const labelWidth = scrubRef.current?.getBoundingClientRect().width ?? 0
    const xPosition = scrubPosition?.xPosition ?? 0
    const labelX = xPosition - labelWidth / 2
    setScrubLabelX(labelX)
  }, [scrubPosition])

  if (plots.length > 0) {
    return (
      <div>
        <div className='flex justify-between pr-4 pt-4'>
          <div className='text-md uppercase font-semibold text-slate-500 px-4 pt-4 break-words max-w-[calc(100vw-48px-12px)]'>{getPrettyYAxisName()}</div>
          <FavoriteButton
            favorite={{
              ...props,
              type: 'sensor'
            }}
            />
        </div>
        <div className='w-full h-8 relative text-blue-800 font-semibold'>
          <div ref={scrubRef} className='absolute' style={{ left: scrubLabelX }}>
            {String(scrubPosition?.yValue) ?? ''}
          </div>
        </div>
        <Chart
          settings={{ width: 'auto', height: 300, margin: { left: 50, right: 40, bottom: 30, top: 10 } }}
          plots={plots}
          onScrub={onScrub}
        />
      </div>
    )
  } else {
    return <div>loading</div>
  }
}
