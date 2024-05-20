import express, { Express } from "express"
import cors from "cors"
import morgan from "morgan"
import { RootRouter } from "./Routes/RootRouter"

// import { RootRouter } from "./routes/RootRouter"
export class App {
  private static instance: Express

  static getInstance(): Express {
    if (!App.instance) {
      App.instance = express()
      App.instance.use(morgan("dev"))
      App.instance.use(
        cors({
          // origin: "http://localhost:3000",
          // methods: ["GET", "POST", "PUT", "DELETE"],
          // allowedHeaders: ["content-type", "Authorization"],
        })
      )
      App.instance.use(express.json())
      App.instance.use(
        express.urlencoded({
          extended: true,
        })
      )
      App.instance.use(RootRouter.getRouter())
    }
    return App.instance
  }
}
