
let parsedComponents: HTMLElement[] = [];
const checkDuplicateComponentsFiles = (dir: string[], id: string) => {
	
	const firstInstance = dir.filter((path) => (path.search(id + ".html") > 0))

	if (firstInstance.length > 1 )
	{
		console.error("Error: duplicate component file: " + id);
		return true;
	}
	return false;
}

const  getComponentsWithId = async (allPageElements: HTMLCollection) => {
	
		let componentsInPage: HTMLElement [] = [];
		for (let i = 0; i < allPageElements.length; i++)
		{
			let currentElement = allPageElements.item(i);
			if (currentElement && currentElement.id)
			{
				//check if frist id character is Uppercase
				if (currentElement.id[0] >= "A" && currentElement.id[0] <= "Z" ) 
					componentsInPage.push(currentElement as HTMLElement);
			}
		}
		return componentsInPage;
}


const getComponentsInPage = async (doc: Document) =>
{
		const allPageElements = doc.getElementsByTagName("*");
		if (!allPageElements)
			throw new Error("Failed to fetch elements");
		return allPageElements;
}

const getComponentsDirectoryListing = async () => {

	const data = await fetch("/components");
	return JSON.parse(await data.text());
}



const appendChildren = async (idComponent: HTMLElement[], dir: string[]) => {

		//LOOP fetch components files and append to them to their parents
			idComponent.forEach(async (parentComp) => {

			const id = parentComp.id 

			//all components paths from directoryListing (relative)
			const relativePath = dir.find((el) => (el.search(id) > 0))
		
			
			//check for duplicate component files
			checkDuplicateComponentsFiles(dir, id);

			//Does component file exist
			if (relativePath === undefined)
			{
				console.error("Error: Component not found:" + id);
				return;
			}

			const data = await fetch("/components/" + relativePath)
			const childComponent = await (data).text();
			
			//check if element was already analized/parsed
			if (parsedComponents.find((el) => parentComp === el))
				return;

			//little delay to synchronyze stuff
			setTimeout(() => {}, 0);
			
			//insert child after last element
			parentComp.insertAdjacentHTML('beforeend', childComponent);

			parsedComponents.push(parentComp);
	})
}

//function nodeScriptClone(node: HTMLElement){
//        let script  = document.createElement("script");
//        script.text = node.innerHTML;
//
//        let i = -1, attrs = node.attributes, attr;
//        while ( ++i < attrs.length ) {                                    
//              script.setAttribute( (attr = attrs[i]).name, attr.value );
//        }
//        return script;
//}

//const reloadScripts = () => {
//	let scripts: HTMLCollection = document.getElementsByTagName("script");
//	for (let i = 0; i < scripts.length; i++)
//	{
//		const node = (scripts.item(i) as HTMLScriptElement); 
//		if (node.type !== "module")
//		{
//			node.parentNode?.replaceChild(nodeScriptClone(node), node);	
//		}
//	}
//}

export async function composePage(doc: Document) {

	let idComponent: HTMLElement[];
	let cyc = 0;

	//Reiterate until there are 0 id fields in Uppercase
	do {
		const allPageElements = await getComponentsInPage(doc);
		idComponent = await getComponentsWithId(allPageElements);
		const dir: string[] = await getComponentsDirectoryListing();
		appendChildren(idComponent.reverse(), dir );
		cyc++;
	} while ((idComponent.length - parsedComponents.length) > 0 );

}

