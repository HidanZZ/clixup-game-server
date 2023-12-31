import { GamesService } from '@/services/games.service';
import { UserService } from '@/services/users.service';
import * as cron from 'node-cron';
import Container from 'typedi';

export const gameCron = () => {
  //cron every 1 minute
  // cron.schedule('*/1 * * * *', async () => {
  //   const game = Container.get(GamesService);
  //   const userService = Container.get(UserService);
  //   game.resetDailyLimits();
  //   userService.resetDailyParticipation();
  // });

  cron.schedule('0 0 * * *', async function () {
    const game = Container.get(GamesService);
    const userService = Container.get(UserService);
    game.resetDailyLimits();
    userService.resetDailyParticipation();
  });
};
