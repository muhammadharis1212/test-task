import { App } from '@/app';
import { AuthRoute } from '@routes/auth.route';
import { ValidateEnv } from '@utils/validateEnv';
import { LocusRoute } from './routes/locus.route';

ValidateEnv();

const app = new App([new AuthRoute(), new LocusRoute()]);

app.listen();
