import urlbat from "../src/index.js";

describe("urlbat options", () => {
    it("Options can be passed as a third parameter ", () => {
        const expected = "https://example.com/one?param=1";
        const actual = urlbat("https://example.com/one", { param: 1 }, { array: "comma" });

        expect(expected).toBe(actual);
    });

    it("Options can be passed as a fourth parameter ", () => {
        const expected = "https://example.com/one?param=1";
        const actual = urlbat("https://example.com", "/one", { param: 1 }, { array: "comma" });

        expect(expected).toBe(actual);
    });
});

describe("urlbat arrays", () => {
    it("Option array: 'repeat', param is repeated", () => {
        const expected = "https://example.com/one?arr=1&arr=2&arr=3";
        const actual = urlbat(
            "https://example.com",
            "/one",
            { arr: [1, 2, 3] },
            { array: "repeat" }
        );

        expect(expected).toBe(actual);
    });

    it("Option array: 'comma', param is joined with commmas", () => {
        const expected = `https://example.com/one?arr=${encodeURIComponent("1,2,3")}`;
        const actual = urlbat(
            "https://example.com",
            "/one",
            { arr: [1, 2, 3] },
            { array: "comma" }
        );

        expect(expected).toBe(actual);
    });

    it("Option array: 'stringify', param is stringified", () => {
        const expected = `https://example.com/one?arr=${encodeURIComponent(
            JSON.stringify([1, 2, 3])
        )}`;
        const actual = urlbat(
            "https://example.com",
            "/one",
            { arr: [1, 2, 3] },
            { array: "stringify" }
        );

        expect(expected).toBe(actual);
    });
});

describe("urlbat objects", () => {
    it("Urlbat stringifies params, which are objects", () => {
        const obj = {
            hello: "world",
        };
        const expected = `https://example.com/one?obj=${encodeURIComponent(
            JSON.stringify(obj)
        )}`;
        const actual = urlbat("https://example.com", "/one", { obj });

        expect(expected).toBe(actual);
    });
});
