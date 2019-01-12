"use strict";

// Needed modules.
const path = require("path");
const chalk = require("chalk");
const spawn = require("cross-spawn-with-kill");
const log = require("fancy-log");

/**
 * A wrapper for the CLI `$ git clone` utility. It will spawn a process to
 *     run: `$ git clone -b <branch> --single-branch <resource>`.
 *
 * @param  {object} info - The parsed return object containing the normalized
 *     URL and its components.
 * @return {undefined} - Nothing is returned.
 *
 * @resource [https://stackoverflow.com/a/4568323]
 */
module.exports = info => {
	// Get URL and its components.
	const { url, dest, name, components } = info;
	const {
		protocol,
		service,
		username,
		repo,
		branch,
		explicit_branch
	} = components;

	// The command to run.
	let command = ["clone", "--", url, path.join(dest, name || repo)];
	// If branch was explicitly provided only clone that branch.
	if (explicit_branch) {
		command.splice(1, 0, "-b", branch, "--single-branch");
	}

	// Run command.
	const cprocess = spawn("git", command);

	// -- Process Events --//

	// Store all std messages for later use.
	let messages = [];

	cprocess.stderr.on("data", data => {
		// Make each line of the each message be on its own line.
		let lines = data
			.toString()
			.trim()
			.split("\n");

		// Add it line to the messages array.
		for (let i = 0, l = lines.length; i < l; i++) {
			let line = lines[i].trim();
			if (line.length) {
				messages.push(line);
			}
		}
	});
	cprocess.on("close", () => {
		// Combine messages.
		let message = messages.join("\n");

		// Add custom message for successful/failed cloning.
		if (message.includes("fatal") || message.includes("error")) {
			// Give tip if using ssh failed for possible resolution.
			if (
				protocol === "ssh" &&
				(message.includes("ssh") ||
					message.includes("key") ||
					message.includes("verification"))
			) {
				messages.push(
					`tip: ensure your public key is in ${service} to properly use ssh.`
				);
			}

			messages.push(chalk.red("Cloning failed."));
		} else {
			messages.push(chalk.green("Cloning successful."));
		}

		// Log each message.
		for (let i = 0, l = messages.length; i < l; i++) {
			log(messages[i]);
		}
	});
};
