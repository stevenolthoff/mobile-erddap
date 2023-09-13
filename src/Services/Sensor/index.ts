import { DataService, IDataResult, IDataService } from '@axdspub/axiom-ui-data-services'
import { ErddapApi } from '@axdspub/erddap-service/lib/api'
import TimeFrameService, { TimeFrame } from '@/Services/TimeFrame'
import { ISensorProps } from '@/Components/Sensor/Sensor'

type EmptySensors = ISensorProps[]
type NonEmptySensors = ISensorProps[]

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

  public static async getNonEmptyAndEmptySensors (sensorProps: ISensorProps[]): Promise<[NonEmptySensors, EmptySensors]> {
    const dataFetchPromises = this.getDataForSensors(sensorProps)
    const sensors = await Promise.all(dataFetchPromises)

    let propsOfNonEmptySensors: ISensorProps[] = []
    let propsOfEmptySensors: ISensorProps[] = []

    sensors.forEach(sensorResult => {
      const y = sensorResult.result.parsed?.accessors.y
      if (y !== undefined) {
        const data = sensorResult.result.parsed?.data
        const sensorIsEmpty = data?.filter(row => y(row) !== null).length === 0
        if (sensorIsEmpty) {
          propsOfEmptySensors.push(sensorResult.sensor)
        } else {
          propsOfNonEmptySensors.push(sensorResult.sensor)
        }
      }
    })

    propsOfNonEmptySensors = propsOfNonEmptySensors.sort((a, b) => a.name > b.name ? 1 : -1)
    propsOfEmptySensors = propsOfEmptySensors.sort((a, b) => a.name > b.name ? 1 : -1)

    return [propsOfNonEmptySensors, propsOfEmptySensors]
  }

  private static getDataForSensors (sensorProps: ISensorProps[]) {
    return sensorProps.map(async props => {
      const dataServiceProps = SensorService.getDataServiceForSensorChart(props)
      const dataService = new DataService(dataServiceProps)
      return { id: props.name, result: await dataService.get(), sensor: props }
    })
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
