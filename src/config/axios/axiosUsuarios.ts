import useLoadingStore from '@/zustand/shared/useLoadingStore'
import axios from 'axios'

export const URLBaseUsuarios = () => {
    let URLBase = 'https://localhost:7081/api/usuarios/v1'
    if (typeof window !== 'undefined') {
        URLBase = window.location.origin + '/api/usuarios/v1'
    }

    return URLBase
}

const axiosUsuarios = axios.create({
    baseURL: URLBaseUsuarios(),
    timeout: 100000,
    headers: { 'X-Custom-Header': 'foobar' }
});

  axiosUsuarios.interceptors.request.use((config) => {
    if (config.method === 'post' || config.method === 'put') {
        useLoadingStore.getState().setLoadingAxios(true);
      }
    return config;
  });
  
  axiosUsuarios.interceptors.response.use(
    (response) => {
        if (response.config.method === 'post' || response.config.method === 'put') {
            useLoadingStore.getState().setLoadingAxios(false);
          }
      return response;
    },
    (error) => {
        if (error.config && (error.config.method === 'post' || error.config.method === 'put')) {
            useLoadingStore.getState().setLoadingAxios(false);
          }
      return Promise.reject(error);
    }
  );
export { axiosUsuarios }
