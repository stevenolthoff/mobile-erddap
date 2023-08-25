import { ISensor } from '@/Contexts/FavoritesContext'

export default function getSensorId (sensor: ISensor) {
  return `${sensor.datasetId}.${sensor.name}`
}
