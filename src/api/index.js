import axios from "axios"

const api = axios.create({baseURL: import.meta.env.VITE_API_URL})

api.interceptors.request.use(req => {
    const profile = localStorage.getItem("profile");
    if(profile){
        const authToken = JSON.parse(profile)
        req.headers.Authorization = `Bearer ${authToken.token}`
    }
    return req;
})

export const fetchStories = async () => await api.get(`/stories`)
export const CreateStory = async (story) => await api.post("/stories",story)
export const updateStory = async (id,story) => await api.patch(`${"/stories"}/${id}`, story)
export const deleteStory = async (id) => await api.delete(`${"/stories"}/${id}`)
export const likeStroy = async (id) => await api.patch(`${"/stories"}/${id}/likeStroy`)

export const signin = async (formValues) => await api.post("/user/signin", formValues)
export const signup = async (formValues) => await api.post("/user/signup", formValues)