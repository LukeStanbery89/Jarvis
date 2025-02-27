/**
 * Pauses the program for a given time in milliseconds.
 *
 * @param ms Time to sleep in milliseconds
 * @returns Promise<void>
 */
export function sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
}