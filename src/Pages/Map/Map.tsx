import React, { type ReactElement, useState, useEffect } from 'react'
import { Map as AxiomMap } from '@axdspub/axiom-maps'

export default function Map (): ReactElement {
  return <div><AxiomMap baseLayerKey='osm' mapLibraryKey='leaflet' tools={{ draw: { enabled: true } }}></AxiomMap></div>
}
