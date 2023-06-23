import { Router } from 'express';
import { UserController } from '@controllers/users.controller';
import { CreateUserDto } from '@dtos/users.dto';
import { Routes } from '@interfaces/routes.interface';
import { ValidationMiddleware } from '@middlewares/validation.middleware';
import { GameController } from '@/controllers/games.controller';

export class GameRoute implements Routes {
  public path = '/games';
  public router = Router();
  public game = new GameController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get(`${this.path}/:gameId/check-participation/:email`, this.game.checkParticipationAndAvailability);
    this.router.get(`${this.path}/:gameId/play/:email`, this.game.play);
    this.router.get(`${this.path}/:gameId/tries/:email`, this.game.getTriesLeft);
    this.router.post(`${this.path}`, this.game.createGame);
  }
}
