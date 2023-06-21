import { model, Schema, Document } from 'mongoose';
import { prizeSchema } from './prizes.model';
import { Game } from '@/interfaces/games.interface';

const gameSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  playLimitPerUser: {
    type: Number,
    default: null,
  },
  startDate: {
    type: Date,
    default: Date.now,
  },
  endDate: {
    type: Date,
    default: null,
  },
  prizes: [prizeSchema],
});

export const GameModel = model<Game & Document>('Game', gameSchema);
