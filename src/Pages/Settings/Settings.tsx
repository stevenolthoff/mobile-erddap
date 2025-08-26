import useBounds, { IBounds } from "@/Hooks/useBounds"
import useMapCenter from "@/Hooks/useMapCenter"
import { useState, useEffect, useRef } from 'react'
import L from 'leaflet'
import icon from 'leaflet/dist/images/marker-icon.png'
import icon2x from 'leaflet/dist/images/marker-icon-2x.png'
import iconShadow from 'leaflet/dist/images/marker-shadow.png'

// Fix for Leaflet's default icon path issue with webpack.
// @ts-ignore
delete L.Icon.Default.prototype._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: icon2x,
  iconUrl: icon,
  shadowUrl: iconShadow,
})

const Settings = () => {
  const [bounds, setBounds] = useBounds()
  const center = useMapCenter()

  const [mapInstance, setMapInstance] = useState<L.Map | null>(null)
  const [marker, setMarker] = useState<L.Marker | null>(null)
  const mapContainerRef = useRef<HTMLDivElement>(null)

  // Initialize map and initial marker once on component mount.
  useEffect(() => {
    if (mapContainerRef.current && !mapInstance) {
      const map = L.map(mapContainerRef.current).setView(
        [center.centerLatitude, center.centerLongitude],
        bounds.zoom
      )

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      }).addTo(map)

      const initialMarker = L.marker([
        center.centerLatitude,
        center.centerLongitude,
      ]).addTo(map)
      setMarker(initialMarker)

      setMapInstance(map)

      // Cleanup function to remove the map on component unmount.
      return () => {
        map.remove()
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []) // Empty dependency array ensures this runs only once.

  // Setup map event listeners once when the map instance is ready.
  useEffect(() => {
    if (!mapInstance) return

    const handleMoveEnd = () => {
      const mapBounds = mapInstance.getBounds()
      const zoom = mapInstance.getZoom()
      // Automatically save the new bounds and zoom to the URL.
      setBounds({
        minLatitude: mapBounds.getSouth(),
        maxLatitude: mapBounds.getNorth(),
        minLongitude: mapBounds.getWest(),
        maxLongitude: mapBounds.getEast(),
        zoom: zoom,
      })
    }

    const handleClick = (e: L.LeafletMouseEvent) => {
      const { lat, lng } = e.latlng
      if (marker) {
        marker.setLatLng([lat, lng])
      }
      // Pan the map to the clicked location. The `moveend` event will then save the new bounds.
      mapInstance.panTo(e.latlng)
    }

    mapInstance.on('moveend', handleMoveEnd)
    mapInstance.on('click', handleClick)

    // Cleanup on component unmount
    return () => {
      mapInstance.off('moveend', handleMoveEnd)
      mapInstance.off('click', handleClick)
    }
  }, [mapInstance, marker, setBounds])

  return (
    <div className='flex flex-col h-full max-h-full overflow-y-auto p-4 sm:p-6 bg-slate-50'>
      <div className='w-full'>
        <h1 className='text-2xl font-bold text-slate-900 mb-6'>Settings</h1>

        <div className='space-y-8'>
          <section>
            <h2 className='text-lg font-semibold text-slate-800'>
              Map Boundaries
            </h2>
            <p className='mt-1 text-sm text-slate-500'>
              Tap, pan, or zoom the map to set your default geographic area.
              Changes are saved automatically.
            </p>

            <div
              ref={mapContainerRef}
              className='mt-4 rounded-md overflow-hidden shadow-sm h-[60vh] w-full border border-slate-200 cursor-pointer'
              style={{ zIndex: 0 }} /* Ensures map controls are visible */
            >
              {/* Leaflet map is initialized here */}
            </div>
          </section>

          <hr className='border-slate-200' />

          <section>
            <h2 className='text-lg font-semibold text-slate-800'>Debug Info</h2>
            <dl className='mt-2 space-y-2 text-sm text-slate-600'>
              <div className='flex justify-between sm:justify-start sm:gap-4'>
                <dt className='w-40 sm:w-auto font-medium text-slate-500'>
                  Map Center Latitude:
                </dt>
                <dd className='font-mono'>
                  {center.centerLatitude.toFixed(4)}
                </dd>
              </div>
              <div className='flex justify-between sm:justify-start sm:gap-4'>
                <dt className='w-40 sm:w-auto font-medium text-slate-500'>
                  Map Center Longitude:
                </dt>
                <dd className='font-mono'>
                  {center.centerLongitude.toFixed(4)}
                </dd>
              </div>
            </dl>
          </section>
        </div>
      </div>
    </div>
  )
}

export default Settings
