import express from "express"
import bodyParser from "body-parser"
import helmet from "helmet"
import morgan from "morgan"
import userRoute from "../routes/user"
import farmRouter from "../routes/farm"
import batchRouter from "../routes/batch"
import stockRouter from "../routes/stock"
import { Request, Response } from "express"
const cors = require("cors")

const app = express()
const baseUri = "/api/v1"

app.use(bodyParser.json({limit: "50mb"}))
app.use(cors())
app.use(helmet())
app.use(morgan("combined"))
app.options("*", cors())

app.use(baseUri, userRoute)
app.use(baseUri, farmRouter)
app.use(baseUri, batchRouter)
app.use(baseUri, stockRouter)
app.use((req: Request,res: Response) => {
    res.status(404).json({error: 'Route not found', path: `${req.url}`})
})

export default app
