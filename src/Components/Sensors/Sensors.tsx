import { IParsedDatasetMetadata } from "@axdspub/erddap-service/lib/parser"
import Sensor from "@/Components/Sensor/Sensor"
import { ReactElement } from "react"
import useMetadata from "@/Hooks/useMetadata"

interface ISensorsProps {
  datasetId: string
  startDate: Date
  endDate: Date
}

export default function Sensors (props: ISensorsProps) {
  const { datasetId, startDate, endDate } = props
  const [metadata, metadataLoading] = useMetadata(props.datasetId)
  const { sensors } = metadata

  function getDate (): ReactElement {
    return <div className='px-4 uppercase text-xs font-semibold text-slate-800 w-full flex pb-2'>{startDate.toLocaleDateString('en-us', { dateStyle: 'medium' })} - {endDate.toLocaleDateString('en-us', { dateStyle: 'medium' })}</div>
  }
  console.log('sensors', metadata)
  const listItems = Object.keys(sensors).map(key => {
    const sensor = sensors[key]
    if (!sensor.units) {
      return null
    }
    const valueName = sensors[key].units['Variable Name']
    const valueUnits = sensors[key].units.Value
    return <div key={key}>
      <div className='text-xs uppercase font-semibold text-slate-500 px-4 pt-4'>{valueName}</div>
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
    {getDate()}
    <div className='flex flex-col gap-8 divide-y'>
      {listItems}
    </div>
  </div>
}
