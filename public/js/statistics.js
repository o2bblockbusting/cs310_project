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
        updateAccuracyNumbers();
        setupGraph();
    }


    /**
     * Pulls data from local storage to populate accuracy numbers at top of page
     */
    function updateAccuracyNumbers() {
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
     * Sets up and displays graph using chart.js
     */
    function setupGraph() {
        let chartElem = id("accuracy-chart");
        let conjugations = ["plain","stem","volitional","te","command","potential","causative","passive","unintended","must do"];
        let timesCorrect = [];
        let timesIncorrect = [];

        conjugations.forEach(conj => {
            timesCorrect.push(getValueFromLocalStorage(conj + "_correct"));
            timesIncorrect.push(getValueFromLocalStorage(conj + "_incorrect"));
        });
        
        Chart.defaults.color = '#e6daca';

        new Chart(chartElem, {
            type: 'bar',
            data: {
              labels: conjugations.map(conj => conj.replace(/\b\w/g, (c) => c.toUpperCase())),
              datasets: [{
                  label: 'Times Correct',
                  data: timesCorrect,
                  borderWidth: 1,
                  stack: 0,
                  borderColor: '#000000',
                  backgroundColor: '#acb18f'   // Reilly 1d1f77/other option:acb18f
                },//eec886
                {
                  label: 'Times Incorrect',
                  data: timesIncorrect,
                  borderWidth: 1,
                  stack: 0,
                  borderColor: '#000000',
                  backgroundColor: '#fd9e6f'  //Reilly 8e1308/other option:fd9e6f
                }]//98a191
            },
            options: {
              animation: false,
              responsive: true,
              scales: {
                y: {
                  beginAtZero: true,
                  stacked: true
                }
              }
            }
          });
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