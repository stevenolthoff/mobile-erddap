import { useFavoritesContext } from '@/Contexts/FavoritesContext'
import { ReactElement, useState } from 'react'
import FavoriteSensor from '@/Components/FavoriteSensor/FavoriteSensor'

const FavoriteSensors = (): ReactElement => {
  const { sensors } = useFavoritesContext()
  const [copied] = useState(Object.assign({}, sensors))

  function getFavoriteSensors () {
    return Object.entries(copied)
      .sort(([idA, sensorA], [idB, sensorB]) => {
        if (sensorA.station.title < sensorB.station.title) {
          return -1
        } else if (sensorA.station.title > sensorB.station.title) {
          return 1
        } else {
          return 0
        }
      })
      .map(([id, sensor]) => <FavoriteSensor id={id} sensor={sensor} />)
  }

  return <div className='flex flex-col gap-4 divide-y divide-slate-300'>
    {getFavoriteSensors()}
  </div>
}

export default FavoriteSensors
