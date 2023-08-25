import React, { type ReactElement, useState, useEffect, useRef } from 'react'
import { Map as AxiomMap, GeoJsonLayerType, GeoJsonElement } from '@axdspub/axiom-maps'
import SearchService, { IDatasetOnMap } from '@/Services/Search/index'
import { useOnClickOutside } from 'usehooks-ts'
import { useSearchContext } from '@/Contexts/SearchContext'
import StationPreview from '@/Components/StationPreview/StationPreview'

export default function Map (): ReactElement {
  const {
    minTime,
    maxTime,
    minLatitude,
    maxLatitude,
    minLongitude,
    maxLongitude,
    centerLatitude,
    centerLongitude
  } = useSearchContext()

  const [layer, setLayer] = useState<any>()
  const [activeStation, setActiveStation] = useState<IDatasetOnMap | null>(null)
  const ref = useRef(null)
  const handleClickOutside = () => {
    if (activeStation !== null) {
      setActiveStation(null)
    }
  }

  useOnClickOutside(ref, handleClickOutside)

  async function loadStations (): Promise<any> {
    const search = new SearchService()
    const datasets = await search.getAllDatasets(minTime, maxTime, minLatitude, maxLatitude, minLongitude, maxLongitude)
    return datasets || []
  }

  function createGeoJsonLayer (datasets: IDatasetOnMap[]): GeoJsonLayerType {
    const geoJson: GeoJsonElement[] = datasets.slice(1).map((dataset: IDatasetOnMap) => ({
      type: 'Feature',
      geometry: {
        type: 'Point',
        coordinates: [Number(dataset.maxLongitude), Number(dataset.maxLatitude)]
      },
      properties: {
        bindings: {
          eventListeners: {
            onClick: (event: PointerEvent) => { setActiveStation(dataset) }
          }
        }
      }
    }))
    console.log(geoJson)
    const layer: GeoJsonLayerType = {
      id: 'geoJson',
      type: 'geoJson',
      label: 'geoJson',
      zIndex: 20,
      isBaseLayer: false,
      options: { geoJson }
    }
    return layer
  }

  useEffect(() => {
    loadStations().then((datasets: IDatasetOnMap[]) => {
      setLayer(createGeoJsonLayer(datasets))
    }).catch(error => console.error(error))
  }, [])

  function getStationCard () {
    if (!activeStation) return <></>
    return (
      <div
        ref={ref}
      >
        <StationPreview
          datasetId={activeStation.datasetID}
          // startDate={activeStation.minTime}
          // endDate={activeStation.maxTime}
          title={activeStation.title}
          summary={activeStation.summary}
        />
      </div>
    )
  }

  if (layer === null || layer == undefined) {
    return <div>loading</div>
  } else
  return (
    <div>
      <AxiomMap
        baseLayerKey='hybrid'
        mapLibraryKey='leaflet'
        height=''
        style={{
          position: 'fixed',
          left: '0px',
          top: '0px',
          right: '0px',
          bottom: '0px',
          padding: '0'
        }}
        center={{ lat: centerLatitude, lon: centerLongitude }}
        zoom={5}
        layers={[layer]}
      />
      {getStationCard()}
    </div>
  )
}
