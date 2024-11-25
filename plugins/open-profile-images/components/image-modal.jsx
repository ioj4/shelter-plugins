import classes from "../styles.jsx.scss";
const {
    solid: { createSignal }
} = shelter;

export default ({ url }) => {
    const [isLoaded, setIsLoaded] = createSignal(false);

    const lowResUrl = url.toString();
    const isBanner = url.pathname.startsWith("/banners/");

    url.searchParams.set("size", "4096");
    const fullResUrl = url.toString();

    const preloadImage = new Image();
    preloadImage.onload = () => setIsLoaded(true);
    preloadImage.src = fullResUrl;

    // to .png extension
    const browserURL = fullResUrl.replace(/\.(webp)($|\?)/, ".png$2");

    return (
        <>
            <div class={classes.wrapper}>
                <img
                    class={`${classes.image} ${isBanner ? classes.banner : ""}`}
                    src={isLoaded() ? fullResUrl : lowResUrl}
                />
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
