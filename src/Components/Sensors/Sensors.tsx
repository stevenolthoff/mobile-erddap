import Sensor, { ISensorProps } from '@/Components/Sensor/Sensor'
import { ReactElement, useEffect, useState } from 'react'
import useMetadata from '@/Hooks/useMetadata'
import TimeFrameService from '@/Services/TimeFrame'
import { IStation } from '@/Contexts/FavoritesContext'
import TimeFrame from '@/Components/TimeFrame/TimeFrame'
import SensorService from '@/Services/Sensor'
import { Loader } from '@axdspub/axiom-ui-utilities'

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
  const [timeFrameHasData, setTimeFrameHasData] = useState<boolean | undefined>(undefined)

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
      setTimeFrameHasData(nonEmptySensors.length !== 0 || emptySensors.length !== 0)
    }).catch(error => { console.error(error) })
  }

  useEffect(() => {
    if (Object.keys(sensors).length > 0) {
      loadData()
    }
  }, [sensors])

  const getSensorElements = (sensorProps: ISensorProps[]): ReactElement[] => {
    return sensorProps.map(sensor => {
      return (
        <div key={sensor.name}>
          <Sensor {...sensor} />
        </div>
      )
    })
  }

  const EmptyState = () => {
    console.log(timeFrameHasData)
    const className = 'm-4 w-[calc(100%-2rem)] h-[300px] flex justify-center items-center bg-slate-200 rounded-lg text-slate-500 text-sm'
    if (timeFrameHasData === undefined) {
      return <div className={`${className} animate-pulse`}><Loader></Loader></div>
    } else if (!timeFrameHasData) {
      return <div className={className}>No data collected in this time period.</div>
    } else {
      return <></>
    }
  }

  return <div className='overflow-hidden'>
    <TimeFrame timeFrame={timeFrame} />
    <EmptyState />
    <div className='flex flex-col gap-4 divide-y pb-8'>
      {getSensorElements(nonEmptySensors)}
      {getSensorElements(emptySensors)}
    </div>
  </div>
}
