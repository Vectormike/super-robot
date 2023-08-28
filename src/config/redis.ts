import Redis from 'ioredis';

const redisConfig = {
  port: 6379,
  host: '127.0.0.1',
};

const redisClient = new Redis(redisConfig);

export default redisClient;
