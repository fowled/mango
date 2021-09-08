import * as Logger from "./../utils/Logger";

module.exports = {
	name: "error",
	execute(error: Error) {
		Logger.error(error.message);
	}
};

