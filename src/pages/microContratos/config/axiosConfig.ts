import { URLBaseContratos, URLBaseMaestros } from '@/config/axios/axiosContratos';
import useLoadingStore from '@/zustand/shared/useLoadingStore';
import axios from 'axios'


const axiosConfig = () => {
  return (
    null
  )
}

export default axiosConfig

const axiosContratos = axios.create({
    baseURL: URLBaseContratos(),
    timeout: 100000,
    headers: { 'X-Custom-Header': 'foobar' }
});

const axiosMaestros = axios.create({
    baseURL: URLBaseMaestros(),
    timeout: 100000,
    headers: { 'X-Custom-Header': 'foobar' }
});


axiosMaestros.interceptors.request.use((config) => {
  if (config.method === 'post' || config.method === 'put') {
      useLoadingStore.getState().setLoadingAxios(true);
    }
  return config;
});

axiosMaestros.interceptors.response.use(
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
axiosContratos.interceptors.request.use((config) => {
  if (config.method === 'post' || config.method === 'put') {
      useLoadingStore.getState().setLoadingAxios(true);
    }
  return config;
});

axiosContratos.interceptors.response.use(
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
export {axiosContratos, axiosMaestros}
