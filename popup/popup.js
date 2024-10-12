document.getElementById('start').addEventListener('click', () => {
    // Clear any previous messages and update status
    const statusMessage = document.getElementById('progress-text');
    statusMessage.innerText = ''; // Clear previous messages

    // Update status message to indicate sending requests
    statusMessage.innerText = 'Sending connection requests...';

    // Get the active tab and inject the content script if necessary
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        // Programmatically inject the content script if it hasn't been loaded
        chrome.scripting.executeScript({
            target: { tabId: tabs[0].id },
            files: ['./scripts/content.js']
        }, () => {
            // After injecting the content script, send the message to start sending requests
            chrome.tabs.sendMessage(tabs[0].id, { action: 'startSendingRequests' });
        });
    });
});

// Listen for completion message from content script
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === 'completeRequests') {
        const statusMessage = document.getElementById('progress-text');
        statusMessage.innerText = `All connection requests sent: ${request.totalConnections}`; // Final message
    }
});
