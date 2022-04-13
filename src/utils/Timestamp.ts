export function timestamp(date: number) {
	return `<t:${Math.round(date / 1000)}:d>`;
}

export function timestampYear(date: number) {
	return `<t:${Math.round(date / 1000)}:R>`;
}
