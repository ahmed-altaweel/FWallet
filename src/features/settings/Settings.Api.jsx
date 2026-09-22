import {
    initialize,
    getUserData,
    updateUserData
} from "@/shared/utils/mock/MockStore";


export async function getProfile(token) {

    await initialize(
        "profile",
        "userProfileData.json",
        token
    );

     return getUserData("profile", token);
}

export async function updateProfile(token, profileData) {

    await initialize(
        "profile",
        "userProfileData.json",
        token
    );

    updateUserData(
        "profile",
        token,
        profileData
    );

    return profileData;
}