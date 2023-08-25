import { ILatestMeasurement, useFavoritesContext } from '@/Contexts/FavoritesContext'
import { ReactElement } from 'react'
import LatestMeasurements from '@/Components/LatestMeasurements/LatestMeasurements'
import { Link, useLocation } from 'react-router-dom'

const FavoriteLatestTable = ({ id, latestMeasurement }: { id: string, latestMeasurement: ILatestMeasurement }): ReactElement => {
  const { search } = useLocation()
  const { datasetId } = latestMeasurement.station

  return (
    <Link
      key={`station-${datasetId}`}
      to={`/stations/${datasetId}${search}`}
    >
      <div key={id} className='px-4'>
        <div className='pt-2 text-slate-500'>
          {latestMeasurement.station.title}
        </div>
        <LatestMeasurements {...latestMeasurement} />
      </div>
    </Link>
  )
}

export default FavoriteLatestTable
