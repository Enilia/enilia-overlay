
angular.module('enilia_overlay', []);



document.addEventListener('DOMContentLoaded', function() {

    var dataElem = document.querySelector('#data')
      , stateElem = document.querySelector('#state')
      , locationElem = document.querySelector('#location')
      ;

    document.addEventListener('onOverlayDataUpdate', dataUpdate);
    document.addEventListener("onOverlayStateUpdate", stateUpdate);

    function stateUpdate(e) {
        var details = Date.now() + ": " + JSON.stringify(e.detail);

        stateElem.textContent = details;

        if (!e.detail.isLocked) {
            document.documentElement.classList.add("resizable");
        } else {
            document.documentElement.classList.remove("resizable");
        }
    }

    function dataUpdate(e) {
        var details = JSON.stringify(e.detail);

        dataElem.textContent = Date.now();
    }

});