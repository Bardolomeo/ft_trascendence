var DIV_HEIGHT = 65;
var logButton = document.getElementById("login-login");
var regButton = document.getElementById("login-new-account");
var confirmPasswordDiv = document.getElementById("confirmPasswordDiv");
var confirmPasswordInput = document.getElementById("input-confirm-password");
var pwInput = document.getElementById("input-password");
var loginToRegister = function () {
    var confirmPasswordDiv = document.getElementById("confirmPasswordDiv");
    if ((regButton === null || regButton === void 0 ? void 0 : regButton.getAttribute("value")) === "NewAccount") {
        setRegisterAttributes();
        verticalSlideIn(confirmPasswordDiv, DIV_HEIGHT);
    }
    else {
        setLoginAttributes();
        verticalSlideOut(confirmPasswordDiv, DIV_HEIGHT);
    }
};
var setRegisterAttributes = function () {
    //Check if getElement(s) went bad
    if (!checkElements([regButton, logButton, confirmPasswordInput, pwInput]))
        return;
    regButton.innerText = "To login";
    regButton.setAttribute("value", "ToLogin");
    logButton.innerText = "Register";
    logButton.setAttribute("value", "register");
    logButton.setAttribute("formaction", "/register");
    confirmPasswordInput.removeAttribute("disabled");
    pwInput.setAttribute("autocomplete", "new-password");
};
var setLoginAttributes = function () {
    if (!checkElements([regButton, logButton, confirmPasswordInput, pwInput]))
        return;
    regButton.innerText = "New Account";
    regButton.setAttribute("value", "NewAccount");
    logButton.innerText = "Login";
    logButton.setAttribute("value", "login");
    logButton.setAttribute("formaction", "/login");
    confirmPasswordInput.setAttribute("disabled", "");
    pwInput.setAttribute("autocomplete", "current-password");
};
var verticalSlideIn = function (elem, height) {
    var id = setInterval(function () { });
    clearInterval(id);
    id = setInterval(frame, 5);
    var store_number = 0;
    function frame() {
        if (store_number === height)
            clearInterval(id);
        else {
            store_number += 1;
            elem.style.height = store_number.toString() + "px";
        }
    }
};
var verticalSlideOut = function (elem, height) {
    var id = setInterval(function () { });
    clearInterval(id);
    id = setInterval(frame, 5);
    var store_number = height;
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
    var pwInput = document.getElementById("input-password");
    if (!checkElements([pwInput]))
        return;
    if (pwInput.getAttribute("type") === "text")
        pwInput.setAttribute("type", "password");
    else
        pwInput.setAttribute("type", "text");
};
var showConfirmPassword = function () {
    var cpwInput = document.getElementById("input-confirm-password");
    if (!checkElements([pwInput]))
        return;
    if (cpwInput.getAttribute("type") === "text")
        cpwInput.setAttribute("type", "password");
    else
        cpwInput.setAttribute("type", "text");
};
// Pass elements to check if they were getted;
function checkElements(neededElements) {
    neededElements.forEach(function (el, idx) {
        if (!el) {
            console.error("failed to retrieve Element: ".concat(idx));
            return false;
        }
    });
    return true;
}
