import axios from "axios";
import {jwtDecode} from 'jwt-decode';

export const productsApi = axios.create({
    baseURL: "http://localhost:8082/product"
})
productsApi.interceptors.request.use(request => {
    const token = localStorage.getItem('jwt');
    if (token) {
        const { exp } = jwtDecode(token);
        if (Date.now() >= exp * 1000) {
            // Token is expired
            localStorage.removeItem('jwt');
            window.location.href = '/login'; // Redirect to auth page
            return Promise.reject(new Error('Token expired'));
        }
        request.headers.Authorization = `Bearer ${token}`;
    }
    return request;
})

export const deleteProduct = (id) => {
    return productsApi.get(`/delete/${id}`)
}

export const getProducts = async () => {
    const {data} = await productsApi.get('/getAll');
    return Array.isArray(data) ? data : []; // Ensure the response is an array
};

export const addProduct = (product) => {
    return productsApi.post(`/add`, product)
}

export const updateProduct = (id, product) => {
    return productsApi.put(`/update/${id}`, product)
}

export const getProductById = (id) => {
    return productsApi.get(`/get/${id}`)
}