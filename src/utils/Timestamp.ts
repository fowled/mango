export function timestamp(date: number) {
    return `<t:${Math.round(date / 1000)}:d>`;
}
