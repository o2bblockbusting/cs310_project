/* STATISTICS.JS
 * This file contains the javascript required to run the statistics page.
 * This includes retrieving statistics from local storage and displaying them in a variety of ways
*/

(function () {
    "use strict";

    window.addEventListener("load",init);
    let conjChart = null;
    let chartTextColor = '#e6daca';

    /**
     * Setup function called when page loads
     */
    function init() {
        id("color-scheme-checkbox").addEventListener("change",e => { switchColorScheme(e); });
        chartTextColor = (id("color-scheme-checkbox").checked) ? '#e6daca' : '#4d0606';

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

        //Get chart data from local storage
        conjugations.forEach(conj => {
            timesCorrect.push(getValueFromLocalStorage(conj + "_correct"));
            timesIncorrect.push(getValueFromLocalStorage(conj + "_incorrect"));
        });
    
        //Create the chart with all the correct options
        conjChart = new Chart(chartElem, {
            type: 'bar',
            data: {
                labels: conjugations.map(conj => conj.replace(/\b\w/g, (c) => c.toUpperCase())),
                datasets: [{
                    label: 'Times Correct',
                    data: timesCorrect,
                    borderWidth: 1,
                    stack: 0,
                    borderColor: '#000000',
                    backgroundColor: '#acb18f'   // option1: 1d1f77 // option2:acb18f // option3:eec886
                },
                {
                    label: 'Times Incorrect',
                    data: timesIncorrect,
                    borderWidth: 1,
                    stack: 0,
                    borderColor: '#000000',
                    backgroundColor: '#fd9e6f'  // option1: 8e1308 // option2:fd9e6f // option3:98a191
                }]
            },
            options: {
                animation: false,
                responsive: true,
                plugins: {
                    legend: {
                        labels: {
                            color: chartTextColor
                        }
                    }
                },
                scales: {
                    y: {
                        ticks: {
                            color: chartTextColor
                        },
                        beginAtZero: true,
                        stacked: true
                    },
                    x: {
                        ticks: {
                            color: chartTextColor
                        }
                    }
                }
            }
        });
        
    }

    /**
     * Called when the color scheme checkbox's value changes
     * Updates the colors of the chart so they match the color scheme
     */
    function switchColorScheme(e) { 
        if (e.target.checked) {
            chartTextColor = '#e6daca';
        }
        else {
            chartTextColor = '#4d0606';
        }
        conjChart.options.plugins.legend.labels.color = chartTextColor;
        conjChart.options.scales.x.ticks.color = chartTextColor;
        conjChart.options.scales.y.ticks.color = chartTextColor;
        conjChart.update();
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