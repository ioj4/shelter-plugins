const {
	flux: { dispatcher: { dispatch } }
} = shelter;

export const open = (type, id) => window.open(`spotify:${type}:${id}`);

const BASE_URL = "https://api.spotify.com/v1/me/player";

const getAccount = () => Object.values(shelter.flux.stores.SpotifyStore.__getLocalVars().accounts)[0];

// const reauth = async () => {
//     getAccount().handleDeviceStateChange()
//     return new Promise(resolve => setTimeout(resolve, 1_000));

// }



const reauth = async () => {
    getAccount().handleDeviceStateChange()
    return new Promise(resolve => setTimeout(resolve, 1_000));

    dispatch({
        type: 'SPOTIFY_ACCOUNT_ACCESS_TOKEN_REVOKE',
        accountId: currentAccountId,
      });
      accounts[currentAccountId].accessToken = newAccessToken.body.access_token;
      dispatch({
        type: 'SPOTIFY_ACCOUNT_ACCESS_TOKEN',
        accountId: currentAccountId,
        accessToken: newAccessToken.body.access_token,
      });

}


const getToken = () => {
    const token = getAccount().accessToken;
    if (token) return token;
    shelter.util.log("No Spotify Token", "error");
    shelter.ui.showToast({title:'No Spotify Token', content: 'uhoh'});
}


const spotifyRequest = async (method, endpoint, body) => {
    const url = BASE_URL + endpoint
    return new Promise((resolve, reject) => {
        const options = {  
            method,
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${getToken()}`
            },
            body
        }
        fetch(url, options)
            .then(async res => {
                console.log(res)
                if (res.ok) {
                    resolve();
                    return;
                }
                if (res.status === 401) {
                    await reauth();
                    options.headers.Authorization = `Bearer ${getToken()}`;
                    fetch(url, options)
                        .then(res => {
                            if (res.ok) resolve();
                            reject();
                        })
                    return;
                }
                reject()
            })
    })
}

export const play = (type, id) => {
    spotifyRequest('PUT', `/play?device_id=${Object.values(shelter.flux.stores.SpotifyStore.__getLocalVars().playerDevices)[0][0].id}`, JSON.stringify({uris: [`spotify:${type}:${id}`]}))
    .then(() => shelter.ui.showToast({title: "success"}), () => shelter.ui.showToast({title: "no success"}))
}

export const queue = (type, id) => {
    spotifyRequest('POST', `/queue?uri=spotify:${type}:${id}&device_id=${Object.values(shelter.flux.stores.SpotifyStore.__getLocalVars().playerDevices)[0][0].id}`)
        .then(() => shelter.ui.showToast({title: "success"}), () => shelter.ui.showToast({title: "no success"}))
}