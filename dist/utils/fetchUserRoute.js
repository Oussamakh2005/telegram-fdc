import { USER_ROUTE } from "../env.js";
const fetchUser = async (userId) => {
    try {
        const response = await fetch(USER_ROUTE + userId);
        return await response.json();
    }
    catch (error) {
        console.error(error);
        return null;
    }
};
export default fetchUser;
