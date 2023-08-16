import React, { ReactElement } from 'react'
import { IFavorite, useFavoritesContext } from '../../Contexts/FavoritesContext'
import { BookmarkIcon } from '@radix-ui/react-icons'

export default function FavoriteButton ({ favorite }: { favorite: IFavorite}): ReactElement {
  const { addFavorite } = useFavoritesContext()
  
  function onClickFavorite (event: React.MouseEvent<HTMLDivElement, MouseEvent>) {
    event.preventDefault()
    event.stopPropagation()
    addFavorite(favorite)
  }

  return (
    <div
      onClick={event => onClickFavorite(event)}
      className='border border-slate-800 text-slate-800 rounded-full w-8 h-8 shrink-0 flex justify-center items-center hover:bg-slate-300 hover:text-white hover:border-white'>
        <BookmarkIcon></BookmarkIcon>
    </div>
  )
}
