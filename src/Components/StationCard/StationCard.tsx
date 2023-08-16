import React, { type ReactElement } from 'react'
import { BookmarkIcon, BookmarkFilledIcon } from '@radix-ui/react-icons'
import { IFavorite, useFavoritesContext } from '../../Contexts/FavoritesContext'
import { useNavigate } from 'react-router-dom'
import FavoriteButton from '../FavoriteButton/FavoriteButton'

interface StationCardProps {
  datasetId: string
  startDate: string
  endDate: string
  title: string
  summary: string
}

export default function StationCard (favorite: IFavorite): ReactElement {
  const { datasetId, startDate, endDate, title, summary } = favorite
  const { favorites, addFavorite } = useFavoritesContext()
  const navigate = useNavigate()
  const formatter = (date: string) => 
  new Date(date).toLocaleDateString('en-us', {
    weekday: 'long', year: 'numeric', month: 'short', day: 'numeric'
  })
  
  function onClickFavorite (event: React.MouseEvent<HTMLDivElement, MouseEvent>) {
    event.stopPropagation()
    addFavorite({ datasetId, title, summary, startDate, endDate })
    console.log('favorites', favorites)
  }

  return (
    <div
      onClick={() => navigate(`/stations/${datasetId}`)}
      className='bg-slate-100 bottom-16 p-3 rounded-md
      shadow-md leading-4 gap-2 flex flex-col active:bg-slate-300'>
      <div className='flex justify-between'>
        <div className='font-semibold uppercase text-slate-800'>{title}</div>
        <FavoriteButton favorite={favorite} isFavorited={false} />
      </div>
      <div className='text-sm leading-3 text-slate-500'>{formatter(startDate)} to {formatter(endDate)}</div>
      <div className='text-sm leading-3 text-slate-500'>{summary}</div>
    </div>
  )
}
