document.addEventListener('DOMContentLoaded', function() {
    // if (localStorage.getItem('debugMode') === 'true') {
        const container = document.getElementById("container");
        const debug = document.createElement("button");
        debug.textContent = "Clear Token";
        debug.style.position = "fixed";
        debug.style.bottom = 0;
        debug.style.right = 0;

        container.appendChild(debug);

        debug.addEventListener('click', function() {
            localStorage.removeItem('TOKEN');
            location.reload();
        });
    // }
});
