import axios from 'axios';
import Cookie from 'universal-cookie';

const BASE_URL = import.meta.env.VITE_BASE_URL;

let tokenPromise:Promise<AuthResult> | null = null; // Cache the ongoing token request

export async function getTokenOrRefresh(): Promise<AuthResult> {
    const cookie = new Cookie();
    const speechToken = cookie.get('speech-token') as string | undefined;
    
     // Return cached promise if request is already in progress
    if (tokenPromise) {
        return tokenPromise;
    }

    if (speechToken === undefined) {
        try {
            tokenPromise = axios.get<TokenResponse>(`${BASE_URL}/api/get-speech-token`)
            .then(res => {
                if (!res.data || !res.data.token || !res.data.region) {
                    throw new Error("Invalid response from token service");
                }
                const token = res.data.token;
                const region = res.data.region;
                cookie.set('speech-token', region + ':' + token, {maxAge: 540, path: '/'});

                tokenPromise = null; // Reset after completion
                
                return { authToken: token, region: region };
            })
            .catch(err => {
                console.error("Error fetching speech token:", err);
                tokenPromise = null;

                return { authToken: null, region: null, error: "Invalid token" };
            });
            return await tokenPromise;
        } catch (err) {
            const error = err instanceof Error ? err.message : "Unexpected error";
            console.error("Unexpected error in getTokenOrRefresh:", err);
            return { authToken: null, region: null, error: error};
        }
    } else {
        const idx = speechToken.indexOf(':');
        return { authToken: speechToken.slice(idx + 1), region: speechToken.slice(0, idx) };
    }
}