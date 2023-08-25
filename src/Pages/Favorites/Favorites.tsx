import React, { ReactElement, useEffect, useState } from 'react'
import { IStation, useFavoritesContext } from '@/Contexts/FavoritesContext'
import StationsListItem from '@/Components/StationsListItem/StationsListItem'
import FavoriteButton from '@/Components/FavoriteButton/FavoriteButton'
import MobileTabs from '@/Components/MobileTabs/MobileTabs'
import Sensor from '@/Components/Sensor/Sensor'

const FavoriteStations = (): ReactElement => {
  const { stations } = useFavoritesContext()
  const [copied] = useState(Object.assign({}, stations))
  
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
    if (Object.keys(copied).length === 0) {
      return <div className='p-4 italic text-slate-500 text-sm'>No Stations Saved</div>
    }
    return Object.keys(copied)
      .sort((a, b) => {
        if (copied[a].title < copied[b].title) {
          return -1
        } else if (copied[a].title > copied[b].title) {
          return 1
        } else {
          return 0
        }
      })
      .map(datasetId => getFavoriteStation(copied[datasetId]))
  }

  return (
    <div className='flex flex-col h-full truncate ... divide-y'>
      {getFavoriteStations()}
    </div>
  )
}

const FavoriteSensors = (): ReactElement => {
  const { sensors } = useFavoritesContext()
  const [copied] = useState(Object.assign({}, sensors))

  function getFavoriteSensors () {
    return Object.entries(copied).map(([id, sensor]) => (
      <Sensor {...sensor}></Sensor>
    ))
  }

  return <div>
    {getFavoriteSensors()}
  </div>
}

export default function Favorites (): ReactElement {

  return (
    <div className='max-h-full max-w-full overflow-scroll no-scrollbar scrollbox'>
      <div className='px-4 pt-4 text-xl font-semibold text-slate-800'>Favorites</div>
      <MobileTabs
        tabs={[
          {
            id: 'stations',
            label: 'Stations',
            content: <FavoriteStations />
          },
          {
            id: 'sensors',
            label: 'Sensors',
            content: <FavoriteSensors />
          }
        ]}
      />
    </div>
  )
}
