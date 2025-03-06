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
const bot = new Telegraf(BOT_TOKEN);
bot.start((ctx) => ctx.reply(`🚀 مرحبًا بك في  – بوت التحديات البرمجية اليومية!
this bot still under development 🚧`));
bot.command("info", (ctx) => ctx.reply(`🚀 مرحبًا بك في  – بوت التحديات البرمجية اليومية!

📌 ما الذي يقدمه لك؟

يرسل لك تحديات يومية في HTML, CSS, JavaScript ولغات أخرى.
يستقبل حلولك ويحللها باستخدام الذكاء الاصطناعي.
يمنحك نقاطًا بناءً على جودة وسرعة الحل.
يتيح لك معرفة ترتيبك بين المبرمجين والتنافس مع أصدقائك.
يساعدك على تطوير مهاراتك البرمجية يومًا بعد يوم.
⚡ سجّل حسابك الآن عن طريق /register مع إرفاق رابط ملفك الشخصي من موقع النادي  💡
`));
bot.command("register", async (ctx) => {
    const messageText = ctx.message.text.split(" ");
    if (messageText.length !== 2) {
        ctx.reply("❌ يرجى إرفاق رابط ملفك الشخصي من موقع النادي.");
    }
    else {
        const profileLink = messageText[1];
        const message = await registerUser(ctx.message.from.id.toString(), profileLink);
        ctx.reply(message);
    }
});
bot.command('me', async (ctx) => {
    if (!checkUser(ctx.message.from.id.toString())) {
        return ctx.reply("❌ يرجى تسجيل حسابك أولاً عن طريق /register");
    }
    else {
        return ctx.reply(await getUserData(ctx.message.from.id.toString()));
    }
});
bot.command("leaderboard", async (ctx) => {
    if (!checkUser(ctx.message.from.id.toString())) {
        return ctx.reply("❌ يرجى تسجيل حسابك أولاً عن طريق /register");
    }
    else {
        return ctx.reply(await getLeaderBoard());
    }
});
bot.command("assignment", async (ctx) => {
    if (!checkUser(ctx.message.from.id.toString())) {
        return ctx.reply("❌ يرجى تسجيل حسابك أولاً عن طريق /register");
    }
    else {
        return ctx.reply(await getAssignment());
    }
});
bot.command('answer', async (ctx) => {
    if (!checkUser(ctx.message.from.id.toString())) {
        return ctx.reply("❌ يرجى تسجيل حسابك أولاً عن طريق /register");
    }
    else {
        const assignment = await getTask();
        if (!assignment) {
            ctx.reply(`لا توجد أي مهمة حاليا ❌️`);
        }
        else {
            if (await checkIfAlreadyAnswer(ctx.message.from.id.toString(), assignment.id)) {
                ctx.reply(`لقد قمت بتنفيذ هذه المهمة بالفعل ❕️`);
            }
            else {
                const code = ctx.message.text.substring(7);
                const prompt = setupPrompt(code, assignment.message);
                const data = await getAnswer(prompt);
                if (!data) {
                    ctx.reply(`خطأ غير متوقع قد حدث يرجى إعادة المحاولة لاحقا ❌️`);
                }
                else {
                    await createAnswer(ctx.message.from.id.toString(), assignment.id);
                    await updateUserPoints(ctx.message.from.id.toString(), data.average);
                    const message = setupNotes(data.note, data.average);
                    ctx.reply(message);
                }
            }
        }
    }
});
bot.on("message", (ctx) => {
    if (!ctx.message) {
        return ctx.reply("❌ لم يتم استلام أي رسالة.");
    }
    else {
        if ('caption' in ctx.message && ctx.message.caption === "/newAssignment") {
            if (!checkAdmin(ctx.message.from.id.toString())) {
                return ctx.reply("❌ ليس لديك صلاحية لاستخدام هذا الأمر.");
            }
            else {
                if ('document' in ctx.message && ctx.message.document && ctx.message.document.mime_type === "application/json") {
                    const fileId = ctx.message.document.file_id;
                    uploadAssignment(fileId, ctx);
                }
                else {
                    return ctx.reply("📂 يرجى إرسال ملف JSON مع هذا الأمر.");
                }
            }
        }
        else {
            return ctx.reply("❌ هذا الأمر غير معروف.");
        }
    }
});
bot.launch(() => {
    console.log("Bot started");
});
export default bot;
