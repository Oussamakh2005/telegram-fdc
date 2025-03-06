import prisma from "../services/prismaClient.js";
const getAssignment = async () => {
    const assignment = await prisma.assignment.findFirst({
        where: {
            isAvailable: true
        }
    });
    if (!assignment) {
        return "❌ لا توجد مهام متاحة حاليًا.";
    }
    let message = `📌 ${assignment.title}\n\n`;
    message += `📜 المحتوى:\n`;
    assignment.content.forEach((content, index) => {
        message += `${index + 1}. ${content}\n`;
    });
    message += `\n📺 قائمة التشغيل:\n ${assignment.playlist}\n\n`;
    message += `🎥 الفيديوهات: `;
    assignment.video.forEach((video, index) => {
        message += ` ${video} `;
    });
    message += `\n\n📝 المهام:\n`;
    assignment.tasks.forEach((task, index) => {
        message += `${index + 1}. ${task}\n`;
    });
    return message;
};
export default getAssignment;
