import { useSearchParams } from 'react-router-dom'

export interface IBounds {
  minLatitude: number
  maxLatitude: number
  minLongitude: number
  maxLongitude: number
}

const DEFAULT_MIN_LONGITUDE = -171
const DEFAULT_MAX_LONGITUDE = -136
const DEFAULT_MIN_LATITUDE = 42
const DEFAULT_MAX_LATITUDE = 77

const formatBoundsForSearchParams = (bounds: IBounds) => {
  const formatted: Record<string, string> = {}
  Object.entries(bounds).forEach(([key, value]) => {
    formatted[key] = String(value)
  })
  return formatted
}

const isValid = (bounds: IBounds) => {
  return bounds.minLongitude <= bounds.maxLongitude &&
    bounds.minLatitude <= bounds.maxLatitude &&
    bounds.minLatitude >= -90 && bounds.minLatitude <= 90 &&
    bounds.maxLatitude >= -90 && bounds.maxLatitude <= 90 &&
    bounds.minLongitude >= -180 && bounds.minLongitude <= 180 &&
    bounds.maxLongitude >= -180 && bounds.maxLongitude <= 180
}

/**
 * 
 * Use bounds from url params. If not specified, fall back to .env params.
 * If those are not specified, fall back to hardcoded bounds.
 */
const useBounds = (): [IBounds, (bounds: IBounds) => void] => {
  const [searchParams, setSearchParams] = useSearchParams()
  let bounds = {
    minLatitude: Number(searchParams.get('minLatitude')),
    maxLatitude: Number(searchParams.get('maxLatitude')),
    minLongitude: Number(searchParams.get('minLongitude')),
    maxLongitude: Number(searchParams.get('maxLongitude'))
  }
  const paramsSpecifyAllBounds = Object.values(bounds).every(bound => bound && !isNaN(bound))
  if (!paramsSpecifyAllBounds || !isValid(bounds)) {
    bounds = {
      minLongitude: Number(process.env.REACT_APP_MIN_LONGITUDE),
      maxLongitude: Number(process.env.REACT_APP_MAX_LONGITUDE),
      minLatitude: Number(process.env.REACT_APP_MIN_LATITUDE),
      maxLatitude: Number(process.env.REACT_APP_MAX_LATITUDE)
    }
    const envSpecifiesAllBounds = Object.values(bounds).every(bound => bound && !isNaN(bound))
    if (!envSpecifiesAllBounds || !isValid(bounds)) {
      bounds = {
        minLongitude: DEFAULT_MIN_LONGITUDE,
        maxLongitude: DEFAULT_MAX_LONGITUDE,
        minLatitude: DEFAULT_MIN_LATITUDE,
        maxLatitude: DEFAULT_MAX_LATITUDE
      }
    }
  }
  const setBounds = (bounds: IBounds) => setSearchParams(formatBoundsForSearchParams(bounds))
  console.log(bounds)
  return [bounds, setBounds]
}

export default useBounds
