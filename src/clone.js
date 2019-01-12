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

	// log(`${chalk.gray("$ git " + command.join(" "))}`);

	// -- Process Events --//

	// Store all std messages for later use.
	let messages = [];

	cprocess.stderr.on("data", data => {
		messages.push(data.toString().trim());
	});
	cprocess.on("close", () => {
		// Combine messages.
		let message = messages.join("\n");

		// Checks:
		// - Repo already exists.
		// - Repo doesn't exist (wrong username/repo-name).
		// - Rebo branch doesn't exist.
		// - SSH:
		// 	 - missing key checks
		// - Clone success.

		if (message.includes("empty directory") && message.includes("exists")) {
			message = `A directory ${chalk.bold(
				repo
			)}/ already exists in current directory.`;
		} else if (
			message.includes("remote repository") &&
			message.includes("read") &&
			message.includes("not found")
		) {
			message = `Repo ${chalk.bold(
				`${username}/${repo}`
			)} seems to not exist.`;
		} else if (
			message.includes("remote branch") &&
			message.includes("find") &&
			message.includes("not found")
		) {
			message = `Repo branch ${chalk.bold(branch)} doesn't exist.`;
		} else if (
			message.includes("denied") &&
			message.includes("publickey") &&
			protocol === "ssh"
		) {
			message = `Missing SSH key. Ensure your public key is in ${service} to use ssh.`;
		} else if (
			message.includes("key") &&
			message.includes("verification") &&
			message.includes("failed") &&
			protocol === "ssh"
		) {
			message = `Host key verification failed. Ensure your public key is in ${service} to use ssh.`;
		} else {
			message = `Cloning successful.`;
		}

		log(message);
	});
};
