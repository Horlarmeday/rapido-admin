export enum Interval {
  WEEK = 'Week',
  MONTH = 'Month',
  DAY = 'Day',
  YEAR = 'Year'
}

export class QueryIntervalDto {
  interval: Interval;
}
