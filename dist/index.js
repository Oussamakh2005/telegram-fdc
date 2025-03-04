import { Telegraf } from "telegraf";
import { BOT_TOKEN } from "./env.js";
import registerUser from "./utils/registerUser.js";
import checkAdmin from "./utils/checkAdmin.js";
import uploadAssignment from "./utils/uploadAssignment.js";
import checkUser from "./utils/checkUser.js";
import getLeaderBoard from "./utils/getLeaderBoard.js";
const bot = new Telegraf(BOT_TOKEN);
bot.start((ctx) => ctx.reply(`Welcome to the Daily Coding Challenges bot!
this bot is still under development and will be ready soon.
`));
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
        ctx.reply("Please provide your profile link after the command");
    }
    else {
        const profileLink = messageText[1];
        const message = await registerUser(ctx.message.from.id.toString(), profileLink);
        ctx.reply(message);
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
