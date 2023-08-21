import { useEffect, useState } from "react"
import { parser as ErddapParser } from '@axdspub/erddap-service'
import MetadataService from "@/Services/Metadata"

export default function useMetadata (datasetId: string): [ErddapParser.IParsedDatasetMetadata, boolean] {
  const [loading, setLoading] = useState(true)
  const [metadata, setMetadata] = useState<ErddapParser.IParsedDatasetMetadata>({ axes: {}, sensors: {}, station: {}, ncGlobal: {} })
  useEffect(() => {
    MetadataService.getParsedMetadata(datasetId).then(parsedMetadata => {
      setMetadata(parsedMetadata)
    }).catch(error => {
      console.error(error)
    }).finally(() => {
      setLoading(false)
    })
  }, [datasetId])
  return [metadata, loading]
}
