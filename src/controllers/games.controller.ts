import { NextFunction, Request, Response } from 'express';
import { Container } from 'typedi';
import { Game } from '@interfaces/games.interface';
import { GamesService } from '@/services/games.service';
import { UserService } from '@/services/users.service';

export class GameController {
  public game = Container.get(GamesService);
  public userService = Container.get(UserService);
  public checkParticipationAndAvailability = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { gameId, email } = req.params;

      // First, check if the game exists
      const game = await this.game.findGameById(gameId);
      if (!game) return res.status(404).json({ message: 'Game not found' });
      const start = new Date(game.startDate);
      const end = new Date(game.endDate);
      console.log(start, end);

      // Check if the game is available today
      const today = new Date();
      if (today < start || today > end) {
        return res.json({ message: 'Game is not available today.' });
      }

      // Then find the user
      let user = await this.userService.findUserByEmail(email);
      console.log(user);

      if (!user) {
        // If user doesn't exist, create new one
        user = await this.userService.createUser({ email });
        console.log('user created', user);

        res.status(201).json({ game_id: game._id, times_left: game.playLimitPerUser });
      } else {
        if (user.gamesPlayedToday) {
          const gameParticipation = user.gamesPlayedToday.find(game => game.gameId.toString() === gameId);

          if (!gameParticipation) {
            res.json({ game_id: game._id, times_left: game.playLimitPerUser });
          } else {
            const timesLeft = game.playLimitPerUser - gameParticipation.timesPlayed;

            if (timesLeft <= 0) {
              res.json({ message: 'User has already reached the limit for this game today.' });
            } else {
              res.json({ game_id: game._id, times_left: timesLeft });
            }
          }
        } else {
          res.json({ game_id: game._id, times_left: game.playLimitPerUser });
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  public play = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { gameId, email } = req.params;

      // First, check if the game exists
      const game = await this.game.findGameById(gameId);
      if (!game) return res.status(404).json({ message: 'Game not found' });

      // Then find the user
      let user = await this.userService.findUserByEmail(email);
      if (!user) {
        // If user doesn't exist, create new one
        user = await this.userService.createUser({ email });
      }

      let gameParticipation = user.gamesPlayedToday?.find(gp => gp.gameId.toString() === gameId);

      // If user hasn't played this game today, add it to their record
      if (!gameParticipation) {
        gameParticipation = {
          gameId,
          timesPlayed: 0,
        };
        if (!user.gamesPlayedToday) {
          user.gamesPlayedToday = [gameParticipation];
        } else {
          user.gamesPlayedToday.push(gameParticipation);
        }
      }
      gameParticipation = user.gamesPlayedToday.find(gp => gp.gameId.toString() === gameId);

      // Check if user has reached the play limit
      if (gameParticipation.timesPlayed >= game.playLimitPerUser) {
        return res
          .status(400)
          .json({ message: 'You have reached the limit for this game today.', triesLeft: game.playLimitPerUser - gameParticipation.timesPlayed });
      }

      // Increment the user's play count
      gameParticipation.timesPlayed++;
      if (user.prizesWonToday && user.prizesWonToday.includes(gameId)) {
        await this.userService.updateUser(user._id, user);
        return res.json({
          message: 'You have already won a prize for this game today.',
          triesLeft: game.playLimitPerUser - gameParticipation.timesPlayed,
        });
      }

      // Randomly select a prize
      const prizeIndex = Math.floor(Math.random() * game.prizes.length);
      const prize = game.prizes[prizeIndex];

      // Check the prize conditions
      if (!prize || prize.rules.totalSupply <= 0 || prize.rules.dailyLimit <= 0) {
        await this.userService.updateUser(user._id, user);
        return res.json({ message: 'No prize to be given at this moment.', triesLeft: game.playLimitPerUser - gameParticipation.timesPlayed });
      }

      // Decrease the prize supply
      prize.rules.totalSupply--;
      prize.rules.dailyLimit--;

      if (user.prizesWonToday) {
        user.prizesWonToday.push(gameId);
      } else {
        user.prizesWonToday = [gameId];
      }

      // Save user and game
      await this.userService.updateUser(user._id, user);
      await this.game.updateGame(gameId, game);

      // Send the prize to the user
      res.json({ prize, message: 'Congratulations! You have won a prize.', triesLeft: game.playLimitPerUser - gameParticipation.timesPlayed });
    } catch (error) {
      console.log(error);
    }
  };

  public getTriesLeft = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { gameId, email } = req.params;

      // First, check if the game exists
      const game = await this.game.findGameById(gameId);
      if (!game) return res.status(404).json({ message: 'Game not found' });

      // Then find the user
      const user = await this.userService.findUserByEmail(email);
      if (!user) {
        return res.json({ triesLeft: game.playLimitPerUser });
      }

      let gameParticipation = user.gamesPlayedToday?.find(gp => gp.gameId.toString() === gameId);

      // If user hasn't played this game today, add it to their record
      if (!gameParticipation) {
        gameParticipation = {
          gameId,
          timesPlayed: 0,
        };

        if (!user.gamesPlayedToday) {
          user.gamesPlayedToday = [gameParticipation];
        } else {
          user.gamesPlayedToday.push(gameParticipation);
        }
      }

      //get game participation for the game
      gameParticipation = user.gamesPlayedToday.find(gp => gp.gameId.toString() === gameId);

      gameParticipation.timesPlayed++;
      //increment the user's play count

      // Save user and game
      const upUser = await this.userService.updateUser(user._id, user);
      console.log(upUser.gamesPlayedToday);

      res.json({ triesLeft: game.playLimitPerUser - gameParticipation.timesPlayed });
    } catch (error) {
      console.log(error);
    }
  };

  public createGame = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const gameData: Game = req.body;
      const createGameData: Game = await this.game.createGame(gameData);

      res.status(201).json({ data: createGameData, message: 'created' });
    } catch (error) {
      next(error);
    }
  };
}
