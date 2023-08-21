import { DataService, IDataResult } from "@axdspub/axiom-ui-data-services"
import { ErddapApi } from "@axdspub/erddap-service/lib/api"
import { parser as ErddapParser } from '@axdspub/erddap-service'

export default class MetadataService {
  static SERVER = process.env.REACT_APP_SERVER || 'https://erddap.sensors.axds.co/erddap'
  static erddapApi = new ErddapApi(this.SERVER)

  public static async getParsedMetadata (datasetId: string): Promise<ErddapParser.IParsedDatasetMetadata> {
    const result = await this.getMetadata(datasetId)
    return ErddapParser.parseDatasetMetadata(result.data)
  }

  public static async getMetadata (datasetId: string): Promise<IDataResult> {
    const url = this.erddapApi.getUrl({ request: 'info', response: 'csv', dataset_id: datasetId })
    const dataService = new DataService({ type: '', resultType: 'csv', url })
    return await dataService.get()
  }
}
