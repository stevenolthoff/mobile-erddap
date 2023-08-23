import useBounds from "./useBounds"


const useMapCenter = () => {
  const [bounds] = useBounds()
  const centerLatitude = (bounds.minLatitude + bounds.maxLatitude) / 2
  const centerLongitude = (bounds.minLongitude + bounds.maxLongitude) / 2
  return { centerLatitude, centerLongitude }
}

export default useMapCenter
