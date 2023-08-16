import { DataService, type IDataResult } from '@axdspub/axiom-ui-data-services'
import { api, parser } from '@axdspub/erddap-service'
import React, { type ReactElement, useState, useEffect } from 'react'
import { ClipLoader } from 'react-spinners'

interface ILatestMeasurementsProps {
  datasetId: string
  columnNames: string[]
  sensorMetadata: parser.VariableToAttribute
}

type ColumnName = string
type Measurement = string
type LatestMeasurement = Record<ColumnName, Measurement>

export default function LatestMeasurements (props: ILatestMeasurementsProps): ReactElement {
  const SERVER = 'https://erddap.sensors.axds.co/erddap'
  const erddapApi = new api.ErddapApi(SERVER)
  const [loading, setLoading] = useState(true)
  const [data, setData] = useState<LatestMeasurement[]>()

  async function getData (): Promise<IDataResult> {
    const variables = ['time', ...props.columnNames]
    const url = erddapApi.getUrl({
      protocol: 'tabledap',
      response: 'csv',
      dataset_id: props.datasetId,
      variables,
      constraints: [
        {
          name: 'time',
          operator: '>=',
          value: getStartDate()
        },
        {
          name: 'time',
          operator: '<=',
          value: new Date()
        }
      ]
    })
    const dataService = new DataService({ type: '', resultType: 'csv', url })
    return await dataService.get()
  }

  useEffect(() => {
    getData().then(result => {
      console.log(result.data)
      setData(result.data)
      setLoading(false)
      console.log(data)
    }).catch(error => {
      console.error(error)
    })
  }, [])

  function getStartDate (): Date {
    const now = new Date()
    return new Date(now.getFullYear(), now.getMonth(), now.getDate() - 1)
  }

  function getUnits (columnName: string): string {
    const { units } = props.sensorMetadata[columnName]
    if (units) {
      return units.Value
    } else {
      return ''
    }
  }

  function getPrettyName (columnName: string): string {
    return props.sensorMetadata[columnName].long_name.Value
  }

  function getPrettyTime (time: string): string {
    const date = new Date(time)
    return `${date.toLocaleDateString('en-us', { dateStyle: 'long' })} ${date.toLocaleTimeString('en-us', { timeStyle: 'long' })}`
  }

  function getPrettyValue (columnName: string, latest: Record<string, string>): ReactElement {
    if (latest[columnName] === 'NaN') {
      return <i className='text-xs uppercase text-slate-500'>No Measurement Found</i>
    } else {
      return <span>{Number(latest[columnName]).toFixed(2)} <span className='text-xs'>{getUnits(columnName)}</span></span>
    }
  }

  function getLoader (): ReactElement | null {
    if (loading) {
      return <div className='w-full flex justify-center py-2'>
        <ClipLoader color='#3b82f6' />
      </div>
    } else {
      return null
    }
  }

  let latest: LatestMeasurement
  const rows: ReactElement[] = []
  let time = ''
  if (data !== null && data !== undefined) {
    latest = data[data.length - 1]
    const rowClassName = 'text-slate-800 px-2 md:px-4 py-2 text-sm'
    Object.keys(props.sensorMetadata).forEach(key => {
      rows.push(<div key={`name-${key}`} className={rowClassName}>{getPrettyName(key)}</div>)
      rows.push(<div key={`value-${key}`} className={rowClassName}>{getPrettyValue(key, latest)}</div>)
    })
    time = getPrettyTime(latest.time)
  }

  const headerClassName = 'bg-slate-100 text-slate-500 px-2 md:px-4 font-semibold text-xs uppercase py-2 border-t-0'
  const loadingText = <div className="rounded-md bg-slate-100 h-4 w-32 animate-pulse"></div>

  return <div className='flex flex-col gap-2'>
    <div className='text-md text-slate-500'>Latest Measurements</div>
    <div className='uppercase text-xs font-semibold text-slate-800 w-full flex'>Recorded on&nbsp;{loading ? loadingText : time}</div>
    <div className='grid grid-cols-2 divide-y'>
      <div className={headerClassName}>Sensor</div><div className={headerClassName}>Measurement</div>
      {rows}
    </div>
    {getLoader()}
  </div>
}
