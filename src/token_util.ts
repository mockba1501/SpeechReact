import axios from 'axios';
import Cookie from 'universal-cookie';

const BASE_URL = import.meta.env.VITE_BASE_URL;
//console.log('BASE_URL:', BASE_URL);
let tokenPromise = null; // Cache the ongoing token request

export async function getTokenOrRefresh() {
    const cookie = new Cookie();
    const speechToken = cookie.get('speech-token');
    //console.log('Token fetched from cookie: ' + speechToken);
    
     // Return cached promise if request is already in progress
    if (tokenPromise) {
        return tokenPromise;
    }

    if (speechToken === undefined) {
        try {
            tokenPromise = await axios.get(`${BASE_URL}/api/get-speech-token`)
            .then(res => {
                if (!res.data || !res.data.token || !res.data.region) {
                    throw new Error("Invalid response from token service");
                }
                const token = res.data.token;
                const region = res.data.region;
                //console.log('Token fetched from backend:', token); // Log the token
                //console.log('Token fetched from backend:'); // Log the token
                cookie.set('speech-token', region + ':' + token, {maxAge: 540, path: '/'});

                //console.log('Token fetched from back-end: ' + token + ' region: ' + region);
                tokenPromise = null; // Reset after completion
                
                //return { authToken: null, region: null, error: "Invalid token" };
                return { authToken: token, region: region };
            })
            .catch(err => {
                console.error("Error fetching speech token:", err);
                tokenPromise = null;
                return { authToken: null, region: null, error: "Invalid token" };
                //throw err;
            });
            return await tokenPromise;
        } catch (err) {
            console.error("Unexpected error in getTokenOrRefresh:", err);
            return { authToken: null, error: err.response.data || "Unexpected error"};
        }
    } else {
        //console.log('Token fetched from cookie: ' + speechToken);
        //console.log('Token fetched from cookie: ');
        const idx = speechToken.indexOf(':');
        return { authToken: speechToken.slice(idx + 1), region: speechToken.slice(0, idx) };
    }
}