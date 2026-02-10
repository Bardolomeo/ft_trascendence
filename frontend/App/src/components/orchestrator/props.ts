import { findComponentTagEnd } from "./utils.ts";

function getPropString(pageString: string, compName: string) {
	const compNameInPageIdx = pageString.search(compName);
	if (!compNameInPageIdx) {
		console.error("Component name not found in class when it should have");
	}
	let firstHalf = pageString.substring(0, compNameInPageIdx);
	let secondHalf = pageString.substring(compNameInPageIdx);

	console.log("FIRST HALF:" + firstHalf + "\n\n")

	console.log("SECOND HALF:" + secondHalf + "\n\n")

}


export function setProps(propsMap: Map<string, string>, compName: string, pageString: string) {


		const propString = getPropString(pageString, compName);

		//if (propString.search("=") > 0)
		//{
		//	const propName = getPropName(propString);
		//	if (propsMap.get(propValue))
		//	{
		//		console.warn(`Prop ${propName} defined multiple times in component ${compName}`)
		//	}
		//		propsMap.set(propName, propValue);
		//	const propValue = getPropValue(propString);
		//}

}
