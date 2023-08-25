import React, { type ReactElement, useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import LatestMeasurements from '@/Components/LatestMeasurements/LatestMeasurements'
import FavoriteButton from '@/Components/FavoriteButton/FavoriteButton'
import useMetadata from '@/Hooks/useMetadata'
import Sensors from '@/Components/Sensors/Sensors'
import StationMap from '@/Components/StationMap/StationMap'
import MobileTabs from '@/Components/MobileTabs/MobileTabs'
import { IStation } from '@/Contexts/FavoritesContext'

export default function Station (): ReactElement {
  const params = useParams()
  const datasetId = params.datasetId as string
  const [metadata, metadataLoading] = useMetadata(datasetId)
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [station, setStation] = useState<IStation>()

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

  function getStation (): IStation {
    return { title, summary: description, datasetId, type: 'station' }
  }

  useEffect(() => {
    if (metadataLoading) return
    setTitle(getStationName())
    setDescription(getDescription())
  }, [metadataLoading])
  
  useEffect(() => {
    setStation(getStation())
  }, [title, description])

  function getTabPage (tabId: string): ReactElement {
    const headerClassName = 'px-4 text-md text-slate-500 pb-2'
    if (tabId === 'charts') {
      return (
        <div className='overflow-y-scroll max-h-full max-w-full no-scrollbar'>
          <div className={headerClassName}>Past 7 Days</div>
          <Sensors station={getStation()} />
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

  return <div className="flex flex-col gap-2 overflow-y-scroll overflow-x-hidden max-h-full no-scrollbar scrollbox bg-slate-100">
    <div className='w-full flex flex-row-reverse right-0 pt-4 px-4'>
      { station ? <FavoriteButton favorite={station} /> : <div className='w-[32px] h-[32px] bg-slate-300 rounded-full'></div> }
    </div>
    <div className="px-4 text-xl font-semibold leading-none text-slate-800">{title}</div>
    <div className="px-4 text-xs text-slate-500 leading-tight">{description}</div>
    <div className='py-2'><StationMap datasetId={datasetId} /></div>
    <MobileTabs
      tabs={[
        {
          id: 'charts',
          label: 'Charts',
          content: getTabPage('charts')
        },
        {
          id: 'latest',
          label: 'Latest',
          content: getTabPage('latest')
        }
      ]}
    />
  </div>
}
