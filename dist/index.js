import { Telegraf } from "telegraf";
import { BOT_TOKEN } from "./env.js";
import registerUser from "./utils/registerUser.js";
import checkAdmin from "./utils/checkAdmin.js";
import uploadAssignment from "./utils/uploadAssignment.js";
import checkUser from "./utils/checkUser.js";
import getLeaderBoard from "./utils/getLeaderBoard.js";
import getAssignment from "./utils/getAssignment.js";
import getUserData from "./utils/getUserData.js";
import getTask from "./utils/getTask.js";
import setupPrompt from "./utils/setupPrompt.js";
import getAnswer from "./utils/getAnswerFromAi.js";
import updateUserPoints from "./utils/updateUserPoints.js";
import setupNotes from "./utils/setupNotes.js";
import checkIfAlreadyAnswer from "./utils/checkIfAlreadyAnswer.js";
import createAnswer from "./utils/createAnswer.js";
import { helpMessage, infoMessage, noMessageHasBeenReceived, noTaskMessage, pleaseSendJSONMessage, registerLinkMessage, registerMessage, shortAnswerMessage, taskAlreadyDoneMessage, UnautherizedMessage, unExpectedErrorMessage, unknownCommand } from "./messages/messages.js";
const bot = new Telegraf(BOT_TOKEN);
bot.start((ctx) => ctx.reply(infoMessage));
bot.command("info", (ctx) => ctx.reply(infoMessage));
bot.command('help', (ctx) => ctx.reply(helpMessage));
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
    if (!await checkUser(ctx.message.from.id.toString())) {
        return ctx.reply(registerMessage);
    }
    else {
        const assignment = await getTask();
        if (!assignment) {
            ctx.reply(noTaskMessage);
        }
        else {
            if (await checkIfAlreadyAnswer(ctx.message.from.id.toString(), assignment.id)) {
                ctx.reply(taskAlreadyDoneMessage);
            }
            else {
                const code = ctx.message.text.substring(7);
                if (code.length < 20) {
                    ctx.reply(shortAnswerMessage);
                }
                else {
                    const prompt = setupPrompt(code, assignment.message);
                    const data = await getAnswer(prompt);
                    if (!data) {
                        ctx.reply(unExpectedErrorMessage);
                    }
                    else {
                        await createAnswer(ctx.message.from.id.toString(), assignment.id);
                        data.average = (data.average > 10) ? 10 : data.average;
                        await updateUserPoints(ctx.message.from.id.toString(), data.average);
                        const message = setupNotes(data.note, data.average);
                        ctx.reply(message, { parse_mode: 'Markdown' });
                    }
                }
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
bot.launch();
export default bot;
