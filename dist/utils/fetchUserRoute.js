import { USER_ROUTE } from "../env.js";
const isErrorResponse = (data) => {
    return typeof data === 'object' && data !== null && 'error' in data;
};
const isUser = (data) => {
    return typeof data === 'object' && data !== null && 'id' in data && 'name' in data;
};
const fetchUser = async (userId) => {
    try {
        const response = await fetch(USER_ROUTE, { method: "POST", body: JSON.stringify({ id: userId }) });
        const data = await response.json();
        if (isErrorResponse(data)) {
            return null;
        }
        if (isUser(data)) {
            return data;
        }
        return null;
    }
    catch (error) {
        return null;
    }
};
export default fetchUser;
