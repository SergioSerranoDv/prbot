import { Request, Response, Router } from "express"
import { Discord } from "../clients/Discord" // Adjust the path as necessary

export class RootRouter {
  private static instance: RootRouter
  private router: Router
  private discord: Discord

  private constructor() {
    this.discord = Discord.getInstance()
    // Ensure the Discord bot is started
    this.discord.start()
    this.discord.getClient().on("ready", () => {
      console.log("Discord bot is ready")
    })
    this.router = Router()
    this.router.get("/", (req: Request, res: Response) => {
      res.send("Hello world")
    })
    this.router.post("/github-webhook", this.handleGithubWebhook.bind(this))
  }

  static getRouter(): Router {
    if (!RootRouter.instance) {
      RootRouter.instance = new RootRouter()
    }
    return RootRouter.instance.router
  }
  private async handleGithubWebhook(req: Request, res: Response) {
    try {
      const githubEvent = req.headers
      console.log(githubEvent)
      // if (githubEvent === "ping") {
      //   console.log("Received ping event")
      //   return res.status(200).send({
      //     status: "ok",
      //     code: 201,
      //     message: "pong",
      //   })
      // }
      const payload = req.body
      console.log(payload)
      return res.status(201).send({
        status: "ok",
        code: 201,
        message: "Webhook received",
      })
    } catch (error) {
      console.error(error)
      return res.status(500).send({
        status: "error",
        code: 500,
        message: "Internal server error",
      })
    }
  }
  private async senMessageToChannel() {
    try {
      const channelId = "1171241162804318310"
      const channel = await this.discord.getClient().channels.fetch(channelId)
      if (channel && channel.isTextBased()) {
        await channel.send("Hello from the prbot!")
      }
    } catch (error) {
      console.error(error)
    }
  }
}
