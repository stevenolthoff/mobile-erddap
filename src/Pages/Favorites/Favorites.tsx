import React, { ReactElement } from 'react'
import { IFavorite, useFavoritesContext } from '../../Contexts/FavoritesContext'
import StationsListItem from '../../Components/StationsListItem/StationsListItem'
import { Link } from 'react-router-dom'
import FavoriteButton from '../../Components/FavoriteButton/FavoriteButton'

export default function Favorites (): ReactElement {
  const { favorites, addFavorite } = useFavoritesContext()

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
          <FavoriteButton favorite={favorite} />
        </StationsListItem>
      </Link>
    )
  }

  function getFavorites () {
    return Object.keys(favorites)
      .sort((a, b) => {
        if (favorites[a].title < favorites[b].title) {
          return -1
        } else if (favorites[a].title > favorites[b].title) {
          return 1
        } else {
          return 0
        }
      })
      .map(datasetId => getFavorite(favorites[datasetId]))
  }

  return (
    <div className='max-h-full max-w-full overflow-scroll no-scrollbar scrollbox'>
      <div className='p-4 text-lg font-semibold text-slate-800'>Favorites</div>
      <div className='flex flex-col h-full truncate ...'>{getFavorites()}</div>
    </div>
  )
}
