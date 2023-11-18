import * as ImagePicker from 'expo-image-picker';
import * as MediaLibrary from 'expo-media-library';

import { ALBUMNNAME, SELECTOPTIONS, CAPTUREOPTIONS } from '../constants/ImageConstants';

const pickImage = async () => {
    // No permissions request is necessary for launching the image library
    const result = await ImagePicker.launchImageLibraryAsync(SELECTOPTIONS);

    console.log(result);

    if (result.canceled) {
        return null;
    }
    return result.assets[0].uri;
};
const captureImage = async () => {
    // No permissions request is necessary for launching the image library
    const result = await ImagePicker.launchCameraAsync(CAPTUREOPTIONS);

    console.log(result);

    if (result.canceled) {
        return null;
    }
    return result.assets[0].uri;
};
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
