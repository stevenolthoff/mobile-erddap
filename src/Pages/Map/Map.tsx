import React, { type ReactElement, useState, useEffect, useRef } from 'react'
import { Map as AxiomMap, ILatLon, GeoJsonLayerType, GeoJsonElement } from '@axdspub/axiom-maps'
import SearchService, { IDatasetOnMap } from '../../Services/Search/index'
import { useOnClickOutside } from 'usehooks-ts'
import { useSearchContext } from '../../Contexts/SearchContext'
import StationCard from '../../Components/StationCard/StationCard'

export default function Map (): ReactElement {
  const DEFAULT_CENTER: ILatLon = {
    lat: 61.217381,
    lon: -149.863129
  }
  const { minTime, maxTime, minLatitude, maxLatitude, minLongitude, maxLongitude } = useSearchContext()
  console.log('minlat', minLatitude, 'maxlat', maxLatitude, 'minlon', minLongitude, 'maxlon', maxLongitude)
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
    return datasets
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
      <div ref={ref} className='absolute mx-4 bottom-20 left-0 right-0'>
        <StationCard
          datasetId={activeStation.datasetID}
          startDate={activeStation.minTime}
          endDate={activeStation.maxTime}
          title={activeStation.title}
          summary={activeStation.summary}
        />
      </div>
    )
  }

  function getTimeFrameCard () {
    const formatter = (date: string) => new Date(date).toLocaleDateString('en-us', { weekday: 'long', year: 'numeric', month: 'short', day: 'numeric'}) 
    const prettyMinTime = formatter(minTime)
    const prettyMaxTime = formatter(maxTime)
    return <div className='absolute bg-slate-100 top-0 p-3 left-0 right-0'>
      {prettyMinTime} to {prettyMaxTime}
    </div>
  }

  if (layer === null || layer == undefined) {
    return <div>loading</div>
  } else
  return (
    <div>
      <AxiomMap
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
      {/* {getTimeFrameCard()} */}
      {getStationCard()}
    </div>
  )
}
