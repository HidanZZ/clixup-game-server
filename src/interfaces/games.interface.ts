import { Prize } from './prizes.interface';

export interface Game {
  _id?: string;
  name: string;
  playLimitPerUser: number;
  prizes: Prize[];
  startDate: Date;
  endDate: Date;
}
