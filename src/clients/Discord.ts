import { Client, GatewayIntentBits } from "discord.js"

export class Discord {
  private static instance: Discord
  private client: Client

  private constructor() {
    this.client = new Client({
      intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages],
    })
  }

  static getInstance(): Discord {
    if (!Discord.instance) {
      Discord.instance = new Discord()
    }
    return Discord.instance
  }

  start() {
    this.client
      .login(process.env.DISCORD_TOKEN)
      .then(() => {
        console.log("Discord bot logged in!")
      })
      .catch(console.error)
  }

  getClient(): Client {
    return this.client
  }
}
