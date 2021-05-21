import {SET_USER,SET_CHANNEL,ADD_FAVORITECHANNEL,REMOVE_FAVORITECHANNEL} from "./actiontypes"

export const setUser = (user) => {
    return {
        type: SET_USER,
        payload: {
            currentUser: user
        }
    }
}

export const setChannel = (channel) => {
    return {
        type: SET_CHANNEL,
        payload: {
            currentChannel: channel
        }
    }
}

export const addFavoriteChannel = (channel) => {
    return {
        type: ADD_FAVORITECHANNEL,
        payload: {
            favoriteChannel: channel
        }
    }
}

export const removeFavoriteChannel = (channel) => {
    return {
        type: REMOVE_FAVORITECHANNEL,
        payload: {
            favoriteChannel: channel
        }
    }
}