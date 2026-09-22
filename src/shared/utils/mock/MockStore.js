import { fetchData } from "../FetchData";

const STORAGE_PREFIX = "fwallet_";


function getStorageKey(resource, token) {
    return `${STORAGE_PREFIX}${resource}_${token}`;
}


export function read(resource, token) {
    const key = getStorageKey(resource, token);

    const storedData = localStorage.getItem(key);

    if (!storedData) {
        return null;
    }

    try {
        return JSON.parse(storedData);
    } catch (error) {
        console.error(
            `Failed to parse ${resource}:`,
            error
        );

        return null;
    }
}


export function write(resource, token, data) {
    const key = getStorageKey(resource, token);

    localStorage.setItem(
        key,
        JSON.stringify(data)
    );

    return data;
}

export function remove(resource, token) {
    const key = getStorageKey(resource, token);
    localStorage.removeItem(key);
}


export function clear() {
    Object.keys(localStorage)
        .filter(key =>
            key.startsWith(STORAGE_PREFIX)
        )
        .forEach(key =>
            localStorage.removeItem(key)
        );
}


export function getUserData(resource, token) {
    return read(resource, token);
}


export function updateUserData(
    resource,
    token,
    newData
) {
    write(resource, token, newData);
    return newData;
}


export async function initialize(
    resource,
    seedUrl,
    token
) {
    const existingData = read(resource, token);

    if (existingData !== null) {
        return existingData;
    }

    const seedData = await fetchData(
        seedUrl,
        token
    );

    if (seedData === null || seedData === undefined) {
        console.error(
            `Failed to initialize ${resource} for the given token.`
        );

        throw new Error(`Failed to initialize ${resource}.`);
    }

    console.log(
        `Successfully fetched and parsed data for ${resource} via fetchData.`
    );

    write(resource, token, seedData);

    console.log(
        `Data for ${resource} initialized successfully.`
    );

    return seedData;
}