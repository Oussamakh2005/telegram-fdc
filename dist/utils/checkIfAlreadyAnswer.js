import prisma from "../services/prismaClient.js";
const checkIfAlreadyAnswer = async (chatId, assignmentId) => {
    const answer = await prisma.answer.findFirst({
        where: {
            chatId: chatId,
            assigmentId: assignmentId,
        }
    });
    if (answer) {
        return true;
    }
    else {
        return false;
    }
};
export default checkIfAlreadyAnswer;
