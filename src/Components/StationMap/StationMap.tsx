import useStationPosition from '@/Hooks/useStationPosition'
import { Map as AxiomMap, GeoJsonElement, GeoJsonLayerType, ILatLon } from '@axdspub/axiom-maps'
import { useEffect, useState } from 'react'
import { useWindowSize } from '@uidotdev/usehooks'

interface IStationMapProps {
  datasetId: string
}

const StationMap = ({ datasetId }: IStationMapProps) => {
  const [position, positionLoading] = useStationPosition(datasetId)
  const [mapLoading, setMapLoading] = useState(true)
  const [latLon, setLatLon] = useState<ILatLon>()
  const [geoJsonLayer, setGeoJsonLayer] = useState<GeoJsonLayerType>()
  const windowSize = useWindowSize()

  useEffect(() => {
    if (positionLoading) return
    setLatLon({
      lat: position.latitude || 0,
      lon: position.longitude || 0
    })
  }, [positionLoading])

  const createMarker = () => {
    const geoJson: GeoJsonElement = {
      type: 'Feature',
      geometry: {
        type: 'Point',
        coordinates: [position.longitude || 0, position.latitude || 0]
      },
      properties: {
        bindings: {} // TODO: Fix the fact that this is required
      }
    }
    const layer: GeoJsonLayerType = {
      id: 'geoJson',
      type: 'geoJson',
      label: 'geoJson',
      zIndex: 20,
      isBaseLayer: false,
      options: { geoJson: [geoJson] }
    }
    setGeoJsonLayer(layer)
  }

  useEffect(() => {
    if (positionLoading) return
    createMarker()
  }, [positionLoading])

  useEffect(() => {
    setMapLoading(latLon === undefined || geoJsonLayer === undefined)
  }, [latLon, geoJsonLayer])
  
  const mapHeight = Math.min(Math.floor(windowSize.height ? windowSize.height * 0.25 : 20), 240)

  return (
    <div>
      {
        mapLoading ?
        <div>Loading</div> :
        <AxiomMap
          baseLayerKey='hybrid'
          mapLibraryKey='leaflet'
          height={`${mapHeight}px`}
          style={{
            left: '0px',
            top: '0px',
            right: '0px',
            bottom: '0px',
            padding: '0'
          }}
          center={latLon}
          zoom={12}
          layers={geoJsonLayer ? [geoJsonLayer] : []}
        />
      }
    </div>
  )
}

export default StationMap
