import { ISensor } from '@/Contexts/FavoritesContext'
import { ReactElement } from 'react'
import Sensor from '@/Components/Sensor/Sensor'
import { Link, useLocation } from 'react-router-dom'

const FavoriteSensor = ({ id, sensor }: { id: string, sensor: ISensor}): ReactElement => {
  const { search } = useLocation()
  const { datasetId } = sensor.station

  return (
    <Link
      key={`station-${datasetId}`}
      to={`/stations/${datasetId}${search}`}
    >
      <div key={id}>
        <div className='px-4 pt-2 font-semibold text-slate-800'>
          {sensor.station.title}
        </div>
        <Sensor {...sensor}></Sensor>
      </div>
    </Link>
  )
}

export default FavoriteSensor
