import { userAlreadyRegistredMessage, userRegistredSuccessMessage, wrongProfileLinkMessage } from "../messages/messages.js";
import prisma from "../services/prismaClient.js";
import checkUser from "./checkUser.js";
import fetchUser from "./fetchUserRoute.js";
import siteIdExtractor from "./siteIdExtractor.js";
const registerUser = async (chatId, profileLink) => {
    const isRegistred = await checkUser(chatId);
    if (isRegistred) {
        return userAlreadyRegistredMessage;
    }
    const siteId = siteIdExtractor(profileLink);
    const userData = await fetchUser(siteId);
    if (!userData) {
        return wrongProfileLinkMessage;
    }
    else {
        await prisma.user.create({
            data: {
                chatId: chatId,
                siteId: userData.id,
                name: userData.name
            }
        });
        return userRegistredSuccessMessage;
    }
};
export default registerUser;
