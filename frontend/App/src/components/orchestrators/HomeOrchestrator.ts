

const injectHtml = (content: string) =>  {

const placeholder = document.getElementById("GradientBackground");

if (!placeholder)
	console.error("Element not found: GradientBackground");
else
	placeholder.innerHTML = content;
	console.log(placeholder?.children);

}

const handleLoad = async () => {
	const data =  await fetch("/components-html/home/GradientBackground.html");			
	const body = await data.text()
		
	injectHtml(body);
}

window.onload = handleLoad


