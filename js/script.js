
/*navbar*/
fetch("/navbar.html")
    .then(res => res.text())
    .then(data => {
        document.getElementById("navbar-container").innerHTML = data;

        LnDModeSetup();
    });

/*header*/
fetch("/header.html")
    .then(res => res.text())
    .then(data => {
        document.getElementById("header-container").innerHTML = data;

    })

/*footer*/
fetch("/footer.html")
    .then(res => res.text())
    .then(data => {
        document.getElementById("footer-container").innerHTML = data;

    })

/*Dark/light button implementation*/
function LnDModeSetup() {
    let darkMode = localStorage.getItem("darkMode")
    const darkLight = document.getElementById("dark-light")

    const enableDarkMode = () => {
        document.body.classList.add("darkMode")
        localStorage.setItem("darkMode", 'active')
    }

    const disableDarkMode = () => {
        document.body.classList.remove("darkMode")
        localStorage.setItem("darkMode", null)
    }

    if (darkMode === "active") {
        enableDarkMode()
    }

    darkLight.addEventListener("click", () => {
        darkMode = localStorage.getItem("darkMode")
        darkMode !== "active" ? enableDarkMode() : disableDarkMode()
    })
}

/*Loading Screen is done*/
window.addEventListener("load", () => {
    const loaded = document.getElementById("loading");
    loaded.classList.add("loaded");
    setTimeout(() => loaded.remove(), 2000);
});
