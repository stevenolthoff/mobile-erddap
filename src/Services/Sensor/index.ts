import { DataService, IDataResult, IDataService } from '@axdspub/axiom-ui-data-services'
import { ErddapApi } from '@axdspub/erddap-service/lib/api'
import TimeFrameService, { TimeFrame } from '@/Services/TimeFrame'
import { ISensorProps } from '@/Components/Sensor/Sensor'

export default class SensorService {
  static SERVER = process.env.REACT_APP_SERVER || 'https://erddap.sensors.axds.co/erddap'
  static erddapApi = new ErddapApi(this.SERVER)
  static TIME_PROP = 'time (UTC)'

  public static getDataServiceForSensorChart (sensor: ISensorProps): IDataService {
    const { datasetId, name, valueName, valueUnits } = sensor
    const timeFrame = TimeFrameService.getTimeFrame(sensor.timeFrame)
    const url = this.getUrlForSensorChartData(datasetId, name, timeFrame)
    return {
      resultType: 'csv',
      type: '',
      url,
      parser: {
        type: 'erddapTimeSeries',
        args: {
          valueProp: `${valueName} (${valueUnits})`,
          timeProp: this.TIME_PROP
        }
      }
    }
  }

  public static async getLatestMeasurementsData (datasetId: string, columnNames: string[]): Promise<IDataResult> {
    const timeFrame = TimeFrameService.getTimeFrame('past-day')
    const variables = ['time', ...columnNames]
    const url = this.erddapApi.getUrl({
      protocol: 'tabledap',
      response: 'csv',
      dataset_id: datasetId,
      variables,
      constraints: [
        {
          name: 'time',
          operator: '>=',
          value: timeFrame.start
        },
        {
          name: 'time',
          operator: '<=',
          value: timeFrame.end
        }
      ]
    })
    const dataService = new DataService({ type: '', resultType: 'csv', url })
    return dataService.get()
  }

  private static getUrlForSensorChartData (datasetId: string, sensorName: string, timeFrame: TimeFrame) {
    const variables = ['time', sensorName]
    return this.erddapApi.getUrl({
      protocol: 'tabledap',
      response: 'csvp',
      dataset_id: datasetId,
      variables,
      constraints: [
        {
          name: 'time',
          operator: '>=',
          value: timeFrame.start
        },
        {
          name: 'time',
          operator: '<=',
          value: timeFrame.end
        }
      ]
    })
  }
}
