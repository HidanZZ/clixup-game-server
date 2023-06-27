import { Prize } from './prizes.interface';

export interface PrizeLog {
  userEmail: string;
  gameId: string;
  timestamp?: Date;
  prize: Prize;
}
