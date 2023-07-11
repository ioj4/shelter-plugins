const {
    flux: { intercept }
} = shelter;

let unintercept;

export function onLoad() {
    unintercept = intercept((dispatch) => {
        if (dispatch?.type === "UPLOAD_ATTACHMENT_ADD_FILES") {
            dispatch?.files?.forEach(({ file }) => {
                // change the root name of the file to current epoch time
                Object.defineProperty(file, "name", {
                    value: file?.name?.replace(
                        // capture up to amount within curly bracket quantifier
                        new RegExp(
                            "^(.{" +
                            (
                                // check if filename includes a dot
                                file.name.includes(".") ?
                                // if so, use its last index in the quantifier
                                file.name.lastIndexOf(".") :
                                // if not, use filename length in the quantifier
                                file.name.length
                            )
                            + "})"
                        ),
                        // denote timestamp as the new value for captured text
                        Date.now().toString()
                    )
                });
            });
            return dispatch;
        }
    });
}

export function onUnload() {
    unintercept();
}
