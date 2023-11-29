/** COLOR-SCHEME-LOADER.JS
 * This file's sole purpose is to load the color scheme before the rest of the page loads, preventing it from flashing while changing colors
 */

(function() {
    if(window.localStorage.getItem("theme") == "dark") {
        document.documentElement.setAttribute('data-theme', 'dark');
    }
})();
