import React, { ReactElement } from 'react'
import { IFavorite, useFavoritesContext } from '../../Contexts/FavoritesContext'
import { BookmarkIcon, BookmarkFilledIcon } from '@radix-ui/react-icons'

interface IFavoriteButtonProps {
  favorite: IFavorite
  isFavorited: boolean
}

export default function FavoriteButton (props: IFavoriteButtonProps): ReactElement {
  const { favorite, isFavorited } = props
  const { toggleFavorite } = useFavoritesContext()
  
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
        <BookmarkFilledIcon className='text-blue-500' />
      </div>
    )
  }

  function getEmptyIcon () {
    return (
      <div
        onClick={event => onClickFavorite(event)}
        className='border border-slate-800 cursor-pointer text-slate-800 rounded-full w-8 h-8 shrink-0 flex justify-center items-center'
      >
        <BookmarkIcon />
      </div>
    )
  }

  function getIcon () {
    if (isFavorited) {
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
