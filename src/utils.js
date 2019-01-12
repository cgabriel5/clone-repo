"use strict";

/**
 * Formats template with provided data object.
 *
 * @param {string} template - The template to use.
 * @param {object|*n} data - The object containing the data to replace
 *     placeholders with. Or n amount of arguments.
 * @return {string} - The formatted template.
 */
const format = function(template, data) {
	// If an object containing the replacement map is not provided as the
	// second argument, then get all arguments from 1 to N and create the
	// replacement map.
	var rmap = {};
	var normalized;
	if (typeof arguments[1] !== "object") {
		// Set flag.
		normalized = true;

		// Create the replacement map.
		for (let i = 1, l = arguments.length; i < l; i++) {
			// Store the arguments.
			rmap[i] = arguments[i];
		}
		// Finally, reset variable.
		data = rmap;
	}

	return template.replace(/\{\{#(.*?)\}\}/g, function(match) {
		// Remove formating decorations.
		match = match.replace(/^\{\{#|\}\}$/g, "");

		// If using an index based replacement map, remove everything
		// but numbers.
		if (normalized) {
			match = match.replace(/[^0-9]/g, "");
		}

		// Lookup replacement value.
		let lookup = data[match];
		// If the value is anything but undefined or null then use it as a
		// substitute. All other values may be used as they will be casted
		// to strings before replacement. This allows for falsy values
		// like "0" (zero) and "" (an empty string) to be used as substitute
		// values.
		return lookup === undefined || lookup === null
			? `{{#${match}}}`
			: String(lookup);
	});
};

module.exports = {
	format
};
