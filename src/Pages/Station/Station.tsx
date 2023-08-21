import React, { type ReactElement, useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import Sensor from '@/Components/Sensor/Sensor'
import LatestMeasurements from '@/Components/LatestMeasurements/LatestMeasurements'
import Tabs from '@/Components/Tabs/Tabs'
import { ClipLoader } from 'react-spinners'
import FavoriteButton from '@/Components/FavoriteButton/FavoriteButton'
import { useFavoritesContext } from '@/Contexts/FavoritesContext'
import useMetadata from '@/Hooks/useMetadata'
import Sensors from '@/Components/Sensors/Sensors'

const SERVER = 'https://erddap.sensors.axds.co/erddap'

export default function Station (): ReactElement {
  const params = useParams()
  const datasetId = params.datasetId as string
  const [metadata, metadataLoading] = useMetadata(datasetId)
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
    setLoading(metadataLoading)
  }, [metadataLoading])

  useEffect(() => {
    if (metadataLoading) return
    setTitle(getStationName())
    setDescription(getDescription())
  }, [metadataLoading])

  function getLastWeeksDate (): Date {
    const now = new Date()
    return new Date(now.getFullYear(), now.getMonth(), now.getDate() - 7)
  }

  function getTabPage (tabId: string): ReactElement {
    const headerClassName = 'px-4 text-md text-slate-500 pb-2'
    if (tabId === 'charts') {
      return (
        <div className='overflow-y-scroll max-h-full max-w-full no-scrollbar'>
          <div className={headerClassName}>Past 7 Days</div>
          <Sensors datasetId={datasetId} startDate={startDate} endDate={endDate} />
        </div>
      )
    } else if (tabId === 'latest') {
      return (
        <div>
          <div className={headerClassName}>Latest Measurements</div>
          <div className='px-4'>
            <LatestMeasurements datasetId={datasetId} />
          </div>
        </div>
      )
    } else {
      return <></>
    }
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
        content: getTabPage('charts'),
        className: tabTriggerClassName
      },
      {
        id: 'latest',
        label: 'Latest',
        content: getTabPage('latest'),
        className: tabTriggerClassName
      }
    ]} />
  </div>
}
