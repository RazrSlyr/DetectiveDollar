/**
 * @module ImageUtils
 */

/**
 * @file Contains various utility functions for storing, getting, and capturing images
 */
import * as FileSystem from 'expo-file-system';
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

/**
 * Gets the path of the image directory, creating it if it doesn't exist
 * @returns The image directory path
 */
async function getImageDirectory() {
    const specificDirectory = ALBUMNNAME;
    const directory = `${FileSystem.documentDirectory}${specificDirectory}/`;

    // Check if the directory exists, if not, create it
    const directoryInfo = await FileSystem.getInfoAsync(directory);

    if (!directoryInfo.exists) {
        await FileSystem.makeDirectoryAsync(directory, { intermediates: true });
    }
    return directory;
}

/**
 * Saves an image to the image directory
 * @param {string} imageURI The uri of the image to save
 */
async function saveImage(imageURI) {
    if (!imageURI) {
        return null;
    }
    const dir = await getImageDirectory();
    const fileName = `IMG_${Date.now()}.jpg`;
    const newImageUri = `${dir}${fileName}`;
    try {
        await FileSystem.moveAsync({
            from: imageURI,
            to: newImageUri,
        });

        console.log('Image saved:', newImageUri);
        return newImageUri;
    } catch (error) {
        console.error('Error saving image:', error);
        return null;
    }
}

/**
 * Deletes an image from the image directory
 * @param {string} imageURI The uri of the image to delete
 */
async function deleteImage(imageURI) {
    if (!imageURI) {
        return;
    }
    try {
        await FileSystem.deleteAsync(imageURI, { intermediates: true });
        console.log('Image deleted');
    } catch (error) {
        console.error('Error deleting image:', error);
    }
}

export { pickImage, captureImage, saveToCameraRoll, saveImage, deleteImage };
