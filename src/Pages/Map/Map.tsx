import React, { type ReactElement, useState, useEffect } from 'react'
import { Map as AxiomMap, ILatLon } from '@axdspub/axiom-maps'
import SearchService from '../../Services/Search/index'

export default function Map (): ReactElement {
  const DEFAULT_CENTER: ILatLon = {
    lat: 61.217381,
    lon: -149.863129
  }

  const [layers, setLayers] = useState<any>([])

  async function loadStations (): Promise<any> {
    console.log('load')
    const datasets = await SearchService.getAllDatasets()
    return datasets
  }

  useEffect(() => {
    loadStations().then((datasets: any[]) => {
      console.log(datasets)
      const geoJson = datasets.slice(1).map((dataset: any) => ({
        type: 'Feature',
        geometry: {
          type: 'Point',
          coordinates: [dataset.maxLongitude, dataset.maxLatitude]
        },
        properties: {}
      }))
      console.log(geoJson)
      const layer = {
        id: 'geoJson',
        type: 'geoJson',
        label: 'geoJson',
        zIndex: 20,
        isBaseLayer: false,
        options: { geoJson }
      }
      setLayers([layer])
    }).catch(error => console.error(error))
  }, [])

  if (layers.length === 0) {
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
    layers={layers}
  />
}
