import Sensor from '@/Components/Sensor/Sensor'
import { ReactElement } from 'react'
import useMetadata from '@/Hooks/useMetadata'
import TimeFrameService from '@/Services/TimeFrame'
import { IStation } from '@/Contexts/FavoritesContext'

interface ISensorsProps {
  station: IStation
}

export default function Sensors (props: ISensorsProps) {
  const { station } = props
  const { datasetId } = station
  const [metadata, metadataLoading] = useMetadata(datasetId)
  const { sensors } = metadata
  const { start, end } = TimeFrameService.getTimeFrame('past-week')

  function getDate (): ReactElement {
    return (
      <div className='px-4 uppercase text-xs font-semibold text-slate-800 w-full flex pb-2'>
        {start.toLocaleDateString('en-us', { dateStyle: 'medium' })} - {end.toLocaleDateString('en-us', { dateStyle: 'medium' })}
      </div>
    )
  }

  const listItems = Object.keys(sensors).map(key => {
    const sensor = sensors[key]
    if (!sensor.units) {
      return null
    }
    const valueName = sensors[key].units['Variable Name']
    const valueUnits = sensors[key].units.Value
    return <div key={key}>
      <Sensor
        name={key}
        datasetId={datasetId}
        valueName={valueName}
        valueUnits={valueUnits}
        timeFrame='past-week'
        station={station}
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
