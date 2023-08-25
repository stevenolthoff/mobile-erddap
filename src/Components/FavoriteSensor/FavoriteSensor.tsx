import { ISensor } from '@/Contexts/FavoritesContext'
import { ReactElement } from 'react'
import Sensor from '@/Components/Sensor/Sensor'
import { Link, useLocation } from 'react-router-dom'
import TimeFrame from '@/Components/TimeFrame/TimeFrame'
import TimeFrameService from '@/Services/TimeFrame'

const FavoriteSensor = ({ id, sensor }: { id: string, sensor: ISensor}): ReactElement => {
  const { search } = useLocation()
  const { datasetId } = sensor.station

  return (
    <Link
      key={`station-${datasetId}`}
      to={`/stations/${datasetId}${search}`}
    >
      <div key={id}>
        <div className='px-4 pt-2 text-slate-500'>
          {sensor.station.title}
        </div>
        <TimeFrame timeFrame={TimeFrameService.getTimeFrame(sensor.timeFrame)} />
        <Sensor {...sensor}></Sensor>
      </div>
    </Link>
  )
}

export default FavoriteSensor
