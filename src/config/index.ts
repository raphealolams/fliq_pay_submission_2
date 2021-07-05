import dotenv from 'dotenv';

dotenv.config()

const PORT = process.env.PORT
const HOSTNAME = process.env.HOSTNAME || 'localhost'

const SERVER = {
    hostname: HOSTNAME,
    port: PORT,
}

const DATABASE_OPTIONS = {
    useUnifiedTopology: true,
    useNewUrlParser: true,
    socketTimeoutMS: 30000,
    keepAlive: true,
    poolSize: 50,
    autoIndex: false,
    retryWrites: false,
    useFindAndModify: false
};

const DATABASE_USERNAME = process.env.DATABASE_USERNAME;
const DATABASE_PASSWORD = process.env.DATABASE_PASSWORD;
const DATABASE_HOST = process.env.DATABASE_HOST;
const DATABASE_PORT = process.env.DATABASE_PORT;
const DATABASE_NAME = process.env.DATABASE_NAME;

const SALT = process.env.SALT || 10;

const MONGO = {
    host: DATABASE_HOST,
    password: DATABASE_PASSWORD,
    username: DATABASE_USERNAME,
    port: DATABASE_PORT,
    options: DATABASE_OPTIONS,
    url: `mongodb://${DATABASE_HOST}:${DATABASE_PORT}/${DATABASE_NAME}`
};

const jwtConfig = {
    privateKey: process.env.JWT_PRIVATE_KEY,
    tokenExpiresAt: process.env.JWT_EXPIRY_TIME
}


const config = {
    server: SERVER,
    mongo: MONGO,
    saltFactory: SALT,
    jwtConfig: jwtConfig,
}

export default config