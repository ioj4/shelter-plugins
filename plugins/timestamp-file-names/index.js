const {
    flux: { intercept },
    plugin: { store }
} = shelter;

let unintercept;

export function onLoad() {
    store.matchDotSeperators ??= false;

    unintercept = intercept((dispatch) => {
        if (dispatch?.type === "UPLOAD_ATTACHMENT_ADD_FILES") {
            dispatch?.files?.forEach(({ file }) => {
                if (!file?.name) return;

                // current epoch time
                let newFilename = Date.now().toString();

                if (file.name.includes(".")) {
                    const dotIndex = store.matchDotSeparators
                        ? file.name.lastIndexOf(".")
                        : file.name.indexOf(".");

                    // append file extension(s)
                    newFilename += file.name.slice(dotIndex);
                }

                Object.defineProperty(file, "name", {
                    value: newFilename
                });
            });
            return dispatch;
        }
    });
}

export function onUnload() {
    unintercept();
}

export { default as settings } from "./settings";
