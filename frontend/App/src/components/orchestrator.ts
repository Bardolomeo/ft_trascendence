
import fs from "fs";
import { addDoneFlag, checkIfComponentDone, deleteDoneFlags, findComponentTagEnd, getClass, getComponentFileContent, getComponentName } from "./orchestrator/utils.ts";
import { setProps } from "./orchestrator/props.ts";

let ALL_DONE = false;

type PageCompositingType = {
	parsedPage: string;
	unparsedPage: string;	
}


const NULL_RES: PageCompositingType = {parsedPage: "", unparsedPage:""};

//fetfh index.html file for the route if file /components/{route}/index.html exists
//where /components/ is the static route for /src/components
//Append children recursively
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
		const page = composePage(body);

		return page;

	} catch (e) {
		
			//check if the error is of type file not found
			const isNotFound = (e as Error).message.search("no such file or directory");
			
			if (isNotFound)
			{
				//TODO add not found page
				console.error((e as Error).message);
				return ("NOT FOUND");
			} else {
					return ((e as Error).message);
			}
		
	}
}


function writeComponent(pageString: string, compName: string) {


			// Flag to not append children to the same component in successive iterations
			
			NULL_RES.parsedPage = pageString;
			const isDone = checkIfComponentDone(pageString);
			if (!isDone) 
			{
				pageString = addDoneFlag(pageString);
				ALL_DONE = false;
			}


			// split the page where the closing angle bracket of the first component is found;
			let splitIndex = findComponentTagEnd(pageString);
			if (!splitIndex)
				return NULL_RES;	

			//Ends with found component closing bracket
			const firstHalf = pageString.substring(0, splitIndex + 1);

			//Starts after found component closing bracket
			const secondHalf = pageString.substring(splitIndex + 1);


			if (isDone || !compName)
			{
				return {parsedPage: firstHalf, unparsedPage: secondHalf};
			}

			const compFile = getComponentFileContent(compName);
			if (!compFile)
			{
				console.error(`\nError in component file fetch: ${compName}\n`);
			}

			//Fragment with the updated component in 'newPageFragment'
			const newPageFragment = firstHalf + compFile;
			return {parsedPage: newPageFragment, unparsedPage: secondHalf};
}



function appendComponent(pageString: string): PageCompositingType | null {

		const propsMap = new Map<string, string>();


		//returns the value of the first class attribute found in pageString
		NULL_RES.parsedPage = pageString;
		const firstClassFound = getClass(pageString);
		//console.log(firstClassFound);
		if (!firstClassFound) {
			return NULL_RES;
		}

		//Getter for component name, search inside class attribute 
		//return "" if does not find component name in class
		const compName = getComponentName(firstClassFound);	
		//if (compName) {
			//handle prop declaration
			setProps(propsMap, compName, pageString);
		//}
		return (writeComponent(pageString, compName));
		
}


//parse index file and appends children accordingly
function  composePageIteration(body: string) {
	
   	let oldPage = body;
		let newPageFragment = "";

		//Append child to components one by one
	 	do {
			const written: PageCompositingType | null = appendComponent(oldPage);
			newPageFragment += written?.parsedPage;
			oldPage = written?.unparsedPage || "";
		} while (oldPage !== "");

		return newPageFragment;

}


function composePage(body: string) {

	let newPage = body;

	//Iterates until all compoents are flagged with ____done____
	while (!ALL_DONE) {
		ALL_DONE = true;

		newPage = composePageIteration(newPage);
	}

	newPage = deleteDoneFlags(newPage);

	const pageString = 
	`
		<html>
			<head>
				<meta charset="utf-8" />
				<title>ULTRAPONG</title>
				<link href="./public/style/output.css" rel="stylesheet">
			</head>
			\n${newPage}\n
		</html>
	`
	//reset flag for reloads
	ALL_DONE = false;

	return pageString;//resPageString;

}

