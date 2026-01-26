var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
let parsedComponents = [];
const checkDuplicateComponentsFiles = (dir, id) => {
    const firstInstance = dir.filter((path) => (path.search(id + ".html") > 0));
    if (firstInstance.length > 1) {
        console.error("Error: duplicate component file: " + id);
        return true;
    }
    return false;
};
function nodeScriptClone(node) {
    let script = document.createElement("script");
    script.text = node.innerHTML;
    let i = -1, attrs = node.attributes, attr;
    while (++i < attrs.length) {
        script.setAttribute((attr = attrs[i]).name, attr.value);
    }
    return script;
}
function nodeScriptIs(node) {
    return node.tagName === 'SCRIPT';
}
export const getComponentsWithId = (allPageElements) => __awaiter(void 0, void 0, void 0, function* () {
    let componentsInPage = [];
    for (let i = 0; i < allPageElements.length; i++) {
        let currentElement = allPageElements.item(i);
        if (currentElement && currentElement.id) {
            //check if frist id character is Uppercase
            if (currentElement.id[0] >= "A" && currentElement.id[0] <= "Z")
                componentsInPage.push(currentElement);
        }
    }
    return componentsInPage;
});
const getComponentsInPage = () => __awaiter(void 0, void 0, void 0, function* () {
    const allPageElements = document.getElementsByTagName("*");
    if (!allPageElements)
        throw new Error("Failed to fetch elements");
    return allPageElements;
});
const getComponentsDirectoryListing = () => __awaiter(void 0, void 0, void 0, function* () {
    const data = yield fetch("/components");
    return JSON.parse(yield data.text());
});
const appendChildren = (idComp, dir) => __awaiter(void 0, void 0, void 0, function* () {
    //LOOP fetch components files and append to them to their parents
    idComp.forEach((parentComp) => __awaiter(void 0, void 0, void 0, function* () {
        const id = parentComp.id;
        //all components paths from directoryListing (relative)
        const relativePath = dir.find((el) => (el.search(id) > 0));
        //check for duplicate component files
        checkDuplicateComponentsFiles(dir, id);
        //Does component file exist
        if (relativePath === undefined) {
            console.error("Error: Component not found:" + id);
            return;
        }
        const data = yield fetch("/components/" + relativePath);
        const childComponent = yield (data).text();
        //check if element was already analized/parsed
        if (parsedComponents.find((el) => parentComp === el))
            return;
        //little delay to synchronyze stuff
        setTimeout(() => { }, 0);
        //insert child after last element
        parentComp.insertAdjacentHTML('beforeend', childComponent);
        parsedComponents.push(parentComp);
    }));
});
function composePage() {
    return __awaiter(this, void 0, void 0, function* () {
        var _a;
        let idComp;
        let cyc = 0;
        //Reiterate until there are 0 id fields in Uppercase
        do {
            const allPageElements = yield getComponentsInPage();
            idComp = yield getComponentsWithId(allPageElements);
            const dir = yield getComponentsDirectoryListing();
            appendChildren(idComp.reverse(), dir);
            cyc++;
        } while ((idComp.length - parsedComponents.length) > 0);
        let scripts = document.getElementsByTagName("script");
        for (let i = 0; i < scripts.length; i++) {
            const node = scripts.item(i);
            if (node.type !== "module") {
                (_a = node.parentNode) === null || _a === void 0 ? void 0 : _a.replaceChild(nodeScriptClone(node), node);
            }
        }
    });
}
composePage();
