import instance from "@/lib/axios";

type Profile = {
    avatar?: string | null;
    bio?: string | null;
    branch?: string;
    name?: string;
    phone?: string | null;
    year?: number;
}
const getMe = async () => {
    const response = await instance.get('/user/me');
    return response.data;
}

const verify = async (image: File) => {
    const formData = new FormData();
    formData.append('image', image);
    const response = await instance.post('/user/verify', formData);
    return response.data;
}

const update = async (data: Profile) => {
    const response = await instance.patch('/user', data);
    return response.data;
}

export {
    getMe,
    verify,
    update,
}