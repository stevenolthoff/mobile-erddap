import { useEffect, useState } from "react"
import { parser as ErddapParser } from '@axdspub/erddap-service'
import MetadataService from "@/Services/Metadata"

export default function useMetadata (datasetId: string) {
  const [metadata, setMetadata] = useState<ErddapParser.IParsedDatasetMetadata>({ axes: {}, sensors: {}, station: {}, ncGlobal: {} })
  useEffect(() => {
    MetadataService.getParsedMetadata(datasetId).then(parsedMetadata => {
      setMetadata(parsedMetadata)
    }).catch(error => {
      console.error(error)
    })
  }, [datasetId])
  return metadata
}
