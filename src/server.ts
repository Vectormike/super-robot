import express, { Application } from 'express';
import Env from './helpers/env';
import logger from './config/logger';
import routes from './routes';
import { errorConverter, errorHandler } from './middlewares/error';
import cors from 'cors';
import sequelize from '../src/config/database';

const port = Env.get('PORT');

const app: Application = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// enable cors
app.use(cors());

app.use('/v1', routes);

// convert error to ApiError, if needed
app.use(errorConverter);

// handle error
app.use(errorHandler);

app.listen(port, () => {
  sequelize
    .sync({ alter: true, logging: false, force: false })
    .then(() => {
      logger.info('Database connected successfully');
    })
    .catch((error) => {
      logger.error('Unable to connect to the database:', error);
    });
  logger.info(`Server is running on port ${port}`);
});

let server: any;

const exitHandler = () => {
  if (server) {
    server.close(() => {
      logger.info('Server closed');
      process.exit(1);
    });
  } else {
    process.exit(1);
  }
};

const unexpectedErrorHandler = (error: any) => {
  logger.error(error);
  exitHandler();
};

process.on('uncaughtException', unexpectedErrorHandler);
process.on('unhandledRejection', unexpectedErrorHandler);

process.on('SIGTERM', () => {
  logger.info('SIGTERM received');
  if (server) {
    server.close();
  }
});
