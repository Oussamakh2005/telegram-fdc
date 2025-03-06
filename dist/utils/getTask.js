import prisma from "../services/prismaClient.js";
const getTask = async () => {
    const assignment = await prisma.assignment.findFirst({
        where: {
            isAvailable: true,
        },
        select: {
            id: true,
            tasks: true,
        }
    });
    if (!assignment) {
        return null;
    }
    let message = "";
    for (const task of assignment.tasks) {
        message += `\n${task}`;
    }
    return { id: assignment.id, assignment, message };
};
export default getTask;
