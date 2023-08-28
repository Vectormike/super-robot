import { Sequelize } from 'sequelize';
import Env from '../helpers/env';

let sequelize;
if (process.env.CLEARDB_DATABASE_URL) {
  sequelize = new Sequelize(process.env.CLEARDB_DATABASE_URL, {
    dialect: 'mysql',
  });
}
sequelize = new Sequelize(
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
