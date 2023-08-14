import { ErddapApi, IConstraint } from '@axdspub/erddap-service/lib/api'
import { DataService } from '@axdspub/axiom-ui-data-services'

export interface IDatasetOnMap {
  datasetID: string
  title: string
  minLongitude: string
  maxLongitude: string
  minLatitude: string
  maxLatitude: string
  minTime: string
  maxTime: string
  summary: string
}

export default class SearchService {
  SERVER = 'https://erddap.sensors.axds.co/erddap'
  erddapApi = new ErddapApi(this.SERVER)
  MAX_LATITUDE = 77
  MIN_LONGITUDE = -171
  MAX_LONGITUDE = -136
  MIN_LATITUDE = 42
  COLUMN_NAMES = ['datasetID', 'title', 'minLongitude', 'maxLongitude', 'minLatitude', 'maxLatitude', 'minTime', 'maxTime', 'summary']
  constructor () {
    console.log('SearchService')
  }
  public async getAllDatasets (minTime: string, maxTime: string): Promise<IDatasetOnMap[]> {
    const url = this.erddapApi.getUrl({
      protocol: 'tabledap',
      allDatasets: true,
      response: 'csv',
      variables: this.COLUMN_NAMES,
      constraints: [
        {
          name: 'minLatitude',
          operator: '<=',
          value: this.MAX_LATITUDE
        },
        {
          name: 'minLongitude',
          operator: '>=',
          value: this.MIN_LONGITUDE
        },
        {
          name: 'maxLongitude',
          operator: '<=',
          value: this.MAX_LONGITUDE
        },
        {
          name: 'maxLatitude',
          operator: '>=',
          value: this.MIN_LATITUDE
        },
        {
          name: 'minTime',
          operator: '>=',
          value: minTime
        },
        {
          name: 'maxTime',
          operator: '<=',
          value: maxTime
        }
      ]
    })
    const dataService = new DataService({ resultType: 'csv', url, type: '' })
    const results: { data: IDatasetOnMap[] } = await dataService.get()
    console.log(results)
    return results.data
  }
}
