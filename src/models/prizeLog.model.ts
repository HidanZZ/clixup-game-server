import { PrizeLog } from '@/interfaces/prizeLog.interface';
import { model, Schema, Document } from 'mongoose';
import { prizeSchema } from './prizes.model';

const prizeLogSchema = new Schema({
  userEmail: { type: 'string' },
  gameId: {
    type: Schema.Types.ObjectId,
    ref: 'Game',
  },
  timestamp: {
    //the date in which the document was created
    type: Schema.Types.Date,
  },
  prize: prizeSchema,
});
export const PrizeLogModel = model<PrizeLog & Document>('PrizeLog', prizeLogSchema);
