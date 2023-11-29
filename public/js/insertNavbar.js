/* INSERTNAVBAR.JS
 * This file contains the html for the header of each page, which it builds and adds to each page.
 * Also contains code for site color mode switching
*/


(function () {
    "use strict";
    
    let header = `<header class="main-heading">
    <nav class="navbar navbar-expand-sm">
        <div class="container-fluid">
            <a class="navbar-brand" href="home.html">Japanese Conjugation Practice</a>
            <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                <span class="navbar-toggler-icon"></span>
            </button>
            <div class="collapse navbar-collapse" id="navbarNav">
                <ul class="nav navbar-nav">
                    <li class="nav-item"><a class="nav-link" href="home.html">Home</a></li>
                    <li class="nav-item"><a class="nav-link" href="practice.html">Practice</a></li>
                    <li class="nav-item"><a class="nav-link" href="statistics.html">Statistics</a></li>
                    <li class="nav-item"><a class="nav-link" href="examples.html">Examples</a></li>
                    <li class="nav-item"><a class="nav-link" href="about.html">About</a></li>
                </ul>
            </div>
            <input type='button' id='color-scheme-selector' value="Light Mode" class="lightmode">
            <input type='checkbox' id='color-scheme-checkbox' class='hidden'>
        </div>
    </nav>
    </header>`
    
    window.addEventListener("load",function() {
        //Add header/navbar to body
        $("body").html(header + $("body").html());

        //Set current page as active
        $("ul.nav a").each( function() {
            if(document.location.href.endsWith(this.href)) {
                this.classList.add("active");
                this.setAttribute("aria-current","page");
            }
        });

        $("#color-scheme-selector").click(switchColorScheme);

        if(window.localStorage.getItem("theme") == "dark") {
            switchColorScheme();
        }
    });

    /**
     * Called when the color scheme switcher button is clicked
     * Switches the color data-theme, which updates the CSS
     */
    function switchColorScheme() {
        let modeCheckbox = document.getElementById("color-scheme-checkbox");
        let modeChangeButton = document.getElementById("color-scheme-selector");

        if (modeChangeButton.classList.contains("lightmode")) {
            //Update CSS theme
            document.documentElement.setAttribute('data-theme', 'dark');
            
            //Change button CSS
            modeChangeButton.classList.remove("lightmode");
            modeChangeButton.classList.add("darkmode");
            modeChangeButton.value = "Dark Mode";
            
            modeCheckbox.checked = true;
            window.localStorage.setItem("theme","dark");
        }
        else {
            //Update CSS theme
            document.documentElement.setAttribute('data-theme', 'light');

            //Change button CSS
            modeChangeButton.classList.remove("darkmode");
            modeChangeButton.classList.add("lightmode");
            modeChangeButton.value = "Light Mode";
            
            modeCheckbox.checked = false;
            window.localStorage.setItem("theme","light");
        }
        //Throw event for statistics page so it can change the graph text color
        modeCheckbox.dispatchEvent(new Event("change"));
    }
    

})();