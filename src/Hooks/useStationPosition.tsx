import react, { useEffect, useState } from 'react'
import useMetadata from './useMetadata'

interface IPosition {
  latitude: number | undefined
  longitude: number | undefined
}

type Loading = boolean
const useStationPosition = (datasetId: string): [IPosition, Loading] => {
  const [metadata, loading] = useMetadata(datasetId)
  const [positionLoading, setPositionLoading] = useState(true)
  const [position, setPosition] = useState<IPosition>({
    latitude: undefined,
    longitude: undefined
  })
  useEffect(() => {
    if (loading) return
    const latitude = metadata.ncGlobal['geospatial_lat_max'].Value
    const longitude = metadata.ncGlobal['geospatial_lon_max'].Value
    if (latitude && longitude) {
      setPosition({
        latitude: Number(latitude),
        longitude: Number(longitude)
      })
      setPositionLoading(false)
    }
  }, [loading])
  return [position, positionLoading]
}

export default useStationPosition
