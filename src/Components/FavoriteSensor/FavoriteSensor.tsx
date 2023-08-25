import { ISensor } from '@/Contexts/FavoritesContext'
import { ReactElement } from 'react'
import Sensor from '@/Components/Sensor/Sensor'

const FavoriteSensor = ({ id, sensor }: { id: string, sensor: ISensor}): ReactElement => {
  return (
    <div key={id}>
      <div>
        {sensor.station.title}
      </div>
      <Sensor {...sensor}></Sensor>
    </div>
  )
}

export default FavoriteSensor
