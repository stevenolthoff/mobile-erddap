import { IDataService } from '@axdspub/axiom-ui-data-services'
import { ErddapApi } from '@axdspub/erddap-service/lib/api'
import TimeFrameService, { TimeFrame } from '@/Services/TimeFrame'
import { ISensorProps } from '@/Components/Sensor/Sensor'

export default class SensorService {
  static SERVER = process.env.REACT_APP_SERVER || 'https://erddap.sensors.axds.co/erddap'
  static erddapApi = new ErddapApi(this.SERVER)
  static TIME_PROP = 'time (UTC)'

  public static getDataService (sensor: ISensorProps): IDataService {
    const { datasetId, name, valueName, valueUnits } = sensor
    const timeFrame = TimeFrameService.getTimeFrame(sensor.timeFrame)
    const url = this.getUrl(datasetId, name, timeFrame)
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

  private static getUrl (datasetId: string, sensorName: string, timeFrame: TimeFrame) {
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
