import { PropsWithChildren, createContext, useContext, useEffect, useState } from 'react'
import { useLocalStorage } from 'usehooks-ts'

type TypeOfFavorite = 'station' | 'sensor'

export interface IStations {
  datasetId: string
  title: string
  summary: string
}

type DatasetId = string
type Stations = Record<DatasetId, IStations>

interface IFavoritesContext {
  stations: Stations
  toggleFavorite: (favorite: IStations) => void
  isFavorited: (typeOfFavorite: TypeOfFavorite, datasetId: DatasetId) => boolean
}

const FavoritesContext = createContext<IFavoritesContext | null>(null)

export default function FavoritesContextProvider ({ children }: PropsWithChildren<{}>) {
  const [stations, setStations] = useLocalStorage<Stations>('favoriteStations', {})

  function isFavorited (typeOfFavorite: TypeOfFavorite, datasetId: DatasetId) {
    if (typeOfFavorite === 'station') {
      return Boolean(stations[datasetId])
    } else if (typeOfFavorite === 'sensor') {
      return false
    } else {
      console.error(`Unrecognized type of favorite ${typeOfFavorite}`)
      return false
    }
  }

  function toggleFavorite (favorite: IStations) {
    if (stations[favorite.datasetId]) {
      removeFavorite(favorite.datasetId)
    } else {
      addFavorite(favorite)
    }
  }

  function removeFavorite (datasetId: string) {
    const newFavorites = stations
    delete newFavorites[datasetId]
    setStations(newFavorites)
  }

  function addFavorite (favorite: IStations): void {
    if (stations) {
      const newFavorites = stations
      stations[favorite.datasetId] = favorite
      setStations(newFavorites)
    }
  }

  return (
    <FavoritesContext.Provider
      value={{
        stations,
        toggleFavorite,
        isFavorited
      }}
    >
      {children}
    </FavoritesContext.Provider>
  )
}

export function useFavoritesContext () {
  const context = useContext(FavoritesContext)
  if (!context) {
    throw new Error('useFavoritesContext must be used within a FavoritesContextProvider')
  }
  return context
}
