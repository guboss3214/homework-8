import axiosInstance from "./axiosInstance"

export const addCommentRequest = (id: number, text: string) => {
    return axiosInstance.post(`/api/exhibits/${id}/comments`, { text })
}

export const getCommentRequest = (id: number) => {
    return axiosInstance.get(`/api/exhibits/${id}/comments`)
}

export const deleteCommentRequest = (exhibitId: number, commentId: number) => {
    return axiosInstance.delete(`/api/exhibits/${exhibitId}/comments/${commentId}`)
}