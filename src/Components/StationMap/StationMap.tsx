import useStationPosition from '@/Hooks/useStationPosition'
import { Map as AxiomMap, ILatLon } from '@axdspub/axiom-maps'
import { useEffect, useState } from 'react'

interface IStationMapProps {
  datasetId: string
}

const StationMap = ({ datasetId }: IStationMapProps) => {
  const [position, loading] = useStationPosition(datasetId)
  const [latLon, setLatLon] = useState<ILatLon>({ lat: 0, lon: 0 })

  useEffect(() => {
    if (loading) return
    setLatLon({
      lat: position.latitude || 0,
      lon: position.longitude || 0
    })
  }, [loading])

  return (
    <div>
      {
        loading ?
        <div>Loading</div> :
        <AxiomMap
          baseLayerKey='hybrid'
          mapLibraryKey='leaflet'
          height='20rem'
          style={{
            left: '0px',
            top: '0px',
            right: '0px',
            bottom: '0px',
            padding: '0'
          }}
          center={latLon}
          zoom={5}
          // layers={[layer]}
        />
      }
    </div>
  )
}

export default StationMap
