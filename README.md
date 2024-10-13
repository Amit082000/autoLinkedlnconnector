#Auto Linkedln Connect Chrome Extension

This Chrome extension automates sending connection requests on LinkedIn. The extension detects the "Connect" buttons on LinkedIn search result pages and clicks them automatically, allowing users to easily send multiple connection requests. Users can stop the process at any time and restart as needed. The extension also keeps track of how many connection requests have been sent.

## Features

-> Automatically detects and clicks "Connect" buttons on LinkedIn search results.
-> Sends connection requests without a note.
-> Tracks the total number of connections available and connections sent.
-> Allows users to stop and restart the connection process.

## Installation

To install the extension, follow these steps:

- Clone this repository to your local machine by running the below command:

  ```
  git clone https://github.com/Amit082000/autoLinkedlnconnector
  ```

- Unzip the cloned file.
- Open Chrome and navigate to
  ```
  chrome://extensions
  ```
- Click the "Load unpacked" button and select the unzipped folder.

##How It Works

- Navigate to the LinkedIn search page where you would like to send connection requests.
  ```
    https://www.linkedin.com/search/results/people/
  ```
- Click the extension icon in the toolbar to open the popup.
- Click the **Send Request** button to begin sending connection requests.
- The extension will automatically send connection requests to all the users listed on the search page.
- Once the requests have been sent,the popup displays the number of total connections available on the current page and the number of connections that have been successfully sent.

##Important Notes

This extension requires the following permissions:

- tabs: Allows the extension to interact with browser tabs.
- https://_.linkedin.com/_: Allows the extension to access LinkedIn pages.
- scripting: Allows the extension to inject scripts into the LinkedIn page to send connection requests.

