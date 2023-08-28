import { Sequelize } from 'sequelize';
import Env from '../helpers/env';

const sequelize = new Sequelize(
  Env.get('DB_NAME'),
  Env.get('DB_USER'),
  Env.get('DB_PASSWORD'),
  {
    host: Env.get('DB_HOST'),
    dialect: 'mysql',
    port: Env.get('DB_PORT'),
    logging: false,
  },
);

export default sequelize;
