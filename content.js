// extracts the text from the page

// send the text to popup.js
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === "getText") {
        try {
            // Try to use Readability first
            if (typeof Readability !== 'undefined') {
                const documentClone = document.cloneNode(true);
                const reader = new Readability(documentClone);
                const article = reader.parse();
                sendResponse({action: "sendText", text: article.textContent});
            } else {
                // Fallback to simple text extraction
                const text = document.body.innerText || document.body.textContent || '';
                sendResponse({action: "sendText", text: text});
            }
        } catch (error) {
            console.error('Error extracting text:', error);
            // Fallback to simple text extraction
            const text = document.body.innerText || document.body.textContent || '';
            sendResponse({action: "sendText", text: text});
        }
    }
    return true;
});
