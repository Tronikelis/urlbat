const joinParts = (...parts: string[]) => {
    let url = "";
    let alternate = false;

    // for (let i = 1; i < parts.length; i += 2) {
    //   let [one, two] = [parts[i - 1], parts[i]];

    //   if (one[one.length - 1] === "/") {
    //     one = one.slice(0, one.length - 1);
    //   }

    //   if (two[0] !== "/") {
    //     two = "/" + two;
    //   }

    //   url += one + two;
    // }

    for (const part of parts) {
        alternate = !alternate;

        if (alternate) {
            if (part[part.length - 1] === "/") {
                url += part;
                continue;
            }
            url += part + "/";
            continue;
        }

        if (part[0] === "/") {
            url += part.slice(1);
            continue;
        }

        url += part;
    }

    return url;
};

export default joinParts;
