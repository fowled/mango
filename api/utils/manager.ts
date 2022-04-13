import { NextFunction, Request, Response } from "express";
import { fetchNewToken } from "./requests";

export async function hasTokenExpired(req: Request, res: Response, next: NextFunction) {
	const todayDate = new Date();
	const sessionExpirationDate = new Date(req.session.date);

	if (todayDate > sessionExpirationDate) {
		await refreshToken(req);

		return next();
	} else {
		return next();
	}
}

export async function refreshToken(req: Request) {
	const fetchToken = await fetchNewToken(req.session.refresh_token);
	const nextWeekDate = new Date(new Date().getTime() + 7 * 24 * 60 * 60 * 1000);

	Object.assign(req.session, {
		token: fetchToken.access_token,
		refresh_token: fetchToken.refresh_token,
		date: nextWeekDate,
	});
}
