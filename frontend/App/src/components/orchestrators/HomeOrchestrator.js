var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
const injectHtml = (content) => {
    const placeholder = document.getElementById("GradientBackground");
    if (!placeholder)
        console.error("Element not found: GradientBackground");
    else
        placeholder.innerHTML = content;
    console.log(placeholder === null || placeholder === void 0 ? void 0 : placeholder.children);
};
const handleLoad = () => __awaiter(void 0, void 0, void 0, function* () {
    const data = yield fetch("/components-html/home/GradientBackground.html");
    const body = yield data.text();
    injectHtml(body);
});
window.onload = handleLoad;
export {};
//# sourceMappingURL=HomeOrchestrator.js.map