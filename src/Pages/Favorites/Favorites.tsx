import React, { ReactElement, useEffect, useState } from 'react'
import { IFavorite, useFavoritesContext } from '@/Contexts/FavoritesContext'
import StationsListItem from '@/Components/StationsListItem/StationsListItem'
import { Link } from 'react-router-dom'
import FavoriteButton from '@/Components/FavoriteButton/FavoriteButton'

export default function Favorites (): ReactElement {
  const { favorites, isFavorited } = useFavoritesContext()
  const [copiedFavorites] = useState(Object.assign({}, favorites))

  function getFavorite (favorite: IFavorite) {
    return (
      <Link
        key={favorite.datasetId}
        to={`/stations/${favorite.datasetId}`}
        className='flex'
      >
        <StationsListItem
          title={favorite.title}
          summary={favorite.summary}
        >
          <FavoriteButton
            favorite={favorite}
            isFavorited={isFavorited(favorite.datasetId)}
          />
        </StationsListItem>
      </Link>
    )
  }

  function getFavorites () {
    if (Object.keys(copiedFavorites).length === 0) {
      return <div className='p-4 italic text-slate-500 text-sm'>No Stations Saved</div>
    }
    return Object.keys(copiedFavorites)
      .sort((a, b) => {
        if (copiedFavorites[a].title < copiedFavorites[b].title) {
          return -1
        } else if (copiedFavorites[a].title > copiedFavorites[b].title) {
          return 1
        } else {
          return 0
        }
      })
      .map(datasetId => getFavorite(copiedFavorites[datasetId]))
  }

  return (
    <div className='max-h-full max-w-full overflow-scroll no-scrollbar scrollbox'>
      <div className='px-4 pt-4 text-xl font-semibold text-slate-800'>Favorites</div>
      <div className='flex flex-col h-full truncate ... divide-y'>{getFavorites()}</div>
    </div>
  )
}
