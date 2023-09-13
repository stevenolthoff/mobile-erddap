import { useFavoritesContext } from '@/Contexts/FavoritesContext'
import { ReactElement, useEffect, useState } from 'react'
import FavoriteSensor from '@/Components/FavoriteSensor/FavoriteSensor'
import SensorService from '@/Services/Sensor'
import { ISensorProps } from '../Sensor/Sensor'

const FavoriteSensors = (): ReactElement => {
  const { sensors } = useFavoritesContext()
  const [copied] = useState(Object.assign({}, sensors))
  const [emptySensors, setEmptySensors] = useState<ISensorProps[]>([])
  const [nonEmptySensors, setNonEmptySensors] = useState<ISensorProps[]>([])

  const loadData = () => {
    SensorService.getNonEmptyAndEmptySensors(Object.values(copied)).then(([nonEmptySensors, emptySensors]) => {
      setNonEmptySensors(nonEmptySensors)
      setEmptySensors(emptySensors)
    }).catch(error => { console.error(error) })
  }

  useEffect(loadData, [copied])

  const getSensorElements = (sensorProps: ISensorProps[]): ReactElement[] => {
    return sensorProps.map(sensor => {
      return (
        <div key={`${sensor.datasetId}-${sensor.name}`}>
          <FavoriteSensor id={sensor.name} sensor={{ ...sensor, type: 'sensor' }} />
        </div>
      )
    })
  }

  return <div className='flex flex-col gap-4 divide-y divide-slate-300'>
    {getSensorElements(nonEmptySensors)}
    {getSensorElements(emptySensors)}
  </div>
}

export default FavoriteSensors
