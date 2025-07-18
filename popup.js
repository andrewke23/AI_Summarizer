
document.getElementById("summarize").addEventListener("click", async() => {
    try {
        const [tab] = await chrome.tabs.query({active: true, currentWindow: true});
        if (!tab) {
            throw new Error("No active tab found");
        }
        // Add this line to check if we're getting tab info
        console.log("Current tab:", tab);
        
        // Send message and wait for response
        const response = await chrome.tabs.sendMessage(tab.id, {action: "getText"});
        // The message listener will handle displaying the text
        const summary = document.getElementById("summary");
        summary.textContent = response.text;
    } catch (error) {
        console.error("Error:", error); // Add this to see the specific error
        const summary = document.getElementById("summary");
        summary.textContent = "Cannot access this page. Please try a different page.";
    }
});

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === "sendText") {
        // summarization logic
        const summary = document.getElementById("summary");
        summary.textContent = request.text;
    }
});