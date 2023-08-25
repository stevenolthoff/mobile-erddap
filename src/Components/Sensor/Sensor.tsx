'use client'

import React, { type ReactElement, useState, useEffect } from 'react'
import { api } from '@axdspub/erddap-service'
import { Chart, EPlotTypes, type IPlot } from '@axdspub/axiom-charts'
import FavoriteButton from '../FavoriteButton/FavoriteButton'
import TimeFrameService, { ETimeFrame } from '@/Services/TimeFrame'
import { ISensor } from '@/Contexts/FavoritesContext'
const SERVER = 'https://erddap.sensors.axds.co/erddap'

// load from app-level config
const TIME_PROP = 'time (UTC)'

interface ISensorProps extends Omit<ISensor, 'type'> {}

export default function Sensor (props: ISensorProps): ReactElement {
  const timeFrame = TimeFrameService.getTimeFrame(props.timeFrame)
  const erddapApi = new api.ErddapApi(SERVER)
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
    console.log(props)
    const variables = ['time', props.name]
    const url = erddapApi.getUrl({
      protocol: 'tabledap',
      response: 'csvp',
      dataset_id: props.datasetId,
      variables,
      constraints: [
        {
          name: 'time',
          operator: '>=',
          value: timeFrame.start
        },
        {
          name: 'time',
          operator: '<=',
          value: timeFrame.end
        }
      ]
    })
    const newPlot = Object.assign({}, emptyPlot)
    newPlot.dataService = {
      resultType: 'csv',
      type: '',
      url,
      parser: {
        type: 'erddapTimeSeries',
        args: {
          valueProp: `${props.valueName} (${props.valueUnits})`,
          timeProp: TIME_PROP
        }
      }
    }
    setPlots([newPlot])
  }

  useEffect(getData, [])

  if (plots.length > 0) {
    return (
      <div>
        <div className='flex justify-between pr-4 pt-4'>
          <div className='text-xs uppercase font-semibold text-slate-500 px-4 pt-4'>{props.valueName}</div>
          <FavoriteButton
            favorite={{
              ...props,
              type: 'sensor'
            }}
            typeOfFavorite='sensor'
          />
        </div>
        <Chart
          // TODO: How to ensure that y axis labels are not cut off?
          settings={{ width: 'auto', height: 500, margin: { left: 30, right: 10, bottom: 30, top: 10 } }}
          plots={plots}
        />
      </div>
    )
  } else {
    return <div>loading</div>
  }
}
