import type { IUserData } from "../interfaces/userData"
import axiosInstance from "./axiosInstance"

export const loginRequest = (data: IUserData) => {
    return axiosInstance.post('/api/auth/login', data)
}

export const registerRequest  = (data: IUserData) => {
    return axiosInstance.post('/users/register', data)
}

export const getMyProfileInfoRequest = () => {
    return axiosInstance.get('/users/my-profile')
}