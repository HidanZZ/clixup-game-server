import { hash } from 'bcrypt';
import { Service } from 'typedi';
import { HttpException } from '@exceptions/httpException';
import { Game } from '@/interfaces/games.interface';
import { GameModel } from '@/models/games.model';

@Service()
export class GamesService {
  public async findGameById(gameId: string): Promise<Game> {
    const findGame: Game = await GameModel.findOne({ _id: gameId });
    if (!findGame) throw new HttpException(409, "Game doesn't exist");

    return findGame;
  }

  public async createGame(gameData: Game): Promise<Game> {
    if (!gameData.prizes || !Array.isArray(gameData.prizes)) {
      throw new HttpException(400, 'Invalid game data. Prizes should be an array.');
    }
    const createGameData: Game = await GameModel.create(gameData);

    return createGameData;
  }
  public async updateGame(gameId: string, gameData: Game): Promise<Game> {
    if (gameData.prizes && !Array.isArray(gameData.prizes)) {
      throw new HttpException(400, 'Invalid game data. Prizes should be an array.');
    }

    if (gameData._id) {
      const findGame = await GameModel.findOne({ _id: gameData._id });
      if (findGame && findGame._id != gameId) throw new HttpException(409, `This game ${gameData._id} already exists`);
    }

    // Find the game by id
    const game = await GameModel.findById(gameId);
    if (!game) throw new HttpException(409, "Game doesn't exist");

    // Update the properties of the game
    game.set(gameData);

    // Save the game with the updated data
    const updatedGame = await game.save();

    return updatedGame;
  }

  public async resetDailyLimits(): Promise<void> {
    const games = await GameModel.find({});

    for (const game of games) {
      //check if game is active
      const start = new Date(game.startDate);
      const end = new Date(game.endDate);
      const today = new Date();
      if (today >= start && today <= end) {
        console.log('resetting daily limits for game', game._id);
        for (const prize of game.prizes) {
          // Add the unused prizes to the next day's limit
          prize.rules.dailyLimit += prize.rules.originalDailyLimit;
        }
      }

      await game.save();
    }
  }
}
