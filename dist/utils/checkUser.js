import prisma from "../services/prismaClient.js";
const checkUser = async (chatId) => {
    const user = await prisma.user.findUnique({
        where: {
            chatId: chatId
        }
    });
    if (user) {
        return true;
    }
    else {
        return false;
    }
};
export default checkUser;
