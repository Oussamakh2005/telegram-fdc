import express from 'express';
import { PORT } from './env.js';
import bot from './index.js';
import cors from 'cors';
import path from 'path';
import { verifyToken } from './utils/jwtHelper.js';
import { codeSendMessage, noTaskMessage, taskAlreadyDoneMessage, unExpectedErrorMessage } from './messages/messages.js';
import getTask from './utils/getTask.js';
import checkIfAlreadyAnswer from './utils/checkIfAlreadyAnswer.js';
import setupPrompt from './utils/setupPrompt.js';
import getAnswer from './utils/getAnswerFromAi.js';
import createAnswer from './utils/createAnswer.js';
import updateUserPoints from './utils/updateUserPoints.js';
import setupNotes from './utils/setupNotes.js';
const app = express();
app.use(express.json());
app.use(cors({
    origin: "*"
}));
app.use(express.static(path.join(process.cwd(), "public")));
app.get('/editor', async (req, res) => {
    const token = req.query.token;
    const payload = verifyToken(token);
    if (!payload) {
        res.sendFile(path.join(process.cwd(), "public", "invalidLink.html"));
    }
    else {
        res.sendFile(path.join(process.cwd(), "public", "editor.html"));
    }
});
app.post('/submit', async (req, res) => {
    const token = req.headers.authorization;
    const payload = verifyToken(token);
    if (!payload) {
        res.sendFile(path.join(process.cwd(), "public", "invalidLink.html"));
    }
    else {
        const assignment = await getTask();
        if (!assignment) {
            bot.telegram.sendMessage(payload.chatId, noTaskMessage);
            res.status(200).json({
                ok: true,
                msg: noTaskMessage,
                color: "#dc3545"
            });
        }
        else {
            if (await checkIfAlreadyAnswer(payload.chatId, assignment.id)) {
                bot.telegram.sendMessage(payload.chatId, taskAlreadyDoneMessage);
                res.status(200).json({
                    ok: true,
                    msg: taskAlreadyDoneMessage,
                    color: "#dc3545"
                });
            }
            else {
                const code = req.body.code;
                const prompt = setupPrompt(code, assignment.message);
                const data = await getAnswer(prompt);
                if (!data) {
                    bot.telegram.sendMessage(payload.chatId, unExpectedErrorMessage);
                    res.status(200).json({
                        ok: true,
                        msg: unExpectedErrorMessage,
                        color: "#dc3545"
                    });
                }
                else {
                    await createAnswer(payload.chatId, assignment.id);
                    data.average = (data.average > 10) ? 10 : data.average;
                    await updateUserPoints(payload.chatId, data.average);
                    const message = setupNotes(data.note, data.average);
                    bot.telegram.sendMessage(payload.chatId, message, { parse_mode: 'Markdown' });
                    res.status(200).json({
                        ok: true,
                        msg: codeSendMessage,
                        color: "#52BE4F"
                    });
                }
            }
        }
    }
});
app.listen(PORT, () => {
    console.log("App start on port " + PORT),
        bot.launch(() => {
            console.log("bot started successfully");
        });
});
