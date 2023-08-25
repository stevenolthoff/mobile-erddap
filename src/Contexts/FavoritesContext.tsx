import { ETimeFrame } from '@/Services/TimeFrame'
import { PropsWithChildren, createContext, useContext, useEffect, useState } from 'react'
import { useLocalStorage } from 'usehooks-ts'

type TypeOfFavorite = 'station' | 'sensor'

interface Favorite {
  type: TypeOfFavorite
}

export interface IStation extends Favorite {
  datasetId: string
  title: string
  summary: string
  type: 'station'
}

export interface ISensor extends Favorite {
  name: string
  datasetId: string
  valueName: string
  valueUnits: string
  timeFrame: ETimeFrame
  type: 'sensor'
}

type DatasetId = string
type Stations = Record<DatasetId, IStation>

type SensorId = string
type Sensors = Record<SensorId, ISensor>

interface IFavoritesContext {
  stations: Stations
  toggleFavorite: (favorite: IStation | ISensor) => void
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

  function toggleFavorite (favorite: IStation | ISensor) {
    if (favorite.type === 'station') {
      _toggleStation(favorite)
    } else if (favorite.type === 'sensor') {
      
    }
  }

  function _removeStation (datasetId: string) {
    const newFavorites = stations
    delete newFavorites[datasetId]
    setStations(newFavorites)
  }

  function _addStation (station: IStation): void {
    if (stations) {
      const newFavorites = stations
      stations[station.datasetId] = station
      setStations(newFavorites)
    }
  }

  function _toggleStation (station: IStation) {
    if (stations[station.datasetId]) {
      _removeStation(station.datasetId)
    } else {
      _addStation(station)
    }
  }

  function _toggleSensor () {

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
