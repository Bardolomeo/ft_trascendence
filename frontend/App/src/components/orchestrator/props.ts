import { findComponentTagEnd } from "./utils.ts";

type PropsResult = {
	propsMap: Map<string, string>;
	modifiedPageString: string;
};

/**
 * Extract component tag boundaries from page string
 * Returns the full tag from '<' to '>' character, respecting quotes
 */
function extractComponentTag(pageString: string, compName: string): { tag: string; startIdx: number; endIdx: number } | null {
	// Find the component name in the page
	const compIdx = pageString.search(compName);
	if (compIdx === -1) {
		return null;
	}

	// Find the opening '<' before the component name
	let startIdx = compIdx;
	while (startIdx > 0 && pageString[startIdx] !== '<') {
		startIdx--;
	}
	
	if (pageString[startIdx] !== '<') {
		console.error(`Could not find opening '<' for component ${compName}`);
		return null;
	}

	// Find the closing '>' after the component name, respecting quotes
	let endIdx = compIdx;
	let inQuotes = true;
	let quoteChar = '';

	for (let i = compIdx; i > 0; i--)
		if (pageString[i] === "'" || pageString[i] === '"')
			quoteChar = pageString[i];
	

	for (let i = compIdx; i < pageString.length; i++) {
		const char = pageString[i];
		
		// Handle entering/exiting quotes
		if ((char === '"' || char === "'") && !inQuotes) {
			inQuotes = true;
			quoteChar = char;
		} else if (char === quoteChar && inQuotes) {
			inQuotes = false;
			quoteChar = '';
		}
		
		// Found closing bracket outside of quotes
		if (char === '>' && !inQuotes) {
			endIdx = i;
			break;
		}
	}

	const tag = pageString.substring(startIdx, endIdx + 1);
	return { tag, startIdx, endIdx };
}

/**
 * Validate prop name characters
 * Allowed: alphanumeric, underscore
 */
function isValidPropNameChar(char: string): boolean {
	return /[a-zA-Z0-9_]/.test(char);
}

/**
 * Extract all props from a component tag
 * Returns the modified tag (without props) and the props map
 */
function extractPropsFromTag(tag: string): { modifiedTag: string; propsMap: Map<string, string> } {
	const propsMap = new Map<string, string>();
	let modifiedTag = tag;
	
	// Find all '$' characters in the tag
	let dollarIdx = modifiedTag.indexOf('$');
	
	while (dollarIdx !== -1) {
		// Check for double '$' (error)
		if (modifiedTag[dollarIdx + 1] === '$') {
			console.error(`Invalid prop declaration: double '$' at position ${dollarIdx}`);
			dollarIdx = modifiedTag.indexOf('$', dollarIdx + 1);
			continue;
		}

		// Parse prop name
		let propNameEnd = dollarIdx + 1;
		while (propNameEnd < modifiedTag.length && isValidPropNameChar(modifiedTag[propNameEnd])) {
			propNameEnd++;
		}

		const propName = modifiedTag.substring(dollarIdx + 1, propNameEnd);
		
		// Validate prop name is not empty
		if (propName.length === 0) {
			console.error(`Invalid prop declaration: empty prop name at position ${dollarIdx}`);
			dollarIdx = modifiedTag.indexOf('$', dollarIdx + 1);
			continue;
		}

		// Check for '=' after prop name (skip if not found - not a declaration)
		if (propNameEnd >= modifiedTag.length || modifiedTag[propNameEnd] !== '=') {
			// Not a prop declaration, skip
			dollarIdx = modifiedTag.indexOf('$', dollarIdx + 1);
			continue;
		}

		// Check for double '=' (error)
		if (propNameEnd + 1 < modifiedTag.length && modifiedTag[propNameEnd + 1] === '=') {
			console.error(`Invalid prop declaration: double '=' in prop ${propName}`);
			dollarIdx = modifiedTag.indexOf('$', dollarIdx + 1);
			continue;
		}

		// Extract prop value (from '=' to the closing quote/space/bracket)
		let valueStart = propNameEnd + 1;
		
		// Handle quoted values
		let valueEnd = valueStart;
		let inQuotes = false;
		let quoteChar = '';
		
		for (let i = valueStart; i < modifiedTag.length; i++) {
			const char = modifiedTag[i];
			
			// Check if we're starting a quoted string
			if ((char === '"' || char === "'") && !inQuotes) {
				inQuotes = true;
				quoteChar = char;
				valueStart = i + 1; // Start after the opening quote
				continue;
			}
			
			// Check if we're ending a quoted string
			if (char === quoteChar && inQuotes) {
				valueEnd = i;
				break;
			}
			
			// If not in quotes, check for terminator (space or >)
			if (!inQuotes && (char === ' ' || char === '>' || char === '\t' || char === '\n')) {
				valueEnd = i;
				break;
			}
			
			valueEnd = i + 1;
		}

		const propValue = modifiedTag.substring(valueStart, valueEnd);
		
		// Check for duplicate prop
		if (propsMap.has(propName)) {
			console.warn(`Prop '${propName}' defined multiple times in component`);
		}
		
		// Store prop
		propsMap.set(propName, propValue);
		
		// Remove the prop from the tag
		// Find the full prop declaration including leading whitespace if present
		let propStart = dollarIdx;
		while (propStart > 0 && /\s/.test(modifiedTag[propStart - 1])) {
			propStart--;
		}
		
		// Find the end of the prop value (including closing quote if present)
		let propEnd = valueEnd;
		if (inQuotes && propEnd < modifiedTag.length && modifiedTag[propEnd] === quoteChar) {
			propEnd++;
		}
		
		// Remove the prop from modifiedTag
		modifiedTag = modifiedTag.substring(0, propStart) + modifiedTag.substring(propEnd);
		
		// Find next '$' - account for the removed characters
		dollarIdx = modifiedTag.indexOf('$', propStart);
	}

	return { modifiedTag, propsMap };
}

