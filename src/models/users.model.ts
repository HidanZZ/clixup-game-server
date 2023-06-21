import { model, Schema, Document } from 'mongoose';
import { User } from '@interfaces/users.interface';

const UserSchema: Schema = new Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  gamesPlayedToday: [
    {
      gameId: {
        type: Schema.Types.ObjectId,
        ref: 'Game',
      },
      timesPlayed: {
        type: Number,
        default: 0,
      },
    },
  ],
  prizesWonToday: {
    type: [Schema.Types.ObjectId],
    ref: 'Prize',
  },
});

export const UserModel = model<User & Document>('User', UserSchema);
