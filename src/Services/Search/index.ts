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
  SERVER =
    process.env.REACT_APP_SERVER || 'https://erddap.sensors.axds.co/erddap'
  erddapApi = new ErddapApi(this.SERVER)
  COLUMN_NAMES = [
    'datasetID',
    'title',
    'minLongitude',
    'maxLongitude',
    'minLatitude',
    'maxLatitude',
    'minTime',
    'maxTime',
    'summary',
  ]
  public async getAllDatasets(
    minTime: string,
    maxTime: string,
    minLatitude: number,
    maxLatitude: number,
    minLongitude: number,
    maxLongitude: number
  ): Promise<IDatasetOnMap[]> {
    const url = this.erddapApi.getUrl({
      protocol: 'tabledap',
      allDatasets: true,
      response: 'csv',
      variables: this.COLUMN_NAMES,
      constraints: this.modifyConstraints(
        minTime,
        maxTime,
        minLatitude,
        maxLatitude,
        minLongitude,
        maxLongitude
      ),
    })
    const dataService = new DataService({ resultType: 'csv', url, type: '' })
    const results: { data: IDatasetOnMap[] } = await dataService.get()
    return results.data
  }

  /**
   *
   * @returns A cancellable DataService for making /search/advanced requests.
   */
  public getDataServiceForAdvancedSearch(
    searchFor: string,
    page: number,
    itemsPerPage: number,
    minTime: string,
    maxTime: string,
    minLatitude: number,
    maxLatitude: number,
    minLongitude: number,
    maxLongitude: number,
    standardName?: string
  ) {
    const constraints: IConstraint[] = [
      {
        name: 'searchFor',
        operator: '=',
        value: searchFor,
      },
      {
        name: 'itemsPerPage',
        operator: '=',
        value: itemsPerPage,
      },
      {
        name: 'page',
        operator: '=',
        value: page,
      },
      {
        name: 'minLatitude',
        operator: '>=',
        value: minLatitude,
      },
      {
        name: 'minLongitude',
        operator: '>=',
        value: minLongitude,
      },
      {
        name: 'maxLongitude',
        operator: '<=',
        value: maxLongitude,
      },
      {
        name: 'maxLatitude',
        operator: '<=',
        value: maxLatitude,
      },
      {
        name: 'minTime',
        operator: '=',
        value: minTime,
      },
      {
        name: 'maxTime',
        operator: '=',
        value: maxTime,
      },
    ]
    if (standardName) {
      constraints.push({
        name: 'standard_name',
        operator: '=',
        value: standardName,
      })
    }
    const url = this.erddapApi.getUrl({
      request: 'search/advanced',
      constraints,
      response: 'csv',
    })
    return new DataService({ resultType: 'csv', url, type: '' })
  }

  /**
   * When using /allDatasets, spatial and temporal constraints must be modified to achieve expected behavior.
   * Due to how /allDatasets is implemented, we must filter as such:
   * dataset.maxTime >= minTime ^ dataset.minTime <= maxTime
   */
  private modifyConstraints(
    minTime: string,
    maxTime: string,
    minLatitude: number,
    maxLatitude: number,
    minLongitude: number,
    maxLongitude: number
  ): IConstraint[] {
    return [
      {
        name: 'minLatitude',
        operator: '<=',
        value: maxLatitude,
      },
      {
        name: 'minLongitude',
        operator: '<=',
        value: maxLongitude,
      },
      {
        name: 'maxLongitude',
        operator: '>=',
        value: minLongitude,
      },
      {
        name: 'maxLatitude',
        operator: '>=',
        value: minLatitude,
      },
      {
        name: 'minTime',
        operator: '<=',
        value: maxTime,
      },
      {
        name: 'maxTime',
        operator: '>=',
        value: minTime,
      },
    ]
  }
}
