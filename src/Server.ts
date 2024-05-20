import { App } from "./App"
import dotenv from "dotenv"
dotenv.config({
  path: ".env.development",
})

export class Server {
  private static instance: Server
  private constructor() {
    this.start()
  }

  static getInstance(): Server {
    if (!Server.instance) {
      Server.instance = new Server()
    }
    return Server.instance
  }
  private start() {
    App.getInstance().listen(process.env.PORT, () => {
      console.log(`Server running on port ${process.env.PORT}`)
    })
  }
}
