import ytdl from "ytdl-core";
import Discord from "discord.js";
import dotenv from "dotenv";
import { a1, a2 } from "./constants.js";

dotenv.config();
const client = new Discord.Client({
  intents:
    Discord.Intents.NON_PRIVILEGED |
    Discord.Intents.GUILDS |
    Discord.Intents.GUILD_MESSAGES |
    Discord.Intents.GUILD_VOICE_STATES,
});

let dispatcher = null;

client.on("ready", () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

client.on("message", async (message) => {
  if (message.content.startsWith("!n")) {
    const namePos = Math.floor(Math.random() * a1.length);
    const stringPost = Math.floor(Math.random() * a2.length);
    const name = a1[namePos];
    const phrase = a2[stringPost];

    message.reply(`${name} ${phrase}`);

    return;
  }

  if (message.content.startsWith("!f")) {
    const args = message.content.split(" ");
    const url = args[1];
    const voiceChannel = message.member.voice.channel;
    if (!voiceChannel) {
      message.reply("Você precisar estar em alguma sala.");
      return;
    }
    try {
      const connection = await voiceChannel.join();
      const stream = ytdl(url, { filter: "audioonly" });
      dispatcher = connection.play(stream);
      dispatcher.on("finish", () => {
        voiceChannel.leave();
      });
      message.reply("Tocando agora: " + url);
    } catch (err) {
      message.reply("Vídeo não encontrado.");
      console.log(err);
      voiceChannel.leave();
      return;
    }
  } else if (message.content === "!pular") {
    if (!dispatcher) {
      message.reply("Não tem música tocando.");
    } else {
      dispatcher.end();
    }
  }
});

client.login(process.env.TOKEN || "");
