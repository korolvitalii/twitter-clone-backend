import mongose from 'mongoose';

mongose.Promise = Promise;

mongose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/twitter', {});

const db = mongose.connection;

db.on('error', console.error.bind(console, 'connection error: '));

export { db, mongose };
