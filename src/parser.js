"use strict";

// Needed modules.
const chalk = require("chalk");
const minimist = require("minimist");
const { format } = require("./utils.js");
const log = require("fancy-log");

/**
 * Parse and normalize provided URL.
 *
 * @return {object} - Object contains the URL components (protocol, service,
 *     username, reponame, etc.), the normalized URL, other information like
 *     the new repo name and repo destination.
 */
module.exports = () => {
	// Get parameters.
	let stdin = process.argv.slice(2);
	let { _: input, name, dest = process.cwd() } = minimist(stdin);
	// Input should be first unpositional parameter.
	input = input[0];

	// Exit if no input provided.
	if (!input) {
		log("Please provide a resource URL.");
		process.exit();
	}

	// Vars/defaults.
	let protocol = "https";
	let protocols = ["https", "ssh"];
	let service = "github";
	let services = ["github", "gitlab", "bitbucket"];
	let username;
	let resource = input;
	let repo;
	let branch = "master";
	let explicit_branch = false;

	// 1: Check for protocol.
	if (resource.includes("@")) {
		// Get index of @ symbol.
		let index = resource.indexOf("@");

		// Get protocol section from resource.
		let protocol_string = resource.substring(0, index);

		// Remove protocol string from resource.
		resource = resource.substring(index + 1, resource.length);

		// Get protocol/service.
		if (protocol_string.includes(":")) {
			[protocol, service] = protocol_string.split(":");
		} else {
			// When a colon is now found then a service was only provided.
			// Example: bitbucket@<username>/<repo>
			service = protocol_string;
			protocol = "https";
		}
		// Reset if nothing was detected.
		protocol = protocol || "https";
		service = service || "github";

		// Normalize service.
		if (["gh", "gl", "bb"].includes(service)) {
			switch (service) {
				case "gh":
					service = "github";
					break;
				case "gl":
					service = "gitlab";
					break;
				case "bb":
					service = "bitbucket";
					break;
				// default:
				// service = service;
			}
		}

		// Error check protocol/service to see if allowed...
		if (!protocols.includes(protocol)) {
			log(
				`Provided protocol ${chalk.bold(
					protocol
				)} is not allowed. 'https' or 'ssh' only.`
			);
			process.exit();
		}
		if (!services.includes(service)) {
			log(
				`Provided service ${chalk.bold(
					service
				)} is not allowed. 'github', 'gitlab', or 'bitbucket' only.`
			);
			process.exit();
		}
	}

	// 2: Check for branch.
	if (resource.includes("#")) {
		// Get index of # symbol.
		let index = resource.indexOf("#");

		// Get branch section from resource.
		branch = resource
			.substring(index + 1, resource.length)
			.replace(/^#/g, "");
		// Reset if nothing was detected.
		branch = branch || "master";

		// Remove branch name from resource.
		resource = resource.substring(0, index);

		// Reset flag.
		explicit_branch = true;

		// Possible checks?
	}

	// 3: Get username/repo.
	if (resource.length) {
		// Get protocol/service.
		[username, repo] = resource.split("/");

		if (!username) {
			log(`A github profile username was not provided.`);
			process.exit();
		}

		if (!repo) {
			log(`A github repo name was not provided.`);
			process.exit();
		}
	}

	// GitHub, GitLab, BitBucket https/ssh URL templates.
	const templates = {
		github: {
			ssh: "git@github.com:{{#username}}/{{#repo}}.git",
			https: "https://github.com/{{#username}}/{{#repo}}.git"
		},
		bitbucket: {
			ssh: "git@bitbucket.org:{{#username}}/{{#repo}}.git",
			https: "https://bitbucket.org/{{#username}}/{{#repo}}.git"
		},
		gitlab: {
			ssh: "git@gitlab.com:{{#username}}/{{#repo}}.git",
			https: "https://gitlab.com/{{#username}}/{{#repo}}.git"
		}
	};

	// Return normalized URL and its components.
	return {
		// Get template and format with repo information.
		url: format(templates[service][protocol], { username, repo }),
		components: {
			protocol,
			service,
			username,
			repo,
			branch,
			explicit_branch
		},
		dest,
		name
	};
};
