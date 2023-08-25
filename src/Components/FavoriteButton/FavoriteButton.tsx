import React, { ReactElement } from 'react'
import { ILatestMeasurement, ISensor, IStation, useFavoritesContext } from '@/Contexts/FavoritesContext'
import { HeartIcon, HeartFilledIcon } from '@radix-ui/react-icons'

interface IFavoriteButtonProps {
  favorite: IStation | ISensor | ILatestMeasurement
}

export default function FavoriteButton ({ favorite }: IFavoriteButtonProps): ReactElement {
  const { toggleFavorite, isFavorited } = useFavoritesContext()
  
  function onClickFavorite (event: React.MouseEvent<HTMLDivElement, MouseEvent>) {
    event.preventDefault()
    event.stopPropagation()
    toggleFavorite(favorite)
  }

  function getFilledIcon () {
    return (
      <div
        onClick={event => onClickFavorite(event)}
        className='border border-blue-500 cursor-pointer rounded-full w-8 h-8 shrink-0 flex justify-center items-center'
      >
        <HeartFilledIcon className='text-blue-500' />
      </div>
    )
  }

  function getEmptyIcon () {
    return (
      <div
        onClick={event => onClickFavorite(event)}
        className='border border-slate-800 cursor-pointer text-slate-800 rounded-full w-8 h-8 shrink-0 flex justify-center items-center'
      >
        <HeartIcon />
      </div>
    )
  }

  function getIcon () {
    if (isFavorited(favorite)) {
      return getFilledIcon()
    } else {
      return getEmptyIcon()
    }
  }

  return (
    <div
      onClick={event => onClickFavorite(event)}
    >
        {getIcon()}
    </div>
  )
}
