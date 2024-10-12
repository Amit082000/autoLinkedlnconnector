let totalConnections = 0;
let connectionsSent = 0;

// Function to generate a random delay between 5 to 10 seconds
function getRandomDelay() {
    return 5000 + Math.random() * 5000; // 5000ms (5 sec) + up to 5000ms (additional 0-5 sec)
}

// Function to send connection requests on LinkedIn
function sendConnectionRequests() {
    const allButtons = Array.from(document.querySelectorAll('button'));
    const connectButtons = allButtons.filter(button => button.innerText.trim() === 'Connect');

    totalConnections = connectButtons.length; // Total connections to be sent

    if (totalConnections === 0) {
        console.log('No "Connect" buttons found on this page.');
        return;
    }

    connectButtons.forEach((button, index) => {
        setTimeout(() => {
            // Click the "Connect" button
            button.click();
            
            // Wait for the popup and click "Send without a note" if it appears
            setTimeout(() => {
                const sendWithoutNoteButton = document.querySelector('button[aria-label="Send now"]');
                if (sendWithoutNoteButton) {
                    sendWithoutNoteButton.click(); // Automatically send the request without a note
                }
            }, 1000); // Wait 1 second for the popup to appear
            
            connectionsSent++;
            updateProgressBar(connectionsSent, totalConnections);

            // Check if all requests are sent
            if (connectionsSent === totalConnections) {
                // Send message to popup indicating completion
                chrome.runtime.sendMessage({ action: 'completeRequests', totalConnections: connectionsSent });
            }
        }, getRandomDelay() * index);
    });

    console.log(`Total ${totalConnections} connection requests queued.`);
}

// Update the progress bar and text
function updateProgressBar(connectionsSent, totalConnections) {
    const progressBar = document.getElementById('progress-bar');
    const progressText = document.getElementById('progress-text');

    const percentage = (connectionsSent / totalConnections) * 100;
    progressBar.style.width = percentage + '%';
    progressText.innerText = `Connections sent: ${connectionsSent}`;
}

// Listen for messages from the popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === 'startSendingRequests') {
        sendConnectionRequests();
    }
});
