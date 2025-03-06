import prisma from "../services/prismaClient.js";
const updateUserPoints = async (chatId, points) => {
    const user = await prisma.user.findFirst({
        where: {
            chatId: chatId
        },
        select: {
            points: true
        }
    });
    if (user) {
        await prisma.user.update({
            where: {
                chatId: chatId
            },
            data: {
                points: user.points + points
            }
        });
        return "User points updated successfully";
    }
    return "User not found";
};
export default updateUserPoints;
