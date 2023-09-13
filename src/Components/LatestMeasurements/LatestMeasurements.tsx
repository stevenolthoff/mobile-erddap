import useMetadata from '@/Hooks/useMetadata'
import { VariableToAttribute } from '@axdspub/erddap-service/lib/parser'
import { DateTime } from 'luxon'
import React, { type ReactElement, useState, useEffect } from 'react'
import { ClipLoader } from 'react-spinners'
import FavoriteButton from '../FavoriteButton/FavoriteButton'
import { ILatestMeasurement } from '@/Contexts/FavoritesContext'
import SensorService from '@/Services/Sensor'
import { Loader } from '@axdspub/axiom-ui-utilities'

interface ILatestMeasurementsProps extends Omit<ILatestMeasurement, 'type'> {
  hideFavoriteButton?: boolean
}

type ColumnName = string
type Measurement = string
type LatestMeasurement = Record<ColumnName, Measurement>
type Row = { sensor: string, measurement: string, date: string }

export default function LatestMeasurements (props: ILatestMeasurementsProps): ReactElement {
  const [loading, setLoading] = useState(true)
  const [data, setData] = useState<LatestMeasurement[]>()
  const [metadata, metadataLoading] = useMetadata(props.datasetId)
  const [columnNames, setColumnNames] = useState<string[]>([])
  const [sensorMetadata, setSensorMetadata] = useState<VariableToAttribute>({})
  const [hasData, setHasData] = useState<boolean | undefined>(undefined)

  useEffect(() => {
    if (metadataLoading) return
    setColumnNames(Object.keys(metadata.sensors))
    setSensorMetadata(metadata.sensors)
  }, [metadataLoading])

  useEffect(() => {
    if (metadataLoading && columnNames.length > 0) return
    SensorService.getLatestMeasurementsData(props.datasetId, columnNames).then(result => {
      setData(result.data)
      setHasData(result.parsed !== null)
      setLoading(false)
    }).catch(error => {
      console.error(error)
    })
  }, [columnNames])

  function getUnits (columnName: string): string {
    const { units } = sensorMetadata[columnName]
    if (units) {
      return units.Value
    } else {
      return ''
    }
  }

  function getPrettyName (columnName: string): string {
    return sensorMetadata[columnName].long_name.Value
  }

  function getPrettyValue (columnName: string, value: string): ReactElement {
    if (value === 'NaN') {
      return <i className='text-xs uppercase text-slate-500'>No Measurement Found</i>
    } else {
      return <span>{Number(value).toFixed(2)} <span className='text-xs'>{getUnits(columnName)}</span></span>
    }
  }

  function getPrettyDate (date: string) {
    if (date === '-') {
      return <span className='text-xs text-slate-500'>-</span>
    } else {
      const dateTime = DateTime.fromISO(date)
      return <div><div>{dateTime.toFormat('hh:mm:ss a')}</div><div className='text-slate-500 text-xs leading-none'>{dateTime.toFormat('D')}</div></div>
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

  function getRows (): Row[] {
    if (!data) return []
    const measurements = data.slice(1).reverse()
    return Object.keys(sensorMetadata).map(sensor => {
      const latest = measurements.find(measurement => measurement[sensor] !== 'NaN')
      return {
        sensor,
        measurement: latest ? latest[sensor] : 'NaN',
        date: latest ? latest.time : '-'
      }
    })
  }

  function getRowElements (rows: Row[]): JSX.Element[] {
    const rowElements: JSX.Element[] = []
    const rowClassName = 'text-slate-800 px-0 md:px-4 py-2 text-sm'
    rows.forEach(row => {
      const { sensor, measurement, date } = row
      const sensorColumn = <div key={`sensor-${sensor}`} className={rowClassName}>{getPrettyName(sensor)}</div>
      const measurementColumn = <div key={`sensor-measurement-${sensor}`} className={rowClassName}>{getPrettyValue(sensor, measurement)}</div>
      const dateColumn = <div key={`date-${sensor}`} className={rowClassName}>{getPrettyDate(date)}</div>
      rowElements.push(...[sensorColumn, measurementColumn, dateColumn])
    })
    return rowElements
  }

  function getTableRows () {
    return getRowElements(getRows())
  }

  const headerClassName = 'text-slate-500 px-0 md:px-4 font-semibold text-xs uppercase py-2 border-t'

  const EmptyState = () => {
    const className = 'h-[300px] flex justify-center items-center bg-slate-200 rounded-lg text-slate-500 text-sm'
    if (hasData) {
      return <></>
    } else if (hasData === undefined) {
      return <div className={`${className} animate-pulse`}><Loader /></div>
    } else {
      return <div className={className}>No data collected in this time period.</div>
    }
  }

  const Table = () => {
    if (loading || !hasData) {
      return <></>
    } else {
      return (
        <div className='grid grid-cols-3 divide-y'>
          <div className={headerClassName}>Sensor</div>
          <div className={headerClassName}>Measurement</div>
          <div className={headerClassName}>Time</div>
          {loading ? <></> : getTableRows() }
        </div>
      )
    }
  }

  return <div className='flex flex-col gap-2'>
    {
      props.hideFavoriteButton ? 
      <></> :
      <div className='w-full flex flex-row-reverse'>
        <FavoriteButton
          favorite={{
            ...props,
            type: 'latest-measurements'
          }}
        />
      </div>
    }
    <EmptyState />
    <Table />
  </div>
}
