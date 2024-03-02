// This function calculates the height to pass to a view so that
// the aspect ratio of an image or video will be preserved and there
// will be no white space if the contain resize mode is used
// Got it here - https://stackoverflow.com/a/73858988/6907127
export function calculateHeight(
    originalHeight: number, originalWidth: number, newWidth: number
): number {
    return (originalHeight / originalWidth) * newWidth;
}