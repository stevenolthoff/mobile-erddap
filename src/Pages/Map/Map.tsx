import React, { type ReactElement, useState, useEffect } from 'react'
import { Map as AxiomMap, ILatLon, GeoJsonLayerType, LayerType } from '@axdspub/axiom-maps'
import SearchService, { IDatasetOnMap } from '../../Services/Search/index'

export default function Map (): ReactElement {
  const DEFAULT_CENTER: ILatLon = {
    lat: 61.217381,
    lon: -149.863129
  }

  const [layer, setLayer] = useState<any>()

  async function loadStations (): Promise<any> {
    console.log('load')
    const datasets = await SearchService.getAllDatasets()
    return datasets
  }

  function createGeoJsonLayer (datasets: IDatasetOnMap[]): GeoJsonLayerType {
    const geoJson: GeoJSON.Feature[] = datasets.slice(1).map((dataset: IDatasetOnMap) => ({
      type: 'Feature',
      geometry: {
        type: 'Point',
        coordinates: [Number(dataset.maxLongitude), Number(dataset.maxLatitude)]
      },
      properties: {}
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

  if (layer === null || layer == undefined) {
    return <div>loading</div>
  } else
  return <AxiomMap
    baseLayerKey='hybrid'
    mapLibraryKey='leaflet'
    tools={{ draw: { enabled: true } }}
    height=''
    style={{
      position: 'fixed',
      left: '0px',
      top: '0px',
      right: '0px',
      bottom: '0px',
      padding: '0'
    }}
    center={DEFAULT_CENTER}
    zoom={5}
    layers={[layer]}
  />
}
