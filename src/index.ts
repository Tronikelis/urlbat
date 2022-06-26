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

const defOpts: Opts = { array: "repeat" };

const urlbat = (
    base: string,
    segments: string | Params,
    params?: Params | Opts,
    opts?: Opts
) => {
    const FROZEN_PARAMS: Params =
        typeof segments === "string" ? { ...params } : { ...segments };

    const FROZEN_SEGMENTS = typeof segments === "string" ? joinParts(base, segments) : base;

    const FROZEN_SETTINGS: Opts = (typeof segments === "string" ? opts : params) || defOpts;

    // params that will be used in the dyanimc segments => user/:id/name => [id]
    const usedParams: string[] = [];

    // generate a valid url without the query
    const url = FROZEN_SEGMENTS.split("/")
        .map(seg => {
            if (seg[0] === ":") {
                const key = seg.slice(1);
                const value = FROZEN_PARAMS[key];

                if (!assert(value)) {
                    throw new Error("path segments can't be falsy, got " + String(value));
                }

                usedParams.push(key);
                return encodeURIComponent(String(value));
            }

            return seg;
        })
        .join("/");

    // delete already used params to avoid them in the querystring
    usedParams.forEach(key => {
        delete FROZEN_PARAMS[key];
    });

    const query = new URLSearchParams({});

    Object.entries(FROZEN_PARAMS)
        // removes null, undefined
        .filter(([, param]) => assert(param))

        .forEach(([key, value]) => {
            if (Array.isArray(value)) {
                switch (FROZEN_SETTINGS.array) {
                    case "comma":
                        query.append(key, value.join(","));
                        break;
                    case "stringify":
                        query.append(key, JSON.stringify(value));
                        break;
                    default:
                        value.forEach(item => query.append(key, item));
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
