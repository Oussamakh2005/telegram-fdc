import prisma from "../services/prismaClient.js";
const createAnswer = async (chatId, assigmentId) => {
    await prisma.answer.create({
        data: {
            chatId: chatId,
            assigmentId: assigmentId
        }
    });
};
export default createAnswer;
