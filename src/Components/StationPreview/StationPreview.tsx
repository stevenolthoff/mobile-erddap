import React, { type ReactElement } from 'react'
import { IFavorite, useFavoritesContext } from '../../Contexts/FavoritesContext'
import { useNavigate } from 'react-router-dom'
import FavoriteButton from '../FavoriteButton/FavoriteButton'
import LatestMeasurements from '@/Components/LatestMeasurements/LatestMeasurements'

export default function StationPreview (favorite: IFavorite): ReactElement {
  const { datasetId, startDate, endDate, title, summary } = favorite
  const { isFavorited } = useFavoritesContext()
  const navigate = useNavigate()
  const formatter = (date: string) => 
  new Date(date).toLocaleDateString('en-us', {
    weekday: 'long', year: 'numeric', month: 'short', day: 'numeric'
  })

  return (
    <div
      onClick={() => navigate(`/stations/${datasetId}`)}
      className='absolute bottom-20 mx-4 bg-slate-100 p-3 rounded-md no-scrollbar
      shadow-md leading-4 gap-2 flex flex-col active:bg-slate-300 min-h-[30vh] max-h-[30vh] overflow-y-scroll'>
      <div className='flex justify-between'>
        <div className='font-semibold uppercase text-slate-800'>{title}</div>
        <FavoriteButton favorite={favorite} isFavorited={isFavorited(favorite.datasetId)} />
      </div>
      <div className='text-sm leading-3 text-slate-500'>{formatter(startDate)} to {formatter(endDate)}</div>
      <div className='text-sm leading-3 text-slate-500'>{summary}</div>
      <LatestMeasurements datasetId={datasetId} />
    </div>
  )
}
