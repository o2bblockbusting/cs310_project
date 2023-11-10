/* PRACTICE.JS
 * This file contains the javascript required to run the conjugation practice page.
 * This includes setting up the settings checkboxes, handling inputs, and checking the user's answers.
*/

(function () {
    "use strict";

    let settings = ["plain","stem","negative","polite","volitional","te","past","command","potential","causative","passive","unintended","must do"];
    const BASE_URL = "http://localhost:8080/";
    let answer;
    let answerChecked = false;


    const charConversions = {
        "a":{"る":"ら","む":"ま","ぶ":"ば","ぬ":"な","つ":"た","す":"さ","ず":"ざ","く":"か","ぐ":"が","う":"わ"},
        "i":{"る":"り","む":"み","ぶ":"び","ぬ":"に","つ":"ち","す":"し","ず":"じ","く":"き","ぐ":"ぎ","う":"い"},
        "o":{"る":"ろ","む":"も","ぶ":"ぼ","ぬ":"の","つ":"と","す":"そ","ず":"ぞ","く":"こ","ぐ":"ご","う":"お"},
        "e":{"る":"れ","む":"め","ぶ":"べ","ぬ":"ね","つ":"て","す":"せ","ず":"ぜ","く":"け","ぐ":"げ","う":"え"}
    };
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

    window.addEventListener("load",init);

    //Run setup on page load
    function init() {
        generateSettings();
        getRandomVerb();
        id("submitConjugation").addEventListener("click",submitButtonHandler);
    }


    function submitButtonHandler() {
        if(answerChecked) {
            id("answer-result").classList.add("hidden");
            id("submitConjugation").innerText = "Submit";
            id("user-conjugation").value = "";
            getRandomVerb();
        }
        else {
            checkAnswer();
        }
        answerChecked = !answerChecked;
    }

    /**
     * Called whenever the state of any checkbox is changed
     * Ensures that at least one conjugation type is selected at all times
     */
    function checkboxEventHandler() {
        if(this.checked) {
            return;
        } else {
            //TODO
        }
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
            check.addEventListener("change",checkboxEventHandler);
            label.innerHTML = setting.toUpperCase();
            label.htmlFor = check.id;

            if(setting == "plain") {
                check.checked = true;
            }

            settingsContainer.appendChild(check);
            settingsContainer.appendChild(label);
            settingsContainer.appendChild(gen("br"));
        });
    }

    /**
     * Looks at what settings checkboxes are selected and chooses a random conjugation
     * @returns {string} conjugation type
     */
    function getRandomConjugation() {
        let activeConjugations = [];
        
        for(let i=0; i<settings.length; i++) {
            if(id("checkbox_"+settings[i]).checked) {
                activeConjugations.push(settings[i]);
            }
        }

        if(activeConjugations.length == 0) {
            return "plain";
        }
        else {
            return activeConjugations[Math.floor(Math.random() * activeConjugations.length)];
        }
    }

    /**
     * Performs an AJAX request to get a random verb from the database
     */
    function getRandomVerb() {
        let url = BASE_URL + "verbs?type=random";

        fetch(url, {method: 'POST'})
            .then(checkStatus)
            .then((response) => response.json())
            .then(setupPracticeProblem) 
            .catch(handleError);
    }

    /**
     * Takes a Japanese verb and fills in the practice page with it
     * Chooses a random conjugation and displays it
     * Prepares the conjugated answer
     * @param {object} verb - Japanese verb + metadata
     */
    function setupPracticeProblem(verb) {
        let jishoLink = "<a target='_blank' href='https://jisho.org/search/" + verb.form + "' title='Click to see this verb on jisho'>";
        
        id("jp-word-para").innerHTML = jishoLink + verbToHTML(verb) + "</a>";
        id("jp-word-meaning").innerText = verb.meaning;
        
        let conjugation = getRandomConjugation();
        id("jp-conjugation-type").innerText = "TO " + conjugation.toUpperCase() + " FORM";
        conjugate(verb, conjugation, false, false, false);
    }

    function checkAnswer() {
        let userAnswer = id('user-conjugation').value;
        let correctStr = "incorrect";

        if(userAnswer == answer.form || userAnswer == (answer.kanji_reading + answer.okurigana)) {
            correctStr = 'correct';
        }
        id("answer-result").innerHTML = "<span class='"+correctStr+"'>"+correctStr.toUpperCase()+"</span><BR/>The correct answer is " + verbToHTML(answer);
        id("answer-result").classList.remove("hidden");

        id("submitConjugation").innerText = "Next";
        id("submitConjugation")
    }

    /**
     * Conjugates a Japanese verb by first checking the database to see if this case is an irregular
     * It then calls the finishConjugation() function to finish the job
     * 
     * @param {object} verb - Japanese verb plus metadata
     * @param {string} form - grammar form to conjugate to
     * @param {boolean} useNegative - should it be conjugated to negative form
     * @param {boolean} usePolite - should it be conjugated to polite form
     * @param {boolean} usePast - should it be conjugated to past tense
     */
    function conjugate(verb, form, useNegative, usePolite, usePast) {
        console.log(verb);

        let url = BASE_URL + "irregulars?verb_id=" + verb.verb_id;
        fetch(url, {method: 'POST'})
            .then(checkStatus)
            .then((response) => response.json())
            .then((resp) => {
                answer = finishConjugation(verb, form, resp, useNegative, usePolite, usePast);
                console.log(answer);
                return resp;
            })
            .catch(handleError);
    }
    

    /**
     * This function is called by the conjugate() function and will return the irregular form if present
     * If there is no irregular form, it will add and subtract characters to conjugate to the proper form
     * 
     * @param {object} verb - Japanese verb plus metadata
     * @param {string} gramForm - grammar form to conjugate to
     * @param {object} irregularForms - array with data on an irregular conjugations if applicable
     * @param {boolean} useNegative - should it be conjugated to negative form
     * @param {boolean} usePolite - should it be conjugated to polite form
     * @param {boolean} usePast - should it be conjugated to past tense
     * @returns {object} - conjugated Japanese verb plus metadata
     */
    function finishConjugation(verb, gramForm, irregularForms, useNegative, usePolite, usePast) {
        verb.conjugation_name = gramForm;

        if(irregularForms[gramForm] && irregularForms[gramForm].verb_id && !usePolite) { 
            return irregularForms[gramForm];
        }

        switch(gramForm) {
            case 'plain':
                return toPlainVariant(verb, irregularForms, useNegative, usePolite, usePast);

            case 'te':
                return toTeForm(verb, irregularForms, useNegative);

            case 'stem':
                return toStemForm(verb);

            case 'volitional':
                return toVolitionalForm(verb, irregularForms, usePolite);
                //break;
            /////////////////////////// COMMAND ///////////////////////////  POSTPONED

            case 'potential':
                return toPotentialForm(verb);

            case 'causative':
                return toCausativeForm(verb);

            case 'passive':
                return toPassiveForm(verb);
            /////////////////////////// UNINTENDED ///////////////////////////

            /////////////////////////// MUST DO /////////////////////////// POSTPONED
            default:
                console.log("ERROR: conjugation type "+gramForm+" not recognized");
                return {error:"ERROR: conjugation type "+gramForm+" not recognized"};
        }
        return verb;
    }

    /**
     * Conjugates a verb from plain form to stem form
     * @param {object} verb 
     * @returns {object} - conjugated verb
     */
    function toStemForm(verb) {
        if(verb.is_ru_verb) {
            verb.form = verb.form.slice(0,-1);
            verb.okurigana = verb.okurigana.slice(0,-1);
        }
        else {
            let lastChar =  charConversions.i[verb.form.slice(-1)];
            verb.form = verb.form.slice(0,-1) + lastChar;
            verb.okurigana = verb.okurigana.slice(0,-1) + lastChar;
        }
        return verb;
    }

    /**
     * Conjugates a verb from plain form to a variant that is a mix of polite, past, and negative
     * @param {object} verb - Japanese verb plus metadata
     * @param {object} irregularForms - array with data on an irregular conjugations if applicable
     * @param {boolean} useNegative - should it be conjugated to negative form
     * @param {boolean} usePolite - should it be conjugated to polite form
     * @param {boolean} usePast - should it be conjugated to past tense
     * @returns {object} - conjugated Japanese verb plus metadata
     */
    function toPlainVariant(verb, irregularForms, useNegative, usePolite, usePast) {
        if(verb.is_ru_verb === null) {
            return {error:"ERROR: cannot conjugate '"+verb.form+"' to "+gramForm+" from an already conjugated verb"};
        }

        if(usePolite) {
            verb = finishConjugation(verb, 'stem', irregularForms, false, false, false);
            let ending = '';

            if(useNegative) {
                if(usePast)
                    ending = 'ませんでした';
                else
                    ending = 'ません';
            }
            else {
                if(usePast)
                    ending = 'ました';
                else
                    ending = 'ます';
            }

            verb.form += ending;
            verb.okurigana += ending;
        }
        else {
            if(useNegative) {
                // Check for irregular first. Negative irr. applies to both present and past tense but not polite
                if(irregularForms.negative) {
                    if(usePast) {
                        irregularForms.negative.form = irregularForms.negative.form.slice(0,-1) + 'かった';
                        irregularForms.negative.okurigana = irregularForms.negative.okurigana.slice(0,-1) + 'かった';
                    }
                    return irregularForms.negative;
                }

                // Slice off last character of RU verbs
                if(verb.is_ru_verb) {
                    verb.form = verb.form.slice(0,-1);
                    verb.okurigana = verb.okurigana.slice(0,-1);
                }
                // Or switch last character to A sound equivalent for U verbs
                else {
                    let lastChar =  charConversions.a[verb.form.slice(-1)];
                    verb.form = verb.form.slice(0,-1) + lastChar;
                    verb.okurigana = verb.okurigana.slice(0,-1) + lastChar;
                }

                let ending = '';
                if(usePast)
                    ending = 'なかった';
                else
                    ending = 'ない';

                verb.form += ending;
                verb.okurigana += ending;
            }
            else {
                if(usePast) {
                    verb = finishConjugation(verb, 'te', irregularForms, false, false, false);
                    let lastCharOfTeForm = verb.form.slice(-1);
                    let ending = {'て':'た','で':'だ'}[lastCharOfTeForm];

                    verb.form = verb.form.slice(0,-1) + ending;
                    verb.okurigana = verb.okurigana.slice(0,-1) + ending;
                } else {
                    return verb;
                }
            }
        }

        verb.is_ru_verb = null;
        return verb;
    }

    /**
     * Conjugates a verb from plain form to volitional form
     * This method needs the irregulars list because sometimes it has to conjugate to stem form first
     * @param {object} verb - Japanese verb plus metadata
     * @param {object} irregularForms - array with data on an irregular conjugations if applicable
     * @param {boolean} useNegative - should it be conjugated to negative form
     * @returns {object} - conjugated verb
     */
    function toTeForm(verb, irregularForms, useNegative) {
        // Negative
        if(useNegative) {
            verb = finishConjugation(verb, 'plain', irregularForms, true, false, false);
            verb.form = verb.form.slice(0,-1) + 'くて';
            verb.okurigana = verb.okurigana.slice(0,-1) + 'くて';
            return verb;
        }

        // Positive
        if(verb.is_ru_verb === null) {
            return {error:"ERROR: cannot conjugate '"+verb.form+"' to "+gramForm+" from an already conjugated verb"};
        }

        let lastChar;
        if(verb.is_ru_verb) {
            lastChar = 'て';
        }
        else {
            lastChar =  teFormMap[verb.form.slice(-1)];
        }
        verb.form = verb.form.slice(0,-1) + lastChar;
        verb.okurigana = verb.okurigana.slice(0,-1) + lastChar;

        verb.is_ru_verb = null;
        return verb;
    }

    /**
     * Conjugates a verb from plain form to volitional form
     * This method needs the irregulars list because sometimes it has to conjugate to stem form first
     * @param {object} verb - Japanese verb plus metadata
     * @param {object} irregularForms - array with data on an irregular conjugations if applicable
     * @param {boolean} usePolite - should it be conjugated to polite form
     * @returns {object} - conjugated verb
     */
    function toVolitionalForm(verb, irregularForms, usePolite) {
        if(verb.is_ru_verb === null) {
            return {error:"ERROR: cannot conjugate '"+verb.form+"' to "+gramForm+" from an already conjugated verb"};
        }

        if(usePolite) {
            verb = finishConjugation(verb, 'stem', irregularForms, false, false, false);
            verb.form += 'ましょう';
            verb.okurigana += 'ましょう';
        }
        else {
            if(verb.is_ru_verb) {
                verb.form = verb.form.slice(0,-1) + 'よう';
                verb.okurigana = verb.okurigana.slice(0,-1) + 'よう';
            }
            else {
                let ending =  charConversions.o[verb.form.slice(-1)] + 'う';
                verb.form = verb.form.slice(0,-1) + ending;
                verb.okurigana = verb.okurigana.slice(0,-1) + ending;
            }
        }
        verb.is_ru_verb = null;
        return verb;
    }

    /**
     * Conjugates a verb from plain form to potential form
     * @param {object} verb - Japanese verb plus metadata
     * @returns {object} - conjugated verb
     */
    function toPotentialForm(verb) {
        if(verb.is_ru_verb === null) {
            return {error:"ERROR: cannot conjugate '"+verb.form+"' to "+gramForm+" from an already conjugated verb"};
        }

        if(verb.is_ru_verb) {
            verb.form = verb.form.slice(0,-1) + 'られる';
            verb.okurigana = verb.okurigana.slice(0,-1) + 'られる';
        }
        else {
            let ending =  charConversions.e[verb.form.slice(-1)] + 'る';
            verb.form = verb.form.slice(0,-1) + ending;
            verb.okurigana = verb.okurigana.slice(0,-1) + ending;
        }

        verb.is_ru_verb = true;
        return verb;
    }

    /**
     * Conjugates a verb from plain form to causative form
     * @param {object} verb - Japanese verb plus metadata
     * @returns {object} - conjugated verb
     */
    function toCausativeForm(verb) {
        if(verb.is_ru_verb === null) {
            return {error:"ERROR: cannot conjugate '"+verb.form+"' to "+gramForm+" from an already conjugated verb"};
        }

        if(verb.is_ru_verb) {
            verb.form = verb.form.slice(0,-1) + 'させる';
            verb.okurigana = verb.okurigana.slice(0,-1) + 'させる';
        }
        else {
            let ending =  charConversions.a[verb.form.slice(-1)] + 'せる';
            verb.form = verb.form.slice(0,-1) + ending;
            verb.okurigana = verb.okurigana.slice(0,-1) + ending;
        }

        verb.is_ru_verb = true;
        return verb;
    }

    /**
     * Conjugates a verb from plain form to passive form
     * @param {object} verb - Japanese verb plus metadata
     * @returns {object} - conjugated verb
     */
    function toPassiveForm(verb) {
        if(verb.is_ru_verb === null) {
            return {error:"ERROR: cannot conjugate '"+verb.form+"' to "+gramForm+" from an already conjugated verb"};
        }

        if(verb.is_ru_verb) {
            verb.form = verb.form.slice(0,-1) + 'られる';
            verb.okurigana = verb.okurigana.slice(0,-1) + 'られる';
        }
        else {
            let ending =  charConversions.a[verb.form.slice(-1)] + 'れる';
            verb.form = verb.form.slice(0,-1) + ending;
            verb.okurigana = verb.okurigana.slice(0,-1) + ending;
        }

        verb.is_ru_verb = true;
        return verb;
    }

    /**
     * Takes a verb and annotates its reading using the ruby tag if it contains kanji
     * @param {object} verb
     * @returns {string} html string containing ruby annotations
     */
    function verbToHTML(verb) {
        if(verb.kanji_reading && verb.kanji_reading.length > 0) {
            let kanjiOnly = verb.form.slice(0,-verb.okurigana.length);
            return "<ruby>" + kanjiOnly + "<rt>" + verb.kanji_reading + "</rt></ruby>" + verb.okurigana;
        }
        else {
            return verb.form;
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
     *  Handles ajax errors by alerting the user
     * @param error - promise error object
     */
    function handleError(error) {
        let errorMsg = gen("p");
        errorMsg.innerText = "Failed to make API request. Check your internet connection.";
        errorMsg.classList.add("error_msg");
        qs("main").prepend(errorMsg);
        
        setTimeout(() => {
            qsa(".error_msg").forEach(msg => msg.remove());
        },3000);

        console.log(error.message);
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