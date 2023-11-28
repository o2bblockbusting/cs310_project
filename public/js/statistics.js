/* STATISTICS.JS
 * This file contains the javascript required to run the statistics page.
 * This includes retrieving statistics from local storage and displaying them in a variety of ways
*/

(function () {
    "use strict";

    window.addEventListener("load",init);

    /**
     * Setup function called when page loads
     */
    function init() {
        let total = getValueFromLocalStorage('total_answered');
        let correct = getValueFromLocalStorage('total_correct');
        id('stat_total_answered').innerText = total;
        id('stat_total_correct').innerText = correct;
        if(total) {
            id('stat_accuracy').innerText = (100 * correct / total).toFixed(2) + '%';
        }
        else {
            //Prevent divide by zero error
            id('stat_accuracy').innerText = 'N/A';
        }
    }

    /**
     * Returns a value from local storage or a zero if that value does not exist
     * @param {string} key storage key value
     */
    function getValueFromLocalStorage(key) {
        let value = parseInt(window.localStorage.getItem(key));
        if(value)
            return value;
        else
            return 0;
    }

    /**
     * Alias for document.getElementById()
     * @param {string} id of element
     * @return {HTMLElement | null} DOM element
     */
    function id(idstr) {
        return document.getElementById(idstr);
    }
})();