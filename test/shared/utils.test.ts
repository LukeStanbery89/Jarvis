import { sleep } from "../../shared/utils";

describe("sleep", () => {
    beforeAll(() => {
        jest.useFakeTimers();
    });

    afterAll(() => {
        jest.useRealTimers();
    });

    it("should resolve after the specified time", async () => {
        const ms = 1000;
        const promise = sleep(ms);

        jest.advanceTimersByTime(ms);

        await expect(promise).resolves.toBeUndefined();
    });

    it("should not resolve before the specified time", async () => {
        const ms = 1000;
        const promise = sleep(ms);

        jest.advanceTimersByTime(ms - 1);

        let resolved = false;
        promise.then(() => {
            resolved = true;
        });

        await Promise.resolve(); // Allow any pending promises to resolve

        expect(resolved).toBe(false);
    });
});