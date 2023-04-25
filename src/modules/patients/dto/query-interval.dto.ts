export enum Interval {
  WEEK = 'Week',
  MONTH = 'Month',
}

export class QueryIntervalDto {
  interval: Interval;
}
