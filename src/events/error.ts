import { error } from "./../utils/Logger";

module.exports = {
	name: "error",
	execute(err: Error) {
		error(err.message);
	},
};
