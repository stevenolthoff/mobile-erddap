import { IParsedDatasetMetadata } from "@axdspub/erddap-service/lib/parser"
import Sensor from "@/Components/Sensor/Sensor"
import { ReactElement } from "react"
import useMetadata from "@/Hooks/useMetadata"
import TimeFrameService from "@/Services/TimeFrame"

interface ISensorsProps {
  datasetId: string
}

export default function Sensors (props: ISensorsProps) {
  const { datasetId } = props
  const [metadata, metadataLoading] = useMetadata(props.datasetId)
  const { sensors } = metadata
  const { start, end } = TimeFrameService.getTimeFrame('past-week')

  function getDate (): ReactElement {
    return (
      <div className='px-4 uppercase text-xs font-semibold text-slate-800 w-full flex pb-2'>
        {start.toLocaleDateString('en-us', { dateStyle: 'medium' })} - {end.toLocaleDateString('en-us', { dateStyle: 'medium' })}
      </div>
    )
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
        timeFrame='past-week'
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
