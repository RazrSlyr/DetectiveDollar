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
    const assetURI = await moveImage(result.assets[0].uri, false);
    return assetURI;
};
const captureImage = async () => {
    // No permissions request is necessary for launching the image library
    const result = await ImagePicker.launchCameraAsync(CAPTUREOPTIONS);

    console.log(result);

    if (result.canceled) {
        return null;
    }
    const asset = await moveImage(result.assets[0].uri, false);
    return asset;
};
const deleteImageAsset = async (asset) => {
    try {
        await MediaLibrary.deleteAssetsAsync(asset);
        console.log('deleted image Asset');
    } catch (error) {
        console.log(error);
    }
};
const moveImage = async (imageURI, copy = true) => {
    console.log('Moving to Album: ', imageURI);
    const assetRef = await MediaLibrary.createAssetAsync(imageURI);
    const albumRef = await MediaLibrary.getAlbumAsync(ALBUMNNAME);
    //copy asset to album
    try {
        if (albumRef === null) {
            await MediaLibrary.createAlbumAsync(ALBUMNNAME, assetRef, copy);
        } else {
            await MediaLibrary.addAssetsToAlbumAsync(assetRef, albumRef, copy);
        }
        console.log('Image moved succesfully');
    } catch (error) {
        console.log(error);
        return null;
    }
    //get latest asset in album
    const albumAssets = await MediaLibrary.getAssetsAsync({
        album: albumRef,
        first: 1,
        sortBy: [MediaLibrary.SortBy.creationTime],
    });
    if ((albumAssets !== undefined || albumAssets !== null) && albumAssets.assets.length > 0) {
        return albumAssets.assets[0];
    }
    console.error('not assets in album: ', albumAssets);
    return null;
};
export { pickImage, captureImage, deleteImageAsset };
