import fs from 'fs';


const injectHtml = (content: string) =>  {

const placeholder = document.getElementById("GradientBackground");

if (!placeholder)
	console.error("Element not found: GradientBackground");
else
	placeholder.innerHTML = content;

}

fs.readFile('./GradientBackground.html', (err, data) => {
		
	if (err)
		throw (err);
	
	const content = data;
	injectHtml(content.toString());
});


