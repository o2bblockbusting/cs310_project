/* PRACTICE.JS
 * This file contains the javascript required to run the conjugation practice page.
 * This includes setting up the settings checkboxes, handling inputs, and checking the user's answers.
*/

(function () {
    "use strict";

    let settings = ["polite","past","stem","te-form","command","causative","passive","accidental","must do","potential","include irregulars"];


    window.addEventListener("load",init);

    //Run setup on page load
    function init() {
        generateSettings();
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

    // MODULE GLOBAL FUNCTIONS
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