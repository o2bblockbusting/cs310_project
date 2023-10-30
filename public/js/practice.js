/* PRACTICE.JS
 * This file contains the javascript required to run the conjugation practice page.
 * This includes setting up the settings checkboxes, handling inputs, and checking the user's answers.
*/

(function () {
    "use strict";

    let settings = ["stem","negative","polite","volitional","te-form","past","command","potential","causative","passive","unintended","must do"];
    const BASE_URL = "http://localhost:8000/";

    window.addEventListener("load",init);

    //Run setup on page load
    function init() {
        generateSettings();
        getRandomVerb();
    }


    /**
     * Creates the checkboxes for all the different types of settings
     */
    function generateSettings() {
        let settingsContainer = id("settings-container");
        settings.forEach((setting) => {
            let check = gen("input");
            let label = gen("label");
            
            check.type = "checkbox";
            check.id = "checkbox_"+setting;
            label.innerHTML = setting.toUpperCase();
            label.htmlFor = check.id;

            settingsContainer.appendChild(check);
            settingsContainer.appendChild(label);
            settingsContainer.appendChild(gen("br"));
        });
    }

    function getRandomVerb() {
        let url = BASE_URL + "verbs?type=random";

        fetch(url, {method: 'POST'})
            .then(checkStatus)
            .then((response) => response.json())
            .then((resp) => {
                console.log(conjugate(resp[0], 'te-form'));
                return resp;
            }) 
            .catch(handleError);
    }

    function conjugate(verb, form) {
        console.log(verb);
        switch(form) {
            case 'te-form':
                if(verb.is_ru_verb) {
                    return verb.verb_plain.slice(0,-1) + 'て';
                }
                else {
                    const teFormMap = {
                        'す': 'して',
                        'く': 'いて',
                        'ぐ': 'いで',
                        'む': 'んで',
                        'ぶ': 'んで',
                        'ぬ': 'んで',
                        'る': 'って',
                        'う': 'って',
                        'つ': 'って'
                    };
                    return verb.verb_plain.slice(0,-1) + teFormMap[verb.verb_plain.slice(-1)];
                }
            default:
                return "ERROR: conjugation type "+form+" not recognized";
        }
    }

    // MODULE GLOBAL FUNCTIONS
    /**
     * Helper function to return the response's result text if successful, otherwise
     * returns the rejected Promise result with an error status and corresponding text
     * @param {object} response - response to check for success/error
     * @return {object} - valid response if response was successful, otherwise rejected
     *                    Promise result
     */
    function checkStatus(response) {
        if (!response.ok) {
            throw Error("Error in request: " + response.statusText);
        }
        return response; // a Response object
    }

    /**
     *  Handles ajax errors by alerting the user and printing the promise to the console
     * @param (Promise) promise - status of request
     */
    function handleError(promise) {
        if(!promise.ok) {
            qs("main").innerHTML = "Failed to make API request. See console for details." + qs("main").innerHTML;
            console.log(promise);
        }
    }

    /**
     * Alias for document.getElementById()
     * @param {string} id of element
     * @return {HTMLElement | null} DOM element
     */
    function id(idstr) {
        return document.getElementById(idstr);
    }

    /**
     * Alias for document.querySelector()
     * @param {string} css selector
     * @return {HTMLElement | null} DOM element
     */
    function qs(selector) {
        return document.querySelector(selector);
    }

    /**
     * Alias for document.querySelectorAll()
     * @param {string} css selector
     * @return {NodeList} DOM element list
     */
    function qsa(selector) {
        return document.querySelectorAll(selector);
    }

    /**
     * Alias for document.createElement()
     * @param {string} HTML tag name
     * @return {HTMLElement | null} DOM element
     */
    function gen(tagName) {
        return document.createElement(tagName);
    }
})();