import useBounds, { IBounds } from "@/Hooks/useBounds"
import useMapCenter from "@/Hooks/useMapCenter"
import { useState } from "react"

const Settings = () => {
  const [bounds, setBounds] = useBounds()
  const boundsCopy = Object.assign({}, bounds)
  const center = useMapCenter()
  const [minLatitude, setMinLatitude] = useState(String(boundsCopy.minLatitude))
  const [maxLatitude, setMaxLatitude] = useState(String(boundsCopy.maxLatitude))
  const [minLongitude, setMinLongitude] = useState(String(boundsCopy.minLongitude))
  const [maxLongitude, setMaxLongitude] = useState(String(boundsCopy.maxLongitude))
  const onChange = (key: keyof IBounds, value: string) => {
    if (key === 'minLatitude') {
      setMinLatitude(value)
    } else if (key === 'maxLatitude') {
      setMaxLatitude(value)
    } else if (key === 'minLongitude') {
      setMinLongitude(value)
    } else {
      setMaxLongitude(value)
    }
  }

  const onSave = () => {
    const newBounds = Object.assign({}, bounds)
    newBounds.minLatitude = Number(minLatitude)
    newBounds.maxLatitude = Number(maxLatitude)
    newBounds.minLongitude = Number(minLongitude)
    newBounds.maxLongitude = Number(maxLongitude)
    setBounds(newBounds)
  }

  return (
    <div className='flex flex-col'>
      Debug info
      <label>minLatitude</label>
      <input value={minLatitude} onChange={event => onChange('minLatitude', event.target.value)}></input>
      <label>maxLatitude</label>
      <input value={maxLatitude} onChange={event => onChange('maxLatitude', event.target.value)}></input>
      <label>minLongitude</label>
      <input value={minLongitude} onChange={event => onChange('minLongitude', event.target.value)}></input>
      <label>maxLongitude</label>
      <input value={maxLongitude} onChange={event => onChange('maxLongitude', event.target.value)}></input>
      <button className='border-2 border-black' onClick={onSave}>Save Settings</button>
      <label>centerLatitude</label>
      <div>{center.centerLatitude}</div>
      <label>centerLongitdue</label>
      <div>{center.centerLongitude}</div>
    </div>
  )
}

export default Settings
