import React, { type ReactElement } from 'react'
import { IStations } from '../../Contexts/FavoritesContext'
import { useNavigate } from 'react-router-dom'
import FavoriteButton from '../FavoriteButton/FavoriteButton'
import LatestMeasurements from '@/Components/LatestMeasurements/LatestMeasurements'

export default function StationPreview (favorite: IStations): ReactElement {
  const { datasetId, title, summary } = favorite
  const navigate = useNavigate()

  return (
    <div
      onClick={() => navigate(`/stations/${datasetId}`)}
      className='absolute left-0 right-0 bottom-20 mx-4 bg-slate-100 p-3 rounded-md no-scrollbar
      shadow-md leading-4 gap-2 flex flex-col min-h-[30vh] max-h-[30vh] overflow-y-scroll'>
      <div className='flex'>
        <div>
          <div className='pb-2 font-semibold uppercase text-slate-800'>{title}</div>
          <div className='pb-2 text-sm leading-3 text-slate-500'>{summary}</div>
        </div>
        <FavoriteButton
          favorite={favorite}
          typeOfFavorite='station'
        />
      </div>
      <LatestMeasurements datasetId={datasetId} />
    </div>
  )
}
