import { ErddapApi, IConstraint } from '@axdspub/erddap-service/lib/api'
import { DataService } from '@axdspub/axiom-ui-data-services'

export default class SearchService {
  static SERVER = 'https://erddap.sensors.axds.co/erddap'
  static erddapApi = new ErddapApi(this.SERVER)
  static MAX_LATITUDE = 77
  static MIN_LONGITUDE = -171
  static MAX_LONGITUDE = -136
  static MIN_LATITUDE = 42
  static MIN_TIME = '2023-07-01T00:00:00Z'
  static MAX_TIME = '2023-08-01T00:00:00Z'
  static CONSTRAINTS: IConstraint[] = [
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
      value: this.MIN_TIME
    },
    {
      name: 'maxTime',
      operator: '<=',
      value: this.MAX_TIME
    }
  ]
  static COLUMN_NAMES = ['datasetID', 'title', 'minLongitude', 'maxLongitude', 'minLatitude', 'maxLatitude', 'minTime', 'maxTime', 'summary']
  constructor () {
    console.log('SearchService')
  }
  public static async getAllDatasets (): Promise<any[]> {
    const url = this.erddapApi.getUrl({
      protocol: 'tabledap',
      allDatasets: true,
      response: 'csv',
      constraints: this.CONSTRAINTS,
      variables: this.COLUMN_NAMES
    })
    const dataService = new DataService({ resultType: 'csv', url, type: '' })
    const results = await dataService.get()
    console.log(results)
    return results.data
  }
}
