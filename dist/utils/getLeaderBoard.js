import prisma from "../services/prismaClient.js";
const getLeaderBoard = async () => {
    const users = await prisma.user.findMany({
        where: {
            role: "USER"
        },
        orderBy: {
            points: "desc"
        }
    });
    let message = "🏆 Leaderboard 🏆\n\n";
    users.forEach((user, index) => {
        message += `${index + 1}. ${user.name} - ${user.points} points ${((index + 1) > 3) ? "" : (index + 1 === 3) ? "🥉" : (index + 1 === 2) ? "🥈" : "🥇"} \n`;
    });
    return message;
};
export default getLeaderBoard;
