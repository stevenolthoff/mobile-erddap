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
  public async getAllDatasets (minTime: string, maxTime: string, minLatitude: number, maxLatitude: number, minLongitude: number, maxLongitude: number): Promise<IDatasetOnMap[]> {
    const url = this.erddapApi.getUrl({
      protocol: 'tabledap',
      allDatasets: true,
      response: 'csv',
      variables: this.COLUMN_NAMES,
      constraints: this.getConstraints(minTime, maxTime, minLatitude, maxLatitude, minLongitude, maxLongitude)
    })
    const dataService = new DataService({ resultType: 'csv', url, type: '' })
    const results: { data: IDatasetOnMap[] } = await dataService.get()
    console.log(results)
    return results.data
  }

  private getConstraints (minTime: string, maxTime: string, minLatitude: number, maxLatitude: number, minLongitude: number, maxLongitude: number): IConstraint[] {
    return [
      {
        name: 'minLatitude',
        operator: '>=',
        value: minLatitude
      },
      {
        name: 'minLongitude',
        operator: '>=',
        value: minLongitude
      },
      {
        name: 'maxLongitude',
        operator: '<=',
        value: maxLongitude
      },
      {
        name: 'maxLatitude',
        operator: '<=',
        value: maxLatitude
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
  }
}
