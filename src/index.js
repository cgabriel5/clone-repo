#!/usr/bin/env node
"use strict";

(function main() {
	require("./clone.js")(require("./parser.js")());
})();
