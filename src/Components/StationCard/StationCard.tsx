import React, { type ReactElement } from 'react'
import { BookmarkIcon, BookmarkFilledIcon } from '@radix-ui/react-icons'
import { useFavoritesContext } from '../../Contexts/FavoritesContext'
import { useNavigate } from 'react-router-dom'

interface StationCardProps {
  datasetId: string
  startDate: Date
  endDate: Date
  title: string
  summary: string
}

export default function StationCard (props: StationCardProps): ReactElement {
  const { datasetId, startDate, endDate, title, summary } = props
  const { favorites, addFavorite } = useFavoritesContext()
  const navigate = useNavigate()
  console.log('favorites', favorites)
  const formatter = (date: Date) => 
    date.toLocaleDateString('en-us', {
      weekday: 'long', year: 'numeric', month: 'short', day: 'numeric'
    })

  function onClickFavorite (event: React.MouseEvent<SVGElement, MouseEvent>) {
    event.stopPropagation()
    addFavorite({ datasetId, title, summary })
  }

  return (
    <div
      onClick={() => navigate(`/stations/${datasetId}`)}
      className='absolute bg-slate-100 bottom-16 mx-4 my-4 p-3 left-0 right-0 rounded-md
      shadow-md leading-4 gap-2 flex flex-col active:bg-slate-300'>
      <div className='flex justify-between'>
        <div className='font-semibold uppercase text-slate-800'>{title}</div>
        <BookmarkIcon onClick={event => onClickFavorite(event)}></BookmarkIcon>
      </div>
      <div className='text-sm leading-3 text-slate-500'>{formatter(startDate)} to {formatter(endDate)}</div>
      <div className='text-sm leading-3 text-slate-500'>{summary}</div>
    </div>
  )
}
