import instance from "@/lib/axios-user";

type UpdateProfileData = {
    name?: string;
    bio?: string | null;
    phone?: string;
    branch?: string;
    year?: number;
    avatar?: File | null;
}
const getMe = async () => {
    const response = await instance.get('/users/me');
    return response.data;
}

const verify = async (image: File) => {
    const formData = new FormData();
    formData.append('image', image);
    const response = await instance.post('/users/verify', formData, {
        headers: {
            'Content-Type': undefined
        }
    });
    return response.data;
}

const update = async (data: UpdateProfileData) => {
    if (data.avatar) {
        const formData = new FormData();
        Object.entries(data).forEach(([key, value]) => {
            if (value !== null && value !== undefined) {
                if (key === 'avatar' && value instanceof File) {
                    formData.append(key, value);
                } else if (key !== 'avatar') {
                    formData.append(key, String(value));
                }
            }
        });
        const response = await instance.patch('/users', formData, { headers: { 'Content-Type': undefined } });
        return response.data;
    }

    const response = await instance.patch('/users', data, { headers: { 'Content-Type': 'application/json' } });
    return response.data;
}

export {
    getMe,
    verify,
    update,
}