"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const env_1 = require("../env");
const fetchUser = async (userId) => {
    try {
        const response = await fetch(env_1.USER_ROUTE + userId);
        return await response.json();
    }
    catch (error) {
        console.error(error);
        return null;
    }
};
exports.default = fetchUser;
