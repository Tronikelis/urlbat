import joinParts from "./joinParts";

export interface Opts {
    /**
     * @default "repeat"
     */
    array?: "comma" | "repeat" | "stringify";
}

export type Params = Record<string, any>;

const assert = (item: any) => {
    if (item === 0 || typeof item === "boolean") return true;
    return !!item;
};

const urlbat = (
    base: string,
    segments: string | Params,
    params?: Params | Opts,
    opts?: Opts
) => {
    const FROZEN_PARAMS: Params | Opts =
        typeof segments === "string" ? { ...params } : { ...segments };

    const FROZEN_SEGMENTS =
        typeof segments === "string" ? joinParts(base, segments) : base;

    const FROZEN_SETTINGS: Opts = (typeof segments === "string"
        ? opts
        : params) || { array: "repeat" };

    const usedParams: string[] = [];

    // add custom paths from params to segments
    const url = FROZEN_SEGMENTS.split("/")
        .map((seg) => {
            if (seg[0] === ":") {
                const key = seg.slice(1);

                const value = (FROZEN_PARAMS as Params)[key];
                if (!assert(value)) {
                    throw new Error(
                        "path segments can't be falsy, got " + String(value)
                    );
                }

                usedParams.push(key);
                return encodeURIComponent(String(value));
            }

            return seg;
        })
        .join("/");

    usedParams.forEach((key) => {
        delete (FROZEN_PARAMS as Params)[key];
    });

    const query = new URLSearchParams({});

    Object.entries(FROZEN_PARAMS)
        .filter(([, param]) => assert(param) || !!param)

        .forEach(([key, value]) => {
            if (Array.isArray(value)) {
                switch (FROZEN_SETTINGS?.array) {
                    case "repeat":
                        value.forEach((item) => query.append(key, item));
                        break;
                    case "comma":
                        query.append(key, value.join(","));
                        break;
                    case "stringify":
                        query.append(key, JSON.stringify(value));
                        break;
                }
                return;
            }

            if (typeof value === "object") {
                query.append(key, JSON.stringify(value));
                return;
            }

            query.append(key, String(value));
        });

    if (!query.toString()) {
        return url;
    }

    return url + "?" + query.toString();
};

export default urlbat;
export { urlbat, joinParts };
