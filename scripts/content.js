let totalConnections = 0;
let connectionsSent = 0;

// Function to generate a random delay between 5 to 10 seconds
function getRandomDelay() {
    return Math.floor(5000 + Math.random() * 3000); // Return an integer delay in milliseconds
}

// Function to send connection requests on LinkedIn
function sendConnectionRequests() {
    const allButtons = Array.from(document.querySelectorAll('button'));
    const connectButtons = allButtons.filter(button => button.innerText.trim() === 'Connect');

    totalConnections = connectButtons.length; // Total connections to be sent
    console.log(`Total "Connect" buttons found: ${totalConnections}`);

    if (totalConnections === 0) {
        console.log('No "Connect" buttons found on this page.');
        return;
    }

    connectButtons.forEach((button, index) => {
        setTimeout(() => {
            // Click the "Connect" button
            button.click();
            connectionsSent++;

            // Wait for the popup and click "Send without a note" if it appears
            setTimeout(() => {
                const sendWithoutNoteButton = document.querySelector('button[aria-label="Send without a note"]');
                if (sendWithoutNoteButton) {
                    sendWithoutNoteButton.click(); // Automatically send the request without a note
                    console.log(`Sent connection request #${connectionsSent} without a note.`);
                } else {
                    console.warn('Send without a note button not found for connection request.');
                }

                // Send progress update to popup
                updateProgress(connectionsSent, totalConnections);

                // Check if all requests are sent
                if (connectionsSent === totalConnections) {
                    // Send message to popup indicating completion
                    chrome.runtime.sendMessage({ action: 'completeRequests', totalConnections: connectionsSent });
                    console.log(`All ${totalConnections} connection requests have been sent.`);
                }
            }, 1000); // Wait 1 second for the popup to appear
        }, getRandomDelay() * index);
    });

    console.log(`Total ${totalConnections} connection requests queued.`);
}

// Send progress update to the popup
function updateProgress(connectionsSent, totalConnections) {
    // Send message to the popup with current progress
    chrome.runtime.sendMessage({ action: 'updateProgress', connectionsSent, totalConnections });
}

// Listen for messages from the popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === 'startSendingRequests') {
        sendConnectionRequests();
    }
});
