import { App } from '@/app';
import { UserRoute } from '@routes/users.route';
import { ValidateEnv } from '@utils/validateEnv';
import { GameRoute } from './routes/games.route';

ValidateEnv();

const app = new App([new UserRoute(), new GameRoute()]);

app.listen();
