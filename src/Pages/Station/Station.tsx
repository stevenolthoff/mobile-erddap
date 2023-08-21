import React, { type ReactElement, useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import Sensor from '@/Components/Sensor/Sensor'
import LatestMeasurements from '@/Components/LatestMeasurements/LatestMeasurements'
import Tabs from '@/Components/Tabs/Tabs'
import { ClipLoader } from 'react-spinners'
import FavoriteButton from '@/Components/FavoriteButton/FavoriteButton'
import { useFavoritesContext } from '@/Contexts/FavoritesContext'
import useMetadata from '@/Hooks/useMetadata'

const SERVER = 'https://erddap.sensors.axds.co/erddap'

export default function Station (): ReactElement {
  const params = useParams()
  const datasetId = params.datasetId as string
  const metadata = useMetadata(datasetId)
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [loading, setLoading] = useState(true)
  const { isFavorited } = useFavoritesContext()
  const startDate: Date = getLastWeeksDate()
  const endDate: Date = new Date()

  function getStationName (): string {
    if ('platform_name' in metadata.ncGlobal) {
      return metadata.ncGlobal.platform_name.Value
    } else if ('title' in metadata.ncGlobal) {
      return metadata.ncGlobal.title.Value
    } else {
      return 'Loading Station…'
    }
  }

  function getDescription (): string {
    if ('summary' in metadata.ncGlobal) {
      return metadata.ncGlobal.summary.Value
    } else {
      return ''
    }
  }

  useEffect(() => {
    setLoading(false)
  }, [metadata])

  useEffect(() => {
    setTitle(getStationName())
    setDescription(getDescription())
  }, [metadata])

  function loader () {
    return <div className='w-full flex justify-center py-2'>
      <ClipLoader color='#3b82f6' />
    </div>
  }

  function getSensors (): ReactElement {
    if (loading) return loader()
    const { sensors } = metadata
    const listItems = Object.keys(sensors).map(key => {
      const sensor = sensors[key]
      if (!sensor.units) {
        return null
      }
      const valueName = sensors[key].units['Variable Name']
      const valueUnits = sensors[key].units.Value
      return <div key={key}>
        <div className='text-xs uppercase font-semibold text-slate-500 pt-4'>{valueName}</div>
        <Sensor
          name={key}
          datasetId={datasetId}
          valueName={valueName}
          valueUnits={valueUnits}
          startDate={startDate}
          endDate={endDate}
        />
      </div>
    }).filter(item => item !== null)
    return <div>
      <div className='px-4 text-md text-slate-500 pb-2'>Past 7 Days</div>
      {getDate()}
      <div className='flex flex-col gap-8 divide-y'>
        {listItems}
      </div>
    </div>
  }

  function getLastWeeksDate (): Date {
    const now = new Date()
    return new Date(now.getFullYear(), now.getMonth(), now.getDate() - 7)
  }

  function getLatest (): ReactElement {
    return <LatestMeasurements datasetId={datasetId} />
  }

  function getDate (): ReactElement {
    return <div className='px-4 uppercase text-xs font-semibold text-slate-800 w-full flex pb-2'>{startDate.toLocaleDateString('en-us', { dateStyle: 'medium' })} - {endDate.toLocaleDateString('en-us', { dateStyle: 'medium' })}</div>
  }

  const tabTriggerClassName = `
    text-xs
    w-1/2
    px-4 py-4
    text-slate-500
    data-[state=active]:text-blue-500
    data-[state=active]:border-blue-500
    data-[state=active]:font-light
    hover:bg-blue-100
    rounded-t-md
    border-solid border-b
  `

  return <div className="flex flex-col gap-2 overflow-y-scroll overflow-x-hidden max-h-full no-scrollbar scrollbox">
    <div className='w-full flex flex-row-reverse right-0 pt-4 px-4'>
      <FavoriteButton
        favorite={{ title, summary: description, datasetId, startDate: startDate.toDateString(), endDate: endDate.toDateString() }}
        isFavorited={isFavorited(datasetId)}
      />
    </div>
    <div className="px-4 text-xl font-semibold leading-none text-slate-800">{title}</div>
    <div className="px-4 text-xs text-slate-500 leading-tight">{description}</div>

    <Tabs className='mb-16' tabs={[
      {
        id: 'charts',
        label: 'Charts',
        content: getSensors(),
        className: tabTriggerClassName
      },
      {
        id: 'latest',
        label: 'Latest',
        content: getLatest(),
        className: tabTriggerClassName
      }
    ]} />
  </div>
}
