/* INSERTNAVBAR.JS
 * This file contains the html for the header of each page, which it builds and adds to each page.
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
        </div>
    </nav>
    </header>`


    $(document).ready(function() {
        //Add header/navbar to body
        $("body").html(header + $("body").html());

        //Set current page as active
        $("ul.nav a").each( function() {
            if(document.location.href.endsWith(this.href)) {
                this.classList.add("active");
                this.setAttribute("aria-current","page");
            }
        });
    });

})();