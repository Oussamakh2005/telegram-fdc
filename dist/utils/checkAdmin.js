import prisma from "../services/prismaClient.js";
const checkAdmin = async (chatId) => {
    const user = await prisma.user.findUnique({
        where: {
            chatId: chatId
        }
    });
    if (user && user.role === "ADMIN") {
        return true;
    }
    else {
        return false;
    }
};
export default checkAdmin;
