//document.getElementById("ifr1").style.display = "block";

document.getElementById('showTemp').addEventListener('click', function() {
    //document.getElementById("tempC").style.display = "none";
    document.getElementById("show").src = "http://localhost/IOT/frontend/html/temperature.html";
    document.getElementById("show").style.display = "block";

});

document.getElementById('showPulse').addEventListener('click', function() {
    //document.getElementById("tempC").style.display = "none";
    document.getElementById("show").src = "http://localhost/IOT/frontend/html/pulse.html";
    document.getElementById("show").style.display = "block";

});

document.getElementById('showOxygen').addEventListener('click', function() {
    //document.getElementById("tempC").style.display = "none";
    document.getElementById("show").src = "http://localhost/IOT/frontend/html/oxygen.html";
    document.getElementById("show").style.display = "block";

});