const siteIdExtractor = (url) => {
    const urlArray = url.split('/');
    const siteId = urlArray[urlArray.length - 1];
    return siteId;
};
export default siteIdExtractor;
