const {
    flux: { intercept }
} = shelter;

let unintercept;

export function onLoad() {
    unintercept = intercept((dispatch) => {
        if (dispatch?.type === "UPLOAD_ATTACHMENT_ADD_FILES") {
            dispatch?.files?.forEach(({ file }) => {
                Object.defineProperty(file, "name", {
                    // change the filename to current timestamp
                    value: file?.name?.replace(/^([^.]+)/, Date.now().toString())
                });
            });
            return dispatch;
        }
    });
}

export function onUnload() {
    unintercept();
}