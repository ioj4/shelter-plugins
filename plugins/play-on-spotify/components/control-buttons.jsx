const {
    plugin: { store },
} = shelter;
import { open, queue, play } from '../spotify';

import { classes } from '../styles.jsx.scss';

const IconOpen = () => (
    <svg
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
    >
        <path
            d="M11.6438 2.15465C11.4612 2.19322 11.2874 2.28356 11.1453 2.42565L7.59106 5.97985C7.4563 6.36608 7.54272 6.81285 7.85181 7.12194C8.17065 7.44078 8.63647 7.52281 9.03101 7.36803L10.8528 5.54674V13.0223C10.8528 13.5746 11.3 14.0223 11.8528 14.0223C12.405 14.0223 12.8528 13.5746 12.8528 13.0223V5.54674L14.6746 7.36901C15.0691 7.52281 15.5344 7.44078 15.8528 7.12194C16.1624 6.81285 16.2488 6.36559 16.113 5.97887L12.5598 2.42565C12.3113 2.17711 11.9641 2.08678 11.6438 2.15465Z"
            fill="currentColor"
        />
        <path
            d="M4.18774 8.0775C3.6355 8.0775 3.18774 8.52526 3.18774 9.0775V20.8671C3.18774 21.4193 3.6355 21.8671 4.18774 21.8671H19.8123C20.3645 21.8671 20.8123 21.4193 20.8123 20.8671V9.0775C20.8123 8.52526 20.3645 8.0775 19.8123 8.0775H16.8743V10.0775H18.8123V19.8671H5.18774V10.0775H6.83032V8.0775H4.18774Z"
            fill="currentColor"
        />
    </svg>
);

const IconQueue = () => (
    <svg
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
    >
        <path
            d="M4.02637 1.04321H6.02637V4.04321H9.02637V6.04321H6.02637V9.04321H4.02637V6.04321H1.02637V4.04321H4.02637V1.04321Z"
            fill="currentColor"
        />
        <path
            d="M12.0776 5.53198C12.0493 5.76099 12.0103 5.98657 11.9604 6.20825H19.1411C19.7939 6.20825 20.3237 6.73804 20.3237 7.39087C20.3237 8.0437 19.7939 8.57349 19.1411 8.57349H10.9424C10.48 9.26099 9.89844 9.86206 9.22754 10.3474C8.92041 10.5696 8.59473 10.7673 8.25293 10.9382H19.4263C21.3853 10.9382 22.9736 9.34985 22.9736 7.39087C22.9736 5.43188 21.3853 3.84351 19.4263 3.84351H12.0815C12.1133 4.11499 12.1299 4.39136 12.1299 4.67163C12.1299 4.96265 12.1123 5.24976 12.0776 5.53198Z"
            fill="currentColor"
        />
        <path
            d="M22.0928 14.8972H4.05469V17.262H22.0928V14.8972Z"
            fill="currentColor"
        />
        <path
            d="M4.05469 20.592H22.0928V22.9568H4.05469V20.592Z"
            fill="currentColor"
        />
    </svg>
);

const IconPlay = () => (
    <svg
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
    >
        <path
            fill-rule="evenodd"
            clip-rule="evenodd"
            d="M12 24C18.6274 24 24 18.6274 24 12C24 5.37258 18.6274 0 12 0C5.37258 0 0 5.37258 0 12C0 18.6274 5.37258 24 12 24ZM9.04596 8.19684V15.8123C9.04596 16.1973 9.4628 16.4378 9.79614 16.2452L16.3167 12.477C16.6481 12.2855 16.6502 11.8079 16.3206 11.6134L9.80004 7.76621C9.46673 7.56955 9.04596 7.80984 9.04596 8.19684Z"
            fill="currentColor"
        />
    </svg>
);

export default function (props) {
    return (
        <div class={classes.container}>
            {store.showOpen && (
                <button
                    class={classes.button}
                    title="Open in Spotify"
                    onClick={() => open(props.type, props.id)}
                >
                    <IconOpen />
                </button>
            )}
            {store.showQueue && (
                <button
                    class={classes.button}
                    title="Add to queue"
                    onClick={() => queue(props.type, props.id)}
                >
                    <IconQueue />
                </button>
            )}
            {store.showPlay && (
                <button
                    class={classes.button}
                    title="Play in Spotify"
                    onClick={() => play(props.type, props.id)}
                >
                    <IconPlay />
                </button>
            )}
        </div>
    );
}
