"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const siteIdExtractor = (url) => {
    const urlArray = url.split('/');
    const siteId = urlArray[urlArray.length - 1];
    return siteId;
};
exports.default = siteIdExtractor;
