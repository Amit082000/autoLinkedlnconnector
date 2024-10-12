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

// Listen for messages from the content script
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === 'completeRequests') {
        const statusMessage = document.getElementById('progress-text');
        statusMessage.innerText = `All connection requests sent: ${request.totalConnections}`; // Final message
    } else if (request.action === 'updateProgress') {
        // Update the progress bar based on received data
        const { connectionsSent, totalConnections } = request;
        updateProgressBar(connectionsSent, totalConnections);
    }
});

// Update the progress bar and text
function updateProgressBar(connectionsSent, totalConnections) {
    const progressBar = document.getElementById('progress-bar');
    const progressText = document.getElementById('progress-text');

    // Check if the progressBar and progressText exist
    if (progressBar && progressText) {
        const percentage = (connectionsSent / totalConnections) * 100;
        progressBar.style.width = percentage + '%';
        progressText.innerText = `Connections sent: ${connectionsSent}`;
    } else {
        console.warn('Progress bar or text element not found in the DOM.');
    }
}
