"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const prismaClient_1 = __importDefault(require("../services/prismaClient"));
const checkUser_1 = __importDefault(require("./checkUser"));
const fetchUserRoute_1 = __importDefault(require("./fetchUserRoute"));
const siteIdExtractor_1 = __importDefault(require("./siteIdExtractor"));
const registerUser = async (chatId, profileLink) => {
    const isRegistred = await (0, checkUser_1.default)(chatId);
    if (isRegistred) {
        return "User already registered";
    }
    const siteId = (0, siteIdExtractor_1.default)(profileLink);
    const userData = await (0, fetchUserRoute_1.default)(siteId);
    if (!userData) {
        return "no user with this profile link";
    }
    else {
        await prismaClient_1.default.user.create({
            data: {
                chatId: chatId,
                siteId: userData.id,
                name: userData.name
            }
        });
        return "User registered successfully";
    }
};
exports.default = registerUser;
