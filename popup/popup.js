
document.getElementById('start').addEventListener('click', () => {
    const statusMessage = document.getElementById('progress-text');
    statusMessage.innerText = ''; 

    // Update status message 
    statusMessage.innerText = 'Sending connection requests...';

    document.getElementById('stop').style.display = 'block';
    document.getElementById('start').style.display = 'none';

    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        chrome.scripting.executeScript({
            target: { tabId: tabs[0].id },
            files: ['./scripts/content.js']
        }, () => {
            chrome.tabs.sendMessage(tabs[0].id, { action: 'startSendingRequests' });
        });
    });
});

// Add event listener for  Stop 
document.getElementById('stop').addEventListener('click', () => {
    const statusMessage = document.getElementById('progress-text');

    document.getElementById('stop').style.display = 'none';
    document.getElementById('start').style.display = 'block';

    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        chrome.tabs.sendMessage(tabs[0].id, { action: 'stopSendingRequests' });
    });
});



// Listen for messages from script
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === 'completeRequests') {
        const statusMessage = document.getElementById('progress-text');
        statusMessage.innerText = `All connection requests sent: ${request.totalConnections}`; 
        document.getElementById('stop').style.display = 'none'; 
        document.getElementById('start').style.display = 'block';
    } else if (request.action === 'updateProgress') {
        const { connectionsSent, totalConnections } = request;
        updateProgressBar(connectionsSent, totalConnections);
    }
});

// Update the progress bar & text
function updateProgressBar(connectionsSent, totalConnections) {
    const progressBar = document.getElementById('progress-bar');
    const progressText = document.getElementById('progress-text');

    if (progressBar && progressText) {
        const percentage = (connectionsSent / totalConnections) * 100;
        progressBar.style.width = percentage + '%';
        progressText.innerText = `Connections sent: ${connectionsSent}`;
    } else {
        console.warn('Progress bar or text element not found in the DOM.');
    }
}

