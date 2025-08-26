import React, { type ReactElement, useState, useEffect, useRef } from 'react'
import { Map as AxiomMap, IGeoJSONLayerProps, type ILayerQueryEvent } from '@axdspub/axiom-maps'
import SearchService, { IDatasetOnMap } from '@/Services/Search/index'
import { useOnClickOutside } from 'usehooks-ts'
import { useSearchContext } from '@/Contexts/SearchContext'
import StationPreview from '@/Components/StationPreview/StationPreview'
import Loader from '@/Components/Loader/Loader'

export default function Map (): ReactElement {
  const {
    minTime,
    maxTime,
    minLatitude,
    maxLatitude,
    minLongitude,
    maxLongitude,
    centerLatitude,
    centerLongitude,
    zoom,
  } = useSearchContext()

  const MIN_ZOOM = 12 // Enforce a city-level minimum zoom

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

  function createGeoJsonLayer (datasets: IDatasetOnMap[]): IGeoJSONLayerProps {
    const geoJson: GeoJSON.Feature[] = datasets
      .slice(1)
      .map((dataset: IDatasetOnMap) => ({
        type: 'Feature',
        geometry: {
          type: 'Point',
          coordinates: [
            Number(dataset.maxLongitude),
            Number(dataset.maxLatitude),
          ],
        },
        properties: {
          'point-radius': 10,
          dataset,
        },
      }))
    const layer: IGeoJSONLayerProps = {
      id: 'geoJson',
      type: 'geoJson',
      label: 'geoJson',
      zIndex: 20,
      isBaseLayer: false,
      options: { geoJson, cluster: true },
      onSelect: (e: ILayerQueryEvent) => {
        if (e?.data?.feature?.properties?.dataset !== undefined) {
          setActiveStation(e.data.feature.properties.dataset as IDatasetOnMap)
        } else {
          setActiveStation(null)
        }
      },
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
          title={activeStation.title}
          summary={activeStation.summary}
        />
      </div>
    )
  }

  if (layer === null || layer == undefined) {
    return (
      <div className='w-screen h-screen flex justify-center items-center bg-slate-200'>
        <Loader />
      </div>
    )
  } else {
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
            padding: '0',
          }}
          center={{ lat: centerLatitude, lon: centerLongitude }}
          zoom={Math.max(zoom, MIN_ZOOM)}
          layers={[layer]}
        />
        {getStationCard()}
      </div>
    )
  }
}
