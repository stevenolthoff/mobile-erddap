export type ETimeFrame = 'past-week' | 'past-day'
export type TimeFrame = { start: Date, end: Date }

export default class TimeFrameService {
  public static getTimeFrame (type: ETimeFrame): TimeFrame {
    const now = new Date()
    if (type === 'past-week') {
      return { start: this.getLastWeeksDate(), end: now }
    } else if (type === 'past-day') {
      return { start: this.getOneDayAgo(), end: now }
    } else {
      console.error(`TimeFrame type ${type} not supported.`)
      return { start: now, end: now }
    }
  }

  private static getLastWeeksDate (): Date {
    const now = new Date()
    return new Date(now.getFullYear(), now.getMonth(), now.getDate() - 7)
  }

  private static getOneDayAgo (): Date {
    const now = new Date()
    return new Date(now.getFullYear(), now.getMonth(), now.getDate() - 1)
  }
}
