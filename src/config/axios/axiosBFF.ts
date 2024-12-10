import axios from 'axios'

//TODO: externalizar configuracion
export const URLBaseBFF = () => {
    let URLBase = 'https://localhost:5000'
    if (typeof window !== 'undefined') {
        URLBase = window.location.origin
    }

    return URLBase
}

const axiosBFF = axios.create({
    baseURL: URLBaseBFF(),
    timeout: 100000,
    headers: { 'X-Custom-Header': 'foobar' }
});

// Interceptor de respuestas
axiosBFF.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        console.log('error', error)
        //if (error.response && error.response.status === 401) {
        //    console.log('error', error)
        //}
        return Promise.reject(error);
    }
);

export { axiosBFF }
