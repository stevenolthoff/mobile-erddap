import Sensor, { ISensorProps } from '@/Components/Sensor/Sensor'
import { ReactElement, useEffect, useState } from 'react'
import useMetadata from '@/Hooks/useMetadata'
import TimeFrameService from '@/Services/TimeFrame'
import { IStation } from '@/Contexts/FavoritesContext'
import TimeFrame from '@/Components/TimeFrame/TimeFrame'
import SensorService from '@/Services/Sensor'

interface ISensorsProps {
  station: IStation
}

export default function Sensors (props: ISensorsProps) {
  const { station } = props
  const { datasetId } = station
  const [metadata] = useMetadata(datasetId)
  const { sensors } = metadata
  const timeFrame = TimeFrameService.getTimeFrame('past-week')
  const [emptySensors, setEmptySensors] = useState<ISensorProps[]>([])
  const [nonEmptySensors, setNonEmptySensors] = useState<ISensorProps[]>([])

  const parseMetadataAsSensorProps = () => {
    const sensorsWithUnits = Object.keys(sensors).filter(name => sensors[name].units)
    const sensorsAsProps: ISensorProps[] = sensorsWithUnits.map(name => {
      const valueName = sensors[name].units['Variable Name']
      const valueUnits = sensors[name].units.Value
      const sensorProps: ISensorProps = {
        name,
        datasetId,
        valueName,
        valueUnits,
        timeFrame: 'past-week',
        station
      }
      return sensorProps
    })
    return sensorsAsProps
  }

  const loadData = () => {
    const sensorsAsProps: ISensorProps[] = parseMetadataAsSensorProps()
    SensorService.getNonEmptyAndEmptySensors(sensorsAsProps).then(([nonEmptySensors, emptySensors]) => {
      setNonEmptySensors(nonEmptySensors)
      setEmptySensors(emptySensors)
    }).catch(error => { console.error(error) })
  }

  useEffect(loadData, [sensors, datasetId, station])

  const getSensorElements = (sensorProps: ISensorProps[]): ReactElement[] => {
    return sensorProps.map(sensor => {
      return (
        <div key={sensor.name}>
          <Sensor {...sensor} />
        </div>
      )
    })
  }

  return <div className='overflow-hidden'>
    <TimeFrame timeFrame={timeFrame} />
    <div className='flex flex-col gap-4 divide-y pb-8'>
      {getSensorElements(nonEmptySensors)}
      {getSensorElements(emptySensors)}
    </div>
  </div>
}
