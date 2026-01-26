const DIV_HEIGHT = 65;


let logButton = document.getElementById("login-login");
let regButton = document.getElementById("login-new-account");
let confirmPasswordDiv = document.getElementById("confirmPasswordDiv");
let confirmPasswordInput = document.getElementById("input-confirm-password");
let pwInput = document.getElementById("input-password");


const loginToRegister = function () {

		const confirmPasswordDiv = document.getElementById("confirmPasswordDiv");

    if (regButton?.getAttribute("value") === "NewAccount") {
        setRegisterAttributes();
        verticalSlideIn(confirmPasswordDiv!, DIV_HEIGHT);
    }
    else {
        setLoginAttributes();
        verticalSlideOut(confirmPasswordDiv!, DIV_HEIGHT);
    }
};



const setRegisterAttributes = () => {
		
		//Check if getElement(s) went bad
		if (!checkElements([regButton, logButton, confirmPasswordInput, pwInput])) return;

    regButton!.innerText = "To login";
    regButton!.setAttribute("value", "ToLogin");
    logButton!.innerText = "Register";
    logButton!.setAttribute("value", "register");
    logButton!.setAttribute("formaction", "/register");
    confirmPasswordInput!.removeAttribute("disabled");
    pwInput!.setAttribute("autocomplete", "new-password");
}

const setLoginAttributes = () => {

		if (!checkElements([regButton, logButton, confirmPasswordInput, pwInput])) return;

    regButton!.innerText = "New Account";
    regButton!.setAttribute("value", "NewAccount");
    logButton!.innerText = "Login";
    logButton!.setAttribute("value", "login");
    logButton!.setAttribute("formaction", "/login");
    confirmPasswordInput!.setAttribute("disabled", "");
    pwInput!.setAttribute("autocomplete", "current-password");
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
    if (!checkElements([pwInput])) return;

    if (pwInput!.getAttribute("type") === "text")
        pwInput!.setAttribute("type", "password");
    else
        pwInput!.setAttribute("type", "text");

}

const showConfirmPassword = () => {
    const cpwInput = document.getElementById("input-confirm-password");
    if (!checkElements([pwInput])) return;
    if (cpwInput!.getAttribute("type") === "text")
        cpwInput!.setAttribute("type", "password");
    else
        cpwInput!.setAttribute("type", "text");

}

// Pass elements to check if they were getted;
function checkElements(neededElements: (HTMLElement | null)[]) {
		neededElements.forEach((el, idx) => {
				if (!el) {
        	console.error (`failed to retrieve Element: ${idx}`);
					return false;
				}
		})
		return true
}
