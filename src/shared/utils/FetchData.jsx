import { httpClient } from "./HttClient";

export async function fetchData(url, token, args = null) {
    try {
        const response = await httpClient.get(url, token);
        if (args !== null) {
            const data = Array.isArray(response)
                ? response.find(item => item.id === args && item.token === token)
                : null;
            return data;
        }
        const user = Array.isArray(response) ? response.find(item => item.token === token) : null;
        return user?.data;
    } catch (error) {
        return null;
    }
}
