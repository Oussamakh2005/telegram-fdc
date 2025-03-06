import prisma from "../services/prismaClient.js";
const getUserData = async (chatId) => {
    try {
        const user = await prisma.user.findUnique({
            where: {
                chatId: chatId
            },
            select: {
                name: true,
                points: true,
            }
        });
        return `Name : ${user?.name},
Points : ${user?.points}
        `;
    }
    catch (err) {
        return `شيئ ما خاطئ قد حدث يرجى إعادة المحاولة لاحقا ❌️`;
    }
};
export default getUserData;
