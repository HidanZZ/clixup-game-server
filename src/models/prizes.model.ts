import { Prize } from '@/interfaces/prizes.interface';
import { model, Schema, Document } from 'mongoose';
export const prizeSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  rules: {
    originalDailyLimit: {
      type: Number,
      default: null,
    },
    dailyLimit: {
      type: Number,
      default: null,
    },
    totalSupply: {
      type: Number,
      default: null,
    },
    supplyLeft: {
      type: Number,
      default: null,
    },
  },
});

export const PrizeModel = model<Prize & Document>('Prize', prizeSchema);
