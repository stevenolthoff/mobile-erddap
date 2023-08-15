import React, { type ReactElement, useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { DataService, type IDataResult } from '@axdspub/axiom-ui-data-services'
import { api as ErddapService } from '@axdspub/erddap-service'
import { parser as ErddapParser } from '@axdspub/erddap-service'
import Sensor from '../../Components/Sensor/Sensor'
import LatestMeasurements from '../../Components/LatestMeasurements/LatestMeasurements'
import Tabs from '../../Components/Tabs/Tabs'

const SERVER = 'https://erddap.sensors.axds.co/erddap'

export default function Station (): ReactElement {
  const params = useParams()
  const datasetId = params.datasetId as string
  const [metadata, setMetadata] = useState<ErddapParser.IParsedDatasetMetadata>({ axes: {}, sensors: {}, station: {}, ncGlobal: {} })
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const erddapApi = new ErddapService.ErddapApi(SERVER)
  const startDate: Date = getLastWeeksDate()
  const endDate: Date = new Date()

  async function getMetadata (): Promise<IDataResult> {
    const url = erddapApi.getUrl({ request: 'info', response: 'csv', dataset_id: datasetId })
    const dataService = new DataService({ type: '', resultType: 'csv', url })
    return await dataService.get()
  }

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
    getMetadata().then(dataResult => {
      console.log(dataResult.data)
      const parsed = ErddapParser.parseDatasetMetadata(dataResult.data)
      setMetadata(parsed)
    }).catch(error => {
      console.error(error)
    })
  }, [])

  useEffect(() => {
    setTitle(getStationName())
    setDescription(getDescription())
  }, [metadata])

  function getSensors (): ReactElement {
    const { sensors } = metadata
    const listItems = Object.keys(sensors).map(key => {
      console.log(key, sensors[key].units.Value, sensors[key].units['Variable Name'])
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
    })
    return <div>
      <div className='text-md text-slate-500 pb-2'>Past 7 Days</div>
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
    return <LatestMeasurements
      datasetId={datasetId}
      columnNames={Object.keys(metadata.sensors)}
      sensorMetadata={metadata.sensors}
    />
  }

  function getDate (): ReactElement {
    return <div className='uppercase text-xs font-semibold text-slate-800 w-full flex pb-2'>{startDate.toLocaleDateString('en-us', { dateStyle: 'medium' })} - {endDate.toLocaleDateString('en-us', { dateStyle: 'medium' })}</div>
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

  return <div className="flex flex-col gap-2 overflow-y-scroll overflow-x-hidden max-h-full no-scrollbar">
    <div className="text-lg font-semibold leading-none text-slate-800">{title}</div>
    <div className="text-xs text-slate-500 leading-tight">{description}</div>

    <Tabs tabs={[
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
