import { Telegraf } from "telegraf";
import { BOT_TOKEN, PUBLIC_URL } from "./env.js";
import registerUser from "./utils/registerUser.js";
import checkAdmin from "./utils/checkAdmin.js";
import uploadAssignment from "./utils/uploadAssignment.js";
import checkUser from "./utils/checkUser.js";
import getLeaderBoard from "./utils/getLeaderBoard.js";
import getAssignment from "./utils/getAssignment.js";
import getUserData from "./utils/getUserData.js";
import getTask from "./utils/getTask.js";
import checkIfAlreadyAnswer from "./utils/checkIfAlreadyAnswer.js";
import { helpMessage, infoMessage, linkMessae, noMessageHasBeenReceived, noTaskMessage, pleaseSendJSONMessage, registerLinkMessage, registerMessage, taskAlreadyDoneMessage, UnautherizedMessage, unknownCommand, whatNewMessage } from "./messages/messages.js";
import { signToken } from "./utils/jwtHelper.js";
const bot = new Telegraf(BOT_TOKEN);
bot.start((ctx) => ctx.reply(infoMessage));
bot.command("info", (ctx) => ctx.reply(infoMessage));
bot.command('help', (ctx) => ctx.reply(helpMessage));
bot.command('new', (ctx) => {
    ctx.reply(whatNewMessage);
});
bot.command("register", async (ctx) => {
    const messageText = ctx.message.text.split(" ");
    if (messageText.length !== 2) {
        ctx.reply(registerLinkMessage);
    }
    else {
        const profileLink = messageText[1];
        const message = await registerUser(ctx.message.from.id.toString(), profileLink);
        ctx.reply(message);
    }
});
bot.command('me', async (ctx) => {
    if (!await checkUser(ctx.message.from.id.toString())) {
        return ctx.reply(registerMessage);
    }
    else {
        return ctx.reply(await getUserData(ctx.message.from.id.toString()));
    }
});
bot.command("leaderboard", async (ctx) => {
    if (!await checkUser(ctx.message.from.id.toString())) {
        return ctx.reply(registerMessage);
    }
    else {
        return ctx.reply(await getLeaderBoard());
    }
});
bot.command("assignment", async (ctx) => {
    if (!await checkUser(ctx.message.from.id.toString())) {
        return ctx.reply(registerMessage);
    }
    else {
        return ctx.reply(await getAssignment());
    }
});
bot.command('answer', async (ctx) => {
    const chatId = ctx.message.from.id.toString();
    if (!await checkUser(ctx.message.from.id.toString())) {
        return ctx.reply(registerMessage);
    }
    else {
        const assignment = await getTask();
        if (!assignment) {
            ctx.reply(noTaskMessage);
        }
        else {
            if (await checkIfAlreadyAnswer(chatId, assignment.id)) {
                ctx.reply(taskAlreadyDoneMessage);
            }
            else {
                const token = signToken({ chatId: chatId }, 1000 * 60 * 10);
                ctx.reply(linkMessae, {
                    reply_markup: {
                        inline_keyboard: [[{ text: "افتح الرابط", url: `${PUBLIC_URL}editor?token=${token}` }]]
                    }
                });
            }
        }
    }
});
bot.on("message", async (ctx) => {
    if (!ctx.message) {
        return ctx.reply(noMessageHasBeenReceived);
    }
    else {
        if ('caption' in ctx.message && ctx.message.caption === "/newAssignment") {
            if (!await checkAdmin(ctx.message.from.id.toString())) {
                return ctx.reply(UnautherizedMessage);
            }
            else {
                if ('document' in ctx.message && ctx.message.document && ctx.message.document.mime_type === "application/json") {
                    const fileId = ctx.message.document.file_id;
                    await uploadAssignment(fileId, ctx);
                }
                else {
                    return ctx.reply(pleaseSendJSONMessage);
                }
            }
        }
        else {
            return ctx.reply(unknownCommand);
        }
    }
});
export default bot;
