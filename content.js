// extracts the text from the page


// send the text to popup.js
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === "getText") {
        const documentClone = document.cloneNode(true);
        const reader = new Readability(documentClone);
        const article = reader.parse();
        sendResponse({action: "sendText", text: article.textContent});
    }
    return true;
});
