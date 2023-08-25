import React, { ReactElement, useEffect, useState } from 'react'
import { IStation, useFavoritesContext } from '@/Contexts/FavoritesContext'
import StationsListItem from '@/Components/StationsListItem/StationsListItem'
import FavoriteButton from '@/Components/FavoriteButton/FavoriteButton'
import MobileTabs from '@/Components/MobileTabs/MobileTabs'

export default function Favorites (): ReactElement {
  const { stations } = useFavoritesContext()

  function getFavoriteStation (favorite: IStation) {
    return (
      <StationsListItem
        datasetId={favorite.datasetId}
        title={favorite.title}
        summary={favorite.summary}
      >
        <FavoriteButton
          favorite={favorite}
        />
      </StationsListItem>
    )
  }

  function getFavoriteStations () {
    if (Object.keys(stations).length === 0) {
      return <div className='p-4 italic text-slate-500 text-sm'>No Stations Saved</div>
    }
    return (
      <div className='flex flex-col h-full truncate ... divide-y'>
      {
        Object.keys(stations)
        .sort((a, b) => {
          if (stations[a].title < stations[b].title) {
            return -1
          } else if (stations[a].title > stations[b].title) {
            return 1
          } else {
            return 0
          }
        })
        .map(datasetId => getFavoriteStation(stations[datasetId]))
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
