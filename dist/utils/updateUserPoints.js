"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const prismaClient_1 = __importDefault(require("../services/prismaClient"));
const UpdateUserPoints = async (chatId, points) => {
    const user = await prismaClient_1.default.user.findFirst({
        where: {
            chatId: chatId
        },
        select: {
            points: true
        }
    });
    if (user) {
        await prismaClient_1.default.user.update({
            where: {
                chatId: chatId
            },
            data: {
                points: user.points + points
            }
        });
        return "User points updated successfully";
    }
    return "User not found";
};
