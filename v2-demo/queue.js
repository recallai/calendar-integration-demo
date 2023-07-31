import Queue from 'bull';

const backgroundQueue = new Queue(
  "background-queue",
  process.env.REDIS_URL
);

export { backgroundQueue };