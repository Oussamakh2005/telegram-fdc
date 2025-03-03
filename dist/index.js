import { Telegraf } from "telegraf";
import { BOT_TOKEN } from "./env.js";
import registerUser from "./utils/registerUser.js";
const bot = new Telegraf(BOT_TOKEN);
bot.start((ctx) => ctx.reply(`Welcome to code mentor bot!
this bot is under development, please be patient with us.
`));
bot.command("register", async (ctx) => {
    const messageText = ctx.message.text.split(" ");
    if (messageText.length !== 2) {
        ctx.reply("Please provide your profile link after the command");
    }
    else {
        const profileLink = messageText[1];
        const message = await registerUser(ctx.message.from.id.toString(), profileLink);
        ctx.reply(message);
    }
});
bot.launch(() => {
    console.log("Bot started");
});
