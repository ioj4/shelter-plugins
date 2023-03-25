const {
    plugin: { store }
} = shelter;
import { classes } from "./image-modal.jsx.scss"

export default (props) => {
    props.url.searchParams.set("size", store.fullResolution ? "4096" : "512");
    const viewURL = props.url.toString();
    // when opening/downloading the image in the browser it should have the highest resolution
    props.url.searchParams.set("size", "4096");
    const browserURL = props.url.toString();

    return (
        <>
            <div class={classes.container}>
                <div class={classes.wrapper}>
                    <div class={classes.imageWrapper}>
                        <img class={classes.image} ioj4-opi src={viewURL}/>
                    </div>
                    <a href={browserURL} class={classes.downloadLink} rel="noreferrer noopener" target="_blank" tabIndex={0}>Open in Browser</a>
                </div>
            </div>
        </>
    );
}