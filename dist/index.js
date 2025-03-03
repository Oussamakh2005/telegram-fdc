"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const telegraf_1 = require("telegraf");
const env_1 = require("./env");
const registerUser_1 = __importDefault(require("./utils/registerUser"));
const bot = new telegraf_1.Telegraf(env_1.BOT_TOKEN);
bot.start((ctx) => ctx.reply(`Welcome to code mentor bot!
this bot is under development, please be patient with us.
`));
bot.command("register", async (ctx) => {
    const messageText = ctx.message.text.split(" ");
    if (messageText.length !== 2) {
        ctx.reply("Invalid command usage");
    }
    else {
        const profileLink = messageText[1];
        const message = await (0, registerUser_1.default)(ctx.message.from.id.toString(), profileLink);
        ctx.reply(message);
    }
});
bot.launch(() => {
    console.log("Bot started");
});
