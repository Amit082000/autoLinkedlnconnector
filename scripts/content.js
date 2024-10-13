let totalConnections = 0;
let connectionsSent = 0;
let timeoutIds = []; 

function getRandomDelay() {
    return Math.floor(5000 + Math.random() * 3000);
}

// send connection requests on LinkedIn
function sendConnectionRequests() {
    const allButtons = Array.from(document.querySelectorAll('button'));
    const connectButtons = allButtons.filter(button => button.innerText.trim() === 'Connect');

    totalConnections = connectButtons.length; 
    console.log(`Total "Connect" buttons found: ${totalConnections}`);

    if (totalConnections === 0) {
        console.log('No "Connect" buttons found on this page.');
        return;
    }

    connectionsSent = 0; 
    timeoutIds = [];

    connectButtons.forEach((button, index) => {
        const timeoutId = setTimeout(() => {
            button.click();
            connectionsSent++;

            // automate add without note popup 
            setTimeout(() => {
                const sendWithoutNoteButton = document.querySelector('button[aria-label="Send without a note"]');
                if (sendWithoutNoteButton) {
                    sendWithoutNoteButton.click(); 
                    console.log(`Sent connection request #${connectionsSent} without a note.`);
                } else {
                    console.warn('Send without a note button not found for connection request.');
                }
                updateProgress(connectionsSent, totalConnections);

                if (connectionsSent === totalConnections) {
                    chrome.runtime.sendMessage({ action: 'completeRequests', totalConnections: connectionsSent });
                    console.log(`All ${totalConnections} connection requests have been sent.`);
                }
            }, 1000); 
        }, getRandomDelay() * index);

        timeoutIds.push(timeoutId);
    });

    console.log(`Total ${totalConnections} connection requests queued.`);
}

//stop sending requests
function stopSendingRequests() {
   
    timeoutIds.forEach(timeoutId => clearTimeout(timeoutId));
    console.log('Stopped all scheduled connection requests.');
    timeoutIds = [];
    totalConnections = 0;
}

function updateProgress(connectionsSent, totalConnections) {
    chrome.runtime.sendMessage({ action: 'updateProgress', connectionsSent, totalConnections });
}

// Listen for messages from  popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === 'startSendingRequests') {
        sendConnectionRequests();
    } else if (request.action === 'stopSendingRequests') {
        stopSendingRequests(); 
        console.log('Stopped sending requests.');
    }
});
