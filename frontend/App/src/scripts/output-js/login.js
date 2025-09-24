"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.verticalSlideOut = exports.verticalSlideIn = void 0;
var DIV_HEIGHT = 65;
var logButton = document.getElementById("login-login");
var regButton = document.getElementById("login-new-account");
var confirmPasswordDiv = document.getElementById("confirmPasswordDiv");
var confirmPasswordInput = document.getElementById("input-confirm-password");
var pwInput = document.getElementById("input-password");
var loginToRegister = function () {
    if (regButton.getAttribute("value") === "NewAccount") {
        setRegisterAttributes();
        (0, exports.verticalSlideIn)(confirmPasswordDiv, DIV_HEIGHT);
    }
    else {
        setLoginAttributes();
        (0, exports.verticalSlideOut)(confirmPasswordDiv, DIV_HEIGHT);
    }
};
var setRegisterAttributes = function () {
    regButton.innerText = "To login";
    regButton.setAttribute("value", "ToLogin");
    logButton.innerText = "Register";
    logButton.setAttribute("value", "register");
    logButton.setAttribute("formaction", "/register");
    confirmPasswordInput.removeAttribute("disabled");
    pwInput.setAttribute("autocomplete", "new-password");
};
var setLoginAttributes = function () {
    regButton.innerText = "New Account";
    regButton.setAttribute("value", "NewAccount");
    logButton.innerText = "Login";
    logButton.setAttribute("value", "login");
    logButton.setAttribute("formaction", "/signIn");
    confirmPasswordInput.setAttribute("disabled", "");
    pwInput.setAttribute("autocomplete", "current-password");
};
var verticalSlideIn = function (elem, height) {
    var id = null;
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
exports.verticalSlideIn = verticalSlideIn;
var verticalSlideOut = function (elem, height) {
    var id = null;
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
exports.verticalSlideOut = verticalSlideOut;
var showPassword = function () {
    var pwInput = document.getElementById("input-password");
    if (pwInput.getAttribute("type") === "text")
        pwInput.setAttribute("type", "password");
    else
        pwInput.setAttribute("type", "text");
};
var showConfirmPassword = function () {
    var cpwInput = document.getElementById("input-confirm-password");
    if (cpwInput.getAttribute("type") === "text")
        cpwInput.setAttribute("type", "password");
    else
        cpwInput.setAttribute("type", "text");
};
