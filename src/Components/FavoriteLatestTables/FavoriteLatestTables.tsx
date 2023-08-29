import { useFavoritesContext } from '@/Contexts/FavoritesContext'
import { ReactElement, useState } from 'react'
import FavoriteLatestTable from '@/Components/FavoriteLatestTable/FavoriteLatestTable'

const FavoriteLatestTables = (): ReactElement => {
  const { latestMeasurements } = useFavoritesContext()
  const [copied] = useState(Object.assign({}, latestMeasurements))
  if (Object.keys(copied).length === 0) {
    return <div className='p-4 italic text-slate-500 text-sm'>No Tables Saved</div>
  }
  return <div className='divide-y flex flex-col divide-slate-300'>
    {Object.entries(copied)
      .sort(([idA, sensorA], [idB, sensorB]) => {
        if (sensorA.station.title < sensorB.station.title) {
          return -1
        } else if (sensorA.station.title > sensorB.station.title) {
          return 1
        } else {
          return 0
        }
      })
      .map(([id, latestMeasurement]) => {
      return (
        <FavoriteLatestTable id={id} latestMeasurement={latestMeasurement}></FavoriteLatestTable>
      )
    })}
  </div>
}

export default FavoriteLatestTables
