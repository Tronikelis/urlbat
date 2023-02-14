const joinParts = (...parts: string[]) => {
    const filtered = parts.filter(part => part.length > 0);
    if (filtered.length === 1) return filtered[0];

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

    parts.forEach(part => {
        alternate = !alternate;

        if (alternate) {
            if (part[part.length - 1] === "/") {
                url += part;
                return;
            }
            url += part + "/";
            return;
        }

        if (part[0] === "/") {
            url += part.slice(1);
            return;
        }

        url += part;
    });

    const lastPart = parts[parts.length - 1];
    // if the last part does not have "/" then the url should not have it either
    while (lastPart[lastPart.length - 1] !== "/" && url[url.length - 1] === "/") {
        url = url.slice(0, -1);
    }

    return url;
};

export default joinParts;
