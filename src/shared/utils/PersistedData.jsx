import { initialize, getUserData, updateUserData } from "./mock/MockStore";


export async function fetchPersistedData(resource, seedUrl, token, args = null) {
    if (!token) return null;

    try {
        await initialize(resource, seedUrl, token);
    } catch (error) {
        return null;
    }

    const data = getUserData(resource, token);

    if (args !== null) {
        return Array.isArray(data)
            ? data.find(item => item.id === args)
            : null;
    }

    return data;
}


export function savePersistedData(resource, token, newData) {
    return updateUserData(resource, token, newData);
}