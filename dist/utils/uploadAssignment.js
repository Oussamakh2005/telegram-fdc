import prisma from "../services/prismaClient.js";
import assigScheduling from "./assignmentScheduling.js";
const uploadAssignment = async (fileId, ctx) => {
    try {
        const fileLink = await ctx.telegram.getFileLink(fileId);
        const response = await fetch(fileLink);
        const data = await response.json();
        const assignment = await prisma.assignment.create({
            data: {
                title: data.title,
                content: data.content,
                playlist: data.playlist,
                video: data.videos,
                tasks: data.tasks
            },
            select: {
                id: true,
            }
        });
        assigScheduling(assignment.id);
        ctx.reply("✅ تم استلام المهمة بنجاح!");
    }
    catch (err) {
        ctx.reply("❌ حدث خطأ أثناء قراءة ملف JSON.");
    }
};
export default uploadAssignment;
