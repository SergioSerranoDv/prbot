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
      const githubEvent = req.headers["x-github-event"]
      const payload = req.body
      let response
      if (githubEvent === "ping") {
        return res.status(201).send({
          status: "ok",
          code: 201,
          message: "pong",
        })
      } else if (githubEvent === "push") {
        response = await this.senMessageToChannel(payload)
      }
      return response
    } catch (error) {
      return res.status(500).send({
        status: "error",
        code: 500,
        message: "Internal server error",
      })
    }
  }
  private async senMessageToChannel(payload: any) {
    try {
      const channelId = "1171241162804318310"
      const message = `New push to ${payload.repository.full_name} by ${payload.pusher.name}`
      const channel = await this.discord.getClient().channels.fetch(channelId)
      if (channel && channel.isTextBased()) {
        await channel.send(message)
      }
      return {
        status: "successs",
        code: 201,
        message: `Message sent to Discord channel, ${channel}`,
      }
    } catch (error) {
      return {
        status: "error",
        code: 500,
        message: "Internal server error",
      }
    }
  }
}
