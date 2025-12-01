const DIV_HEIGHT = 65;


const logButton = document.getElementById("login-login");
const regButton = document.getElementById("login-new-account");
const confirmPasswordDiv = document.getElementById("confirmPasswordDiv");
const confirmPasswordInput = document.getElementById("input-confirm-password");
const pwInput = document.getElementById("input-password");


const loginToRegister = function () {

    if (!confirmPasswordDiv)
        return ;
    if (regButton?.getAttribute("value") === "NewAccount") {
        setRegisterAttributes();
        verticalSlideIn(confirmPasswordDiv, DIV_HEIGHT);
    }
    else {
        setLoginAttributes();
        verticalSlideOut(confirmPasswordDiv, DIV_HEIGHT);
    }
};


const setRegisterAttributes = () => {
    if (!regButton || !logButton || !confirmPasswordInput || !pwInput)
    {
        console.log ("failed to retrieve Elements");
        return ;      
    }
    regButton.innerText = "To login";
    regButton.setAttribute("value", "ToLogin");
    logButton.innerText = "Register";
    logButton.setAttribute("value", "register");
    logButton.setAttribute("formaction", "/register");
    confirmPasswordInput.removeAttribute("disabled");
    pwInput.setAttribute("autocomplete", "new-password");
}

const setLoginAttributes = () => {
    if (!regButton || !logButton || !confirmPasswordInput || !pwInput)
    {
        console.log ("failed to retrieve Elements");
        return ;      
    }
    regButton.innerText = "New Account";
    regButton.setAttribute("value", "NewAccount");
    logButton.innerText = "Login";
    logButton.setAttribute("value", "login");
    logButton.setAttribute("formaction", "/login");
    confirmPasswordInput.setAttribute("disabled", "");
    pwInput.setAttribute("autocomplete", "current-password");
}

const verticalSlideIn = function (elem: HTMLElement, height: number) {
    let id = setInterval(() => {});
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


const verticalSlideOut = function (elem: HTMLElement, height: number) {
    let id = setInterval(() => {});
    clearInterval(id);
    id = setInterval(frame, 5);
    let store_number = height;

    function frame() {
        if (store_number === 0)
            clearInterval(id);
        else {
            store_number -= 1;
            elem.style.height = store_number.toString() + "px";
        }
    }
};

const showPassword = () => {
    const pwInput = document.getElementById("input-password");
    if (!pwInput)
        return (console.log("failed to retrieve element"));
    if (pwInput.getAttribute("type") === "text")
        pwInput.setAttribute("type", "password");
    else
        pwInput.setAttribute("type", "text");

}

const showConfirmPassword = () => {
    const cpwInput = document.getElementById("input-confirm-password");
    if (!cpwInput)
        return (console.log("failed to retrieve element"));
    if (cpwInput.getAttribute("type") === "text")
        cpwInput.setAttribute("type", "password");
    else
        cpwInput.setAttribute("type", "text");

}