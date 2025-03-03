import { Telegraf } from "telegraf";
import { BOT_TOKEN } from "./env.js";
import registerUser from "./utils/registerUser.js";
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
bot.launch(() => {
    console.log("Bot started");
});
