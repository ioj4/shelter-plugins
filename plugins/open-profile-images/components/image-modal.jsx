import classes from "../styles.jsx.scss";

export default ({ url }) => {
    url.searchParams.set("size", "4096");
    const viewUrl = url.toString();

    // to .png extension
    const browserURL = viewUrl.replace(/\.(webp)($|\?)/, ".png$2");

    return (
        <>
            <div class={classes.wrapper}>
                <img class={classes.image} src={viewUrl} />
                <a
                    href={browserURL}
                    class={classes.link}
                    rel="noreferrer noopener"
                    target="_blank"
                >
                    Open in Browser
                </a>
            </div>
        </>
    );
};
