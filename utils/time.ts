export function formatTime(milli: number): string {
    // Saw this on stackoverflow especially the remainder (%)
    const seconds = Math.floor(milli / 1000) % 60;
    const minutes = Math.floor((milli / (1000 * 60)) % 60);
    const hours = Math.floor((milli / (1000 * 60 * 60)) % 24);

    if (hours > 0) {
        return `${appendZero(hours)}:${appendZero(minutes)}:${appendZero(seconds)}`
    }
    return `${appendZero(minutes)}:${appendZero(seconds)}`;
}

function appendZero(number: number): string {
    return number < 10 ? `0${number}` : `${number}`;
}