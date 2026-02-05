import axiosInstance from "./axiosInstance"

export const createPostRequest = (postData: FormData) => {
    return axiosInstance.post('/api/exhibits', postData)
}

export const myPostsRequest = () => {
    return axiosInstance.get('/api/exhibits/my-posts')
}

export const allPostsRequest = () => {
    return axiosInstance.get('/api/exhibits')
}

export const deletePostRequest = (id: number) => {
    return axiosInstance.delete(`/api/exhibits/${id}`)
}