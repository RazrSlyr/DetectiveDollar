/**
 * @module ImagePickerUtils
 */

/**
 * @file Used for storing and generating SQLite commands. Allow separation of JavaScript from SQLite
 */

import * as ImagePicker from 'expo-image-picker';
import * as MediaLibrary from 'expo-media-library';

import { ALBUMNNAME, SELECTOPTIONS, CAPTUREOPTIONS } from '../constants/ImageConstants';

/**
 * Launches image library so the user can pick an image
 * @returns {string} The image uri of the selected image
 */
const pickImage = async () => {
    // No permissions request is necessary for launching the image library
    const result = await ImagePicker.launchImageLibraryAsync(SELECTOPTIONS);

    console.log(result);

    if (result.canceled) {
        return null;
    }
    return result.assets[0].uri;
};

/**
 * Launches camera so the user can take a picture
 * @returns {string} The image uri of picture the user took (null if canceled)
 */
const captureImage = async () => {
    const result = await ImagePicker.launchCameraAsync(CAPTUREOPTIONS);

    console.log(result);

    if (result.canceled) {
        return null;
    }
    return result.assets[0].uri;
};

/**
 *
 * @param {string} imageURI Image uri of the image that will be saved in the camera roll
 * @param {string} album The album title to save the image to (default is null)
 */
const saveToCameraRoll = async (imageURI, album = null) => {
    const assetRef = await MediaLibrary.createAssetAsync(imageURI);

    if (album) {
        try {
            const albumRef = await MediaLibrary.getAlbumAsync(album);
            if (albumRef === null) {
                await MediaLibrary.createAlbumAsync(ALBUMNNAME, assetRef, false);
            } else {
                await MediaLibrary.addAssetsToAlbumAsync(assetRef, albumRef, false);
            }
            console.log('Image moved succesfully');
        } catch (error) {
            console.log(error);
            return null;
        }
    }
};
export { pickImage, captureImage, saveToCameraRoll };
