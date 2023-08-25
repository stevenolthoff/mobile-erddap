import { ILatestMeasurement, ISensor } from '@/Contexts/FavoritesContext'

export function getSensorId (sensor: ISensor) {
  return `${sensor.datasetId}.${sensor.name}`
}

export function getLatestMeasurementsId (latestMeasurement: ILatestMeasurement) {
  return `latest-measurement.${latestMeasurement.datasetId}`
}
