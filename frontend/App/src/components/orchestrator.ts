
import { FILE } from "dns/promises";
import fs from "fs";

const NEEDLE = "class="
const FILE_CACHE = new Map<string, string>();
let ALL_DONE = false;

type PageCompositingType = {
	parsedPage: string;
	unparsedPage: string;	
}

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


//Find the first istance of 'class=' in a given string (index === start of needle)
function getClassIndex(unparsed: string) {

		const classIndex = unparsed.search(NEEDLE);
		return classIndex;
}

function getClass(unparsed: string) {

		const classIndex = getClassIndex(unparsed);
		if (classIndex < 0)
			return null;
		const classStringStart = unparsed.substring(classIndex + NEEDLE.length + 1);
		const classString = classStringStart.substring(0, classStringStart.search('"'));

		return classString;
}

function getComponentName(cn: string) {

	let ret: string = "";

	for (let i = 0; i < cn.length; i++)
	{
		if (cn[i] >= 'A' && cn[i] <= 'Z')
		{
			if (ret !== "" && (cn[i - 1] === ' ' ||  cn[i - 1] === '"'))
			{
				console.error(`\nMore than one component in class: ${ret}\n`);
				return ret;
			}
			let j = i;
			for (j; (cn[j] !== '"' && cn[j] !== ' ' && j < cn.length); j++);
			const componStart = i;
			i += j;
			const componEnd = j;
			ret = cn.substring(componStart, componEnd);
		}
	}

	return ret;
};

function findComponentTagEnd(unparsed: string) {

	const classIndex  = getClassIndex(unparsed);
	let i = classIndex;
	let isText: boolean = false;

	if (!classIndex)
		return 0;
	for (i; i < unparsed.length; i++)
	{
		if (unparsed[i] === '"')
			isText = !isText;
		if (isText)
			continue;
		if (unparsed[i] === '>')
			break;
	}
	
	return (i);

}

const getComponentsDirectoryListing = () => {

	//TODO edit to accept generic path
	const res = fs.readdirSync("./src/components", {recursive: true, encoding: "utf8"});
	return res;
}


const checkDuplicateComponentsFiles = (dir: string[], id: string) => {
	
	const firstInstance = dir.filter((path) => (path.search(id + ".html") > 0))

	if (firstInstance.length > 1 )
	{
		console.error(`\nError: duplicate component file: ${id}\n`);
		return true;
	}
	return false;
}


function getComponentFile(compName: string) {
	
			const dir: string[] = getComponentsDirectoryListing();
			if (!dir)
				return null;

			//path to component file
			const relativePath = dir.find((el) => (el.search(compName) > 0))
			if (!relativePath)
			{
				console.error(`\nElement not found: ${compName}\n`);
				return "";
			}
			checkDuplicateComponentsFiles(dir, compName);

			//Fetch content from cache
			let fileContent = FILE_CACHE.get(compName);
			
			//fetch from server and add to cache if not cached
			if (!fileContent) {
				//TODO edit for generic path
				fileContent = fs.readFileSync("./src/components/" + relativePath, {encoding: "utf8"});
				if (!fileContent)
					return "";
				FILE_CACHE.set(compName, fileContent);
			}

			return fileContent;
}

function addDoneFlag(unparsed: string) {
	const classIndex = getClassIndex(unparsed) + NEEDLE.length + 1;

	const str1 = unparsed.substring(0, classIndex);
	const str2 = unparsed.substring(classIndex);
	return str1 + " ____done____ " + str2;
}

function checkIfComponentDone(unparsed: string) {
	const cn = getClass(unparsed);
	if (cn!.search("____done____") > 0)
	{
		return true;
	}

	ALL_DONE = false;
	return false;
}

function writeComponent(pageString: string, compName: string, nullRes: PageCompositingType) {


			// Flag to not append children to the same component in successive iterations
			const isDone = checkIfComponentDone(pageString);
			if (!isDone) 
				pageString = addDoneFlag(pageString);

			// split the page where the closing angle bracket of the first component is found;
			let splitIndex = findComponentTagEnd(pageString);
			if (!splitIndex)
				return nullRes;	

			const firstHalf = pageString.substring(0, splitIndex + 1);
			const secondHalf = pageString.substring(splitIndex + 1);


			if (isDone || !compName)
			{
				return {parsedPage: firstHalf, unparsedPage: secondHalf};
			}

			const compFile = getComponentFile(compName);
			if (!compFile)
			{
				console.error(`\nError in component file fetch: ${compName}\n`);
			}

			const newPageFragment = firstHalf + compFile;
			return {parsedPage: newPageFragment, unparsedPage: secondHalf};
}


//
function appendComponent(pageString: string): PageCompositingType | null {
	

		//used for non-blocking errors
		const nullRes: PageCompositingType = {parsedPage: pageString, unparsedPage:""};


		const firstClassFound = getClass(pageString);
		if (!firstClassFound) {
			return nullRes;
		}


		const compName = getComponentName(firstClassFound);
		return (writeComponent(pageString, compName, nullRes));
		
}


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


function deleteDoneFlags(page: string) {

	const splitted = page.split('____done____')
	let ret = "";

	splitted.forEach((line) => {
		ret += line.substring(1, line.length - 1);
	})

	return ret;
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

