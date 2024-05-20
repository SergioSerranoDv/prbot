import { Request, Response, Router } from "express"
import { Discord } from "../clients/Discord" // Adjust the path as necessary

interface ErrorResponse {
  status: string
  code: number
  message: string
}
export class RootRouter {
  private static instance: RootRouter
  private router: Router
  private discord: Discord

  private readonly GITHUB_EVENTS = {
    PING: "ping",
    PUSH: "push",
  }
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

  // This method will handle the incoming GitHub webhooks
  private async handleGithubWebhook(req: Request, res: Response) {
    try {
      let response: ErrorResponse = {
        status: "error",
        code: 500,
        message: "Internal server error",
      }
      const githubEvent = req.headers["x-github-event"] as string
      const payload = req.body.payload

      if (githubEvent === this.GITHUB_EVENTS.PING) {
        response = {
          status: "Success",
          code: 201,
          message: "pong",
        }
      } else if (githubEvent === this.GITHUB_EVENTS.PUSH) {
        console.log("Received push event")
        response = await this.sendMessageToChannel(payload)
      }
      if (response.status === "error") {
        return res.status(response.code).send({
          status: "error",
          code: response.code,
          message: response.message,
        })
      }
      return res.status(response.code).send({
        status: "success",
        code: response.code,
        message: response.message,
      })
    } catch (error: any) {
      return res.status(500).send({
        status: "error",
        code: 500,
        message: "Internal server error",
      })
    }
  }
  private async sendMessageToChannel(payload: any) {
    try {
      console.log("Sending message to Discord channel")
      const channelId = "1171241162804318310"
      const repository = payload.repository.full_name
      console.log(repository)
      const message = `New push event received on GitHub, repository: ${payload.repository.full_name}`
      console.log(message)
      const channel = await this.discord.getClient().channels.fetch(channelId)
      if (channel && channel.isTextBased()) {
        await channel.send(message)
      }
      return {
        status: "successs",
        code: 201,
        message: `Message sent to Discord channel`,
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
