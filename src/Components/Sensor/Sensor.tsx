'use client'

import React, { type ReactElement, useState, useEffect } from 'react'
import { api } from '@axdspub/erddap-service'
import { Chart, EPlotTypes, type IPlot } from '@axdspub/axiom-charts'
const SERVER = 'https://erddap.sensors.axds.co/erddap'

interface ISensorProps {
  name: string
  datasetId: string
  valueName: string
  valueUnits: string
  startDate: Date
  endDate: Date
}

// load from app-level config
const TIME_PROP = 'time (UTC)'

export default function Sensor (props: ISensorProps): ReactElement {
  // return <div>sensor</div>
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
      strokeWidth: 1
    },
    type: EPlotTypes.line
  }
  const [plots, setPlots] = useState<IPlot[]>([])

  function getData (): void {
    console.log(props)
    const variables = ['time', props.name]
    const url = erddapApi.getUrl({
      request: 'tabledap',
      response: 'csvp',
      dataset_id: props.datasetId,
      variables,
      constraints: [
        {
          name: 'time',
          operator: '>=',
          value: props.startDate
        },
        {
          name: 'time',
          operator: '<=',
          value: props.endDate
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
    return <Chart
      // TODO: How to ensure that y axis labels are not cut off?
      settings={{ width: 'auto', height: 500, margin: { left: 30, right: 10, bottom: 30, top: 10 } }}
      plots={plots}
    />
  } else {
    return <div>loading</div>
  }
}