/**
 * Main function to set props for a component
 * Extracts props from the component tag, removes them from the HTML,
 * and returns the modified page string with the props map
 */
export function setProps(compName: string, pageString: string): PropsResult {
	const propsMap = new Map<string, string>();
	
	if (!compName) {
		return { propsMap, modifiedPageString: pageString };
	}

	// Extract the component tag
	const tagInfo = extractComponentTag(pageString, compName);
	if (!tagInfo) {
		return { propsMap, modifiedPageString: pageString };
	}

	// Extract props from the tag
	const { modifiedTag, propsMap: extractedProps } = extractPropsFromTag(tagInfo.tag);
	
	// Replace the original tag with the modified tag in the page string
	const modifiedPageString = 
		pageString.substring(0, tagInfo.startIdx) + 
		modifiedTag + 
		pageString.substring(tagInfo.endIdx + 1);

	return { propsMap: extractedProps, modifiedPageString };
}

/**
 * Explode props in component content
 * Replace $propName placeholders with actual values from propsMap
 */
export function explodeProps(componentContent: string, propsMap: Map<string, string>): string {
	let result = componentContent;
	
	// Find all '$' characters in the content
	let dollarIdx = result.indexOf('$');
	
	while (dollarIdx !== -1) {
		// Check for escaped '$' or double '$'
		if (result[dollarIdx + 1] === '$') {
			// Escaped dollar sign, skip
			dollarIdx = result.indexOf('$', dollarIdx + 2);
			continue;
		}
		
		// Check if there's an '=' nearby (if so, it's a declaration, not a usage)
		// Look ahead for '=' within reasonable distance (prop name length + 1)
		let isDeclaration = false;
		let checkIdx = dollarIdx + 1;
		while (checkIdx < result.length && /[a-zA-Z0-9_]/.test(result[checkIdx])) {
			checkIdx++;
		}
		if (checkIdx < result.length && result[checkIdx] === '=') {
			// This is a prop declaration, not a usage - skip
			isDeclaration = true;
		}
		
		if (isDeclaration) {
			dollarIdx = result.indexOf('$', dollarIdx + 1);
			continue;
		}
		
		// Extract prop name
		let propNameEnd = dollarIdx + 1;
		while (propNameEnd < result.length && /[a-zA-Z0-9_]/.test(result[propNameEnd])) {
			propNameEnd++;
		}
		
		const propName = result.substring(dollarIdx + 1, propNameEnd);
		
		// Check if this prop exists in the map
		if (propsMap.has(propName)) {
			const propValue = propsMap.get(propName)!;
			// Replace $propName with the value
			result = result.substring(0, dollarIdx) + propValue + result.substring(propNameEnd);
			// Continue searching from the replacement position
			dollarIdx = result.indexOf('$', dollarIdx + propValue.length);
		} else {
			console.warn(`Undefined prop: $${propName}`);
			// Keep the original and move on
			dollarIdx = result.indexOf('$', propNameEnd);
		}
	}
	
	return result;
}
