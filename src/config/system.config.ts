import { Environment } from '../types/environment';
import { DEPLOYED_ENVIRONMENTS } from './constants';

export default () => ({
  port: parseInt(process.env.PORT, 10) || 3000,
  isProduction: process.env.APP_ENV === Environment.PRODUCTION,
  isDeployedApplication: DEPLOYED_ENVIRONMENTS.includes(
    Environment[process.env.APP_ENV],
  ),
});
