/**
 * @name chozen
 * @author VeroDomencio
 * @description Client Overhaul.
 * @version 0.0.1
 */

module.exports = class YourPlugin {
    start() {
        // Called when the plugin is activated (including after reloads)

        // Add the code for changing the time format
        // this.replaceTimeFormat();

        // Start observing messages for changes
        this.startObserver();
    }

    stop() {
        // Called when the plugin is deactivated
        this.stopObserver();
    }


    parseISO8601ToCustomFormat(isoDate) {
        const date = new Date(isoDate);
      
        // Extract components
        const hours = date.getHours().toString().padStart(2, '0');
        const minutes = date.getMinutes().toString().padStart(2, '0');
        // const seconds = date.getSeconds().toString().padStart(2, '0');
        const day = date.getDate().toString().padStart(2, '0');
        const month = (date.getMonth() + 1).toString().padStart(2, '0'); // Months are 0-based
        const year = date.getFullYear();
      
        // Format the date and time
        const formattedDate = `${day}/${month}/${year} @ ${hours}:${minutes}`;
      
        return formattedDate;
      }

      startObserver() {
        const chat = document.querySelectorAll('time[datetime]');
      
        // Define the callback function for the MutationObserver
        const observeMessages = (mutationsList) => {
          for (const mutation of mutationsList) {
            if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
              // Handle the DOM changes here
              mutation.addedNodes.forEach((addedNode) => {
                if (addedNode instanceof HTMLElement) {
                  const timeElement = addedNode.querySelector('time[datetime]');
                  if (timeElement) {
                    const customFormattedTime = this.parseISO8601ToCustomFormat(timeElement.getAttribute('datetime'));
                    timeElement.textContent = customFormattedTime;
                  }
                }
              });
            }
          }
        };
      
        // Create a MutationObserver instance and observe the changes
        const observer = new MutationObserver(observeMessages);
      
        chat.forEach((elem) => {
          const customFormattedTime = this.parseISO8601ToCustomFormat(elem.getAttribute('datetime'));
          elem.textContent = customFormattedTime;
        });
      
        // Observe changes to the entire document, but you can narrow it down if needed
        observer.observe(document.body, { childList: true, subtree: true });
      
        // Remember to store the observer instance somewhere if you want to disconnect it later
        this.chatObserver = observer;
      }
      

    stopObserver() {
        if (this.chatObserver) {
            this.chatObserver.disconnect();
        }
    }
};
