var id = null;
var DIV_HEIGHT = 65;
var logButton = document.getElementById("login-login");
var loginToRegister = function () {
    var regButton = document.getElementById("login-new-account");
    var confirmPasswordDiv = document.getElementById("confirmPasswordDiv");
    var confirmPasswordInput = document.getElementById("input-confirm-password");
    if (regButton.getAttribute("value") === "NewAccount") {
        regButton.innerText = "To login";
        regButton.setAttribute("value", "ToLogin");
        logButton.innerText = "Register";
        logButton.setAttribute("value", "register");
        logButton.setAttribute("formaction", "/register");
        confirmPasswordInput.setAttribute("disabled", "false");
        slideIn(confirmPasswordDiv);
    }
    else {
        regButton.innerText = "New Account";
        regButton.setAttribute("value", "NewAccount");
        logButton.innerText = "Login";
        logButton.setAttribute("value", "login");
        logButton.setAttribute("formaction", "/login");
        confirmPasswordInput.setAttribute("disabled", "true");
        slideOut(confirmPasswordDiv);
    }
};
var slideIn = function (elem) {
    clearInterval(id);
    id = setInterval(frame, 5);
    var store_number = 0;
    function frame() {
        if (store_number === DIV_HEIGHT)
            clearInterval(id);
        else {
            store_number += 1;
            elem.style.height = store_number.toString() + "px";
            console.log(store_number);
        }
    }
};
var slideOut = function (elem) {
    clearInterval(id);
    id = setInterval(frame, 5);
    var store_number = DIV_HEIGHT;
    function frame() {
        if (store_number === 0)
            clearInterval(id);
        else {
            store_number -= 1;
            elem.style.height = store_number.toString() + "px";
        }
    }
};
var showPassword = function () {
    var pwInput = document.getElementById("log-password");
    if (pwInput.getAttribute("type") === "text")
        pwInput.setAttribute("type", "password");
    else
        pwInput.setAttribute("type", "text");
};
var showConfirmPassword = function () {
    var cpwInput = document.getElementById("log-confirm-password");
    if (cpwInput.getAttribute("type") === "text")
        cpwInput.setAttribute("type", "password");
    else
        cpwInput.setAttribute("type", "text");
};
