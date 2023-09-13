import Sensor from '@/Components/Sensor/Sensor'
import { ReactElement, useEffect, useState } from 'react'
import useMetadata from '@/Hooks/useMetadata'
import TimeFrameService from '@/Services/TimeFrame'
import { IStation } from '@/Contexts/FavoritesContext'
import TimeFrame from '@/Components/TimeFrame/TimeFrame'
import { DataService } from '@axdspub/axiom-ui-data-services'
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
  const [emptySensors, setEmptySensors] = useState<string[]>([])
  const [nonEmptySensors, setNonEmptySensors] = useState<string[]>([])

  const loadData = () => {
    const sensorsWithUnits = Object.keys(sensors).filter(key => sensors[key].units)
    const dataFetchPromises = sensorsWithUnits.map(async key => {
      const valueName = sensors[key].units['Variable Name']
      const valueUnits = sensors[key].units.Value
      const dataServiceProps = SensorService.getDataServiceForSensorChart({
        name: key,
        datasetId,
        valueName,
        valueUnits,
        timeFrame: 'past-week',
        station
      })
      const dataService = new DataService(dataServiceProps)
      return { id: key, result: await dataService.get() }
    })
    Promise.all(dataFetchPromises).then((sensors) => {
      const idsOfEmptySensors: string[] = []
      const idsOfNonEmptySensors: string[] = []
      sensors.forEach(sensorResult => {
        const y = sensorResult.result.parsed?.accessors.y
        if (y !== undefined) {
          const data = sensorResult.result.parsed?.data
          const sensorIsEmpty = data?.filter(row => y(row) !== null).length === 0
          if (sensorIsEmpty) {
            idsOfEmptySensors.push(sensorResult.id)
          } else {
            idsOfNonEmptySensors.push(sensorResult.id)
          }
        }
      })
      setEmptySensors(idsOfEmptySensors)
      setNonEmptySensors(idsOfNonEmptySensors)
    }).catch(error => console.error(error))
  }

  useEffect(loadData, [sensors, datasetId, station])

  const getSensorElements = (sensorIds: string[]): ReactElement[] => {
    return sensorIds.sort().map(id => {
      const valueName = sensors[id].units['Variable Name']
      const valueUnits = sensors[id].units.Value
      return (
        <div key={id}>
          <Sensor
            name={id}
            datasetId={datasetId}
            valueName={valueName}
            valueUnits={valueUnits}
            timeFrame='past-week'
            station={station}
          />
        </div>
      )
    })
  }

  const getNonEmptySensors = (): ReactElement[] => {
    return getSensorElements(nonEmptySensors)
  }

  const getEmptySensors = (): ReactElement[] => {
    return getSensorElements(emptySensors)
  }

  return <div className='overflow-hidden'>
    <TimeFrame timeFrame={timeFrame} />
    <div className='flex flex-col gap-4 divide-y pb-8'>
      {getNonEmptySensors()}
      {getEmptySensors()}
    </div>
  </div>
}
