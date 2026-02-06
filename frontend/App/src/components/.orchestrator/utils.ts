import fs from "fs";

const NEEDLE = "class="
const FILE_CACHE = new Map<string, string>();

export function getClassIndex(unparsed: string) {

		const classIndex = unparsed.search(NEEDLE);
		return classIndex;
}

export function getClass(unparsed: string) {

		const classIndex = getClassIndex(unparsed);
		if (classIndex < 0)
			return null;
		const classStringStart = unparsed.substring(classIndex + NEEDLE.length + 1);
		const classString = classStringStart.substring(0, classStringStart.search('"'));

		return classString;
}

export function getComponentName(cn: string) {

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

export function findComponentTagEnd(unparsed: string) {

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
export const getComponentsDirectoryListing = () => {

	//TODO edit to accept generic path
	const res = fs.readdirSync("./src/components", {recursive: true, encoding: "utf8"});
	return res;
}

export const checkDuplicateComponentsFiles = (dir: string[], id: string) => {
	
	const firstInstance = dir.filter((path) => (path.search(id + ".html") > 0))

	if (firstInstance.length > 1 )
	{
		console.error(`\nError: duplicate component file: ${id}\n`);
		return true;
	}
	return false;
}

export function getComponentFileContent(compName: string) {
	
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

export function addDoneFlag(unparsed: string) {
	const classIndex = getClassIndex(unparsed) + NEEDLE.length + 1;

	const str1 = unparsed.substring(0, classIndex);
	const str2 = unparsed.substring(classIndex);
	return str1 + " ____done____ " + str2;
}

export function deleteDoneFlags(page: string) {

	const splitted = page.split('____done____')
	let ret = "";

	splitted.forEach((line) => {
		ret += line.substring(1, line.length - 1);
	})

	return ret;
}


export function checkIfComponentDone(unparsed: string) {
	const cn = getClass(unparsed);
	if (cn!.search("____done____") > 0)
	{
		return true;
	}

	return false;
}
