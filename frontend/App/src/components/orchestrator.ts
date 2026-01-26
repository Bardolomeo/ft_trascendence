
import fs from "fs";

export const handleLoad = async (route: string) => {

	let parsedRoute = route;
	if (route === "/")
		parsedRoute = "home";

	try {
		//injectHtml(body);
	} catch (e) {
		let er = e as Error;
		console.error("Error:" + er.message)
		return;
	}

}

//return the index.html file for the route if file /components/{route}/index.html exists
//where /components/ is the static route for /src/components
//return notFound otherwise
// THIS IS SERVER SIDE
export default function findPage(route: string) {
	
	let parsedRoute = route;
	if (route == "/")
		parsedRoute = "home";
	const file = `src/components/${parsedRoute}/index.html`;


	//file reader
	try {
		
		const body = fs.readFileSync(file, {encoding: "utf-8"});
		const page = addHeadToPage(body);
		return page;

	} catch (e) {
		
			//check if the error is of type file not found
			const isNotFound = (e as Error).message.search("no such file or directory");
			
			if (isNotFound)
			{
				//TODO add not found page
				return ("NOT FOUND");
			} else {
					return ((e as Error).message);
			}
		
	}
}

function addHeadToPage(body: string) {

	const layout = 
	`
		<!DOCTYPE html>
		<html>
			<head>
				<meta charset="utf-8" />
				<title>ULTRAPONG</title>
				<link href="./public/style/output.css" rel="stylesheet">
			</head>
			\n${body}\n
			<script src="/components/orchestratorClient.js" type="module"></script>
		</html>
	` 
	return layout;

}



