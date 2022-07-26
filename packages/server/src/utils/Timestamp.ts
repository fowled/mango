export function timestamp(date: bigint | number) {
	return `<t:${Math.round(Number(date) / 1000)}:d>`;
}

export function timestampYear(date: bigint | number) {
	return `<t:${Math.round(Number(date) / 1000)}:R>`;
}
