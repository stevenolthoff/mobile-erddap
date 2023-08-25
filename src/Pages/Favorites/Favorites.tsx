import React, { ReactElement, useEffect, useState } from 'react'
import { IFavorite, useFavoritesContext } from '@/Contexts/FavoritesContext'
import StationsListItem from '@/Components/StationsListItem/StationsListItem'
import { Link, useLocation } from 'react-router-dom'
import FavoriteButton from '@/Components/FavoriteButton/FavoriteButton'
import MobileTabs from '@/Components/MobileTabs/MobileTabs'

export default function Favorites (): ReactElement {
  const { favorites } = useFavoritesContext()
  const [copiedFavorites] = useState(Object.assign({}, favorites))
  const { search } = useLocation()

  function getFavoriteStation (favorite: IFavorite) {
    return (
      <Link
        key={favorite.datasetId}
        to={`/stations/${favorite.datasetId}${search}`}
        className='flex'
      >
        <StationsListItem
          title={favorite.title}
          summary={favorite.summary}
        >
          <FavoriteButton
            favorite={favorite}
            typeOfFavorite='station'
          />
        </StationsListItem>
      </Link>
    )
  }

  function getFavoriteStations () {
    if (Object.keys(copiedFavorites).length === 0) {
      return <div className='p-4 italic text-slate-500 text-sm'>No Stations Saved</div>
    }
    return (
      <div className='flex flex-col h-full truncate ... divide-y'>
      {
        Object.keys(copiedFavorites)
        .sort((a, b) => {
          if (copiedFavorites[a].title < copiedFavorites[b].title) {
            return -1
          } else if (copiedFavorites[a].title > copiedFavorites[b].title) {
            return 1
          } else {
            return 0
          }
        })
        .map(datasetId => getFavoriteStation(copiedFavorites[datasetId]))
      }
      </div>
    )
  }

  return (
    <div className='max-h-full max-w-full overflow-scroll no-scrollbar scrollbox'>
      <div className='px-4 pt-4 text-xl font-semibold text-slate-800'>Favorites</div>
      <MobileTabs
        tabs={[
          {
            id: 'stations',
            label: 'Stations',
            content: getFavoriteStations()
          },
          {
            id: 'sensors',
            label: 'Sensors'
          }
        ]}
      />
    </div>
  )
}
