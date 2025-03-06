import cron from 'node-cron';
import prisma from '../services/prismaClient.js';
import bot from '../index.js';
import getAssignment from './getAssignment.js';
const assigScheduling = (id) => {
    const task = cron.schedule('* * 8 * * *', async () => {
        await prisma.assignment.update({
            where: {
                id: id,
            },
            data: {
                isAvailable: true
            }
        });
        const users = await prisma.user.findMany({
            where: {
                role: "USER"
            }
        });
        const message = await getAssignment();
        for (const user of users) {
            try {
                bot.telegram.sendMessage(user.chatId, message);
            }
            catch (err) {
                continue;
            }
        }
        console.log("assignmen activated successfully");
        setTimeout(async () => {
            await prisma.assignment.update({
                where: {
                    id: id,
                },
                data: {
                    isAvailable: false
                }
            });
            console.log("assignment disactivated successfully");
            task.stop();
        }, 1000 * 60);
    });
};
export default assigScheduling;
