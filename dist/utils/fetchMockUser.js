import users from "../mocks/users.js";
const fectMockUser = (siteId) => {
    const user = users.find(user => user.id === siteId);
    if (user) {
        return user;
    }
    else {
        return null;
    }
};
export default fectMockUser;
