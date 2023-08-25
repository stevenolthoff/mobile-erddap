import { getSensorId, getLatestMeasurementsId } from '@/Services/FavoriteId'
import { ETimeFrame } from '@/Services/TimeFrame'
import { PropsWithChildren, createContext, useContext, useEffect, useState } from 'react'
import { useLocalStorage } from 'usehooks-ts'

type TypeOfFavorite = 'station' | 'sensor' | 'latest-measurements'

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
  station: Omit<IStation, 'type'>
}

export interface ILatestMeasurement extends Favorite {
  datasetId: string
  type: 'latest-measurements'
  station: Omit<IStation, 'type'>
}

type DatasetId = string
type Stations = Record<DatasetId, IStation>

type SensorId = string
type Sensors = Record<SensorId, ISensor>

type LatestMeasurementId = string
type LatestMeasurements = Record<LatestMeasurementId, ILatestMeasurement>

interface IFavoritesContext {
  stations: Stations
  sensors: Sensors
  latestMeasurements: LatestMeasurements
  toggleFavorite: (favorite: IStation | ISensor | ILatestMeasurement) => void
  isFavorited: (favorite: IStation | ISensor | ILatestMeasurement) => boolean
}

const FavoritesContext = createContext<IFavoritesContext | null>(null)

export default function FavoritesContextProvider ({ children }: PropsWithChildren<{}>) {
  const [stations, setStations] = useLocalStorage<Stations>('favoriteStations', {})
  const [sensors, setSensors] = useLocalStorage<Sensors>('favoriteSensors', {})
  const [latestMeasurements, setLatestMeasurements] = useLocalStorage<LatestMeasurements>('favoriteLatestMeasurements', {})

  function isFavorited (favorite: IStation | ISensor | ILatestMeasurement) {
    if (favorite.type === 'station') {
      return Boolean(stations[favorite.datasetId])
    } else if (favorite.type === 'sensor') {
      return Boolean(sensors[getSensorId(favorite)])
    } else if (favorite.type === 'latest-measurements') {
      return Boolean(latestMeasurements[getLatestMeasurementsId(favorite)])
    } else {
      return false
    }
  }

  function toggleFavorite (favorite: IStation | ISensor | ILatestMeasurement) {
    if (favorite.type === 'station') {
      _toggleStation(favorite)
    } else if (favorite.type === 'sensor') {
      _toggleSensor(favorite)
    } else if (favorite.type === 'latest-measurements') {
      _toggleLatestMeasurement(favorite)
    }
  }

  function _removeStation (datasetId: string) {
    const newFavorites = stations
    delete newFavorites[datasetId]
    setStations(newFavorites)
  }

  function _removeSensor (sensorId: string) {
    const newFavorites = sensors
    delete newFavorites[sensorId]
    setSensors(newFavorites)
  }

  function _removeLatestMeasurement (id: string) {
    const newFavorites = latestMeasurements
    delete newFavorites[id]
    setLatestMeasurements(newFavorites)
  }

  function _addStation (station: IStation): void {
    if (stations) {
      const newFavorites = stations
      stations[station.datasetId] = station
      setStations(newFavorites)
    }
  }

  function _addSensor (sensor: ISensor): void {
    if (sensors) {
      const newFavorites = sensors
      sensors[getSensorId(sensor)] = sensor
      setSensors(newFavorites)
    }
  }

  function _addLatestMeasurement (latestMeasurement: ILatestMeasurement): void {
    if (latestMeasurements) {
      const newFavorites = latestMeasurements
      latestMeasurements[getLatestMeasurementsId(latestMeasurement)] = latestMeasurement
      setLatestMeasurements(newFavorites)
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

  function _toggleLatestMeasurement (latestMeasurement: ILatestMeasurement) {
    if (latestMeasurements[getLatestMeasurementsId(latestMeasurement)]) {
      _removeLatestMeasurement(getLatestMeasurementsId(latestMeasurement))
    } else {
      _addLatestMeasurement(latestMeasurement)
    }
  }

  return (
    <FavoritesContext.Provider
      value={{
        stations,
        sensors,
        latestMeasurements,
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
