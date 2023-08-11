import React, { type ReactElement, useState, useEffect } from 'react'
import { Map as AxiomMap, ILatLon } from '@axdspub/axiom-maps'
// import './Map.css' // For now, only way I know how to get map to show.

import * as DataService from '@axdspub/axiom-ui-data-services'
import { api } from '@axdspub/erddap-service'

export default function Map (): ReactElement {
  const SERVER = 'https://erddap.sensors.axds.co/erddap'
  const DEFAULT_CENTER: ILatLon = {
    lat: 61.217381,
    lon: -149.863129
  }
  const ITEMS_PER_PAGE = 100
  const erddapApi = new api.ErddapApi(SERVER)

  const [page, setPage] = useState(1)

  useEffect(getSearchUrl, [])

  function getSearchUrl () {
    const url = erddapApi.getUrl({
      request: 'search/advanced',
      constraints: [
        {
          name: 'itemsPerPage',
          operator: '=',
          value: ITEMS_PER_PAGE
        },
        {
          name: 'page',
          operator: '=',
          value: page
        },
        {
          name: 'maxLat',
          operator: '=',
          value: 80
        },
        {
          name: 'maxLat',
          operator: '=',
          value: 80
        }
      ],
      response: 'csv'
    })
    console.log('search url', url)
  }

  useEffect(getDatasets, [])

  function getDatasets () {

  }

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
      bottom: '0px'
    }}
    center={DEFAULT_CENTER}
    zoom={5}
  />
}
