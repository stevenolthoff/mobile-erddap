import getSensorId from '@/Services/SensorId'
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
  isFavorited: (favorite: IStation | ISensor) => boolean
}

const FavoritesContext = createContext<IFavoritesContext | null>(null)

export default function FavoritesContextProvider ({ children }: PropsWithChildren<{}>) {
  const [stations, setStations] = useLocalStorage<Stations>('favoriteStations', {})
  const [sensors, setSensors] = useLocalStorage<Sensors>('favoriteSensors', {})

  function isFavorited (favorite: IStation | ISensor) {
    if (favorite.type === 'station') {
      return Boolean(stations[favorite.datasetId])
    } else if (favorite.type === 'sensor') {
      return Boolean(sensors[getSensorId(favorite)])
    } else {
      return false
    }
  }

  function toggleFavorite (favorite: IStation | ISensor) {
    if (favorite.type === 'station') {
      _toggleStation(favorite)
    } else if (favorite.type === 'sensor') {
      _toggleSensor(favorite)
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

  function _removeSensor (sensorId: string) {
    const newFavorites = sensors
    delete newFavorites[sensorId]
    setSensors(newFavorites)
  }

  function _addSensor (sensor: ISensor): void {
    if (sensors) {
      const newFavorites = sensors
      sensors[getSensorId(sensor)] = sensor
      setSensors(newFavorites)
    }
  }

  function _toggleStation (station: IStation) {
    if (stations[station.datasetId]) {
      _removeStation(station.datasetId)
    } else {
      _addStation(station)
    }
  }

  function _toggleSensor (sensor: ISensor) {
    if (sensors[getSensorId(sensor)]) {
      _removeSensor(getSensorId(sensor))
    } else {
      _addSensor(sensor)
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
