import express from 'express'
import bodyParser from 'body-parser'
import helmet from 'helmet'
import morgan from 'morgan'
import userRoute from '../routes/user'
import farmRouter from '../routes/farm'
import batchRouter from '../routes/batch'
import stockRouter from '../routes/stock'
import settingsRouter from '../routes/settings'
import errorHandle from '../middleware/error-handle'
import { noRoute } from '../middleware/no-route'
const cors = require('cors')

const app = express()
const baseUri = '/api/v1'

app.use(bodyParser.json({ limit: '50mb' }))
app.use(cors())
app.use(helmet())
app.use(morgan('combined'))
app.options('*', cors())

app.use(baseUri, userRoute)
app.use(baseUri, farmRouter)
app.use(baseUri, batchRouter)
app.use(baseUri, stockRouter)
app.use(baseUri, settingsRouter)
app.use(noRoute)
app.use(errorHandle)

export default app
