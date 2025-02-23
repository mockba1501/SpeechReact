import axios from 'axios';
import Cookie from 'universal-cookie';
const BASE_URL = process.env.REACT_APP_BASE_URL;
console.log('BASE_URL:', BASE_URL);

export async function getTokenOrRefresh() {
    const cookie = new Cookie();
    const speechToken = cookie.get('speech-token');

    if (speechToken === undefined) {
        try {
            const res = await axios.get(`${BASE_URL}/api/get-speech-token`);
            const token = res.data.token;
            const region = res.data.region;
            //console.log('Token fetched from backend:', token); // Log the token
            cookie.set('speech-token', region + ':' + token, {maxAge: 540, path: '/'});

            //console.log('Token fetched from back-end: ' + token);
            return { authToken: token, region: region };
        } catch (err) {
            console.log(err.response.data);
            return { authToken: null, error: err.response.data };
        }
    } else {
        console.log('Token fetched from cookie: ' + speechToken);
        const idx = speechToken.indexOf(':');
        return { authToken: speechToken.slice(idx + 1), region: speechToken.slice(0, idx) };
    }
}