require("dotenv/config")

export const params: object = {
  user: process.env.user,
  host: process.env.host,
  database: process.env.database,
  password: process.env.password,
  port: parseInt(process.env.port!),
  max: 30,
  idleTimeoutMillis: 300000,
  connectionTimeoutMillis: 60000
}
