import * as MediaLibrary from 'expo-media-library';

import { ALBUMNNAME } from '../constants/ImageConstants';
export const saveImageToAlbum = async (image_uri) => {
    if (!image_uri || image_uri === '') {
        console.error('Improper Image URI');
        return null;
    }
    const { mediaLibraryStatus } = await MediaLibrary.requestPermissionsAsync();
    if (!(mediaLibraryStatus === 'granted')) {
        console.error('Media Library permission not granted');
        throw new Error('Media Library permission not granted');
    }
    const asset = await MediaLibrary.createAssetAsync(image_uri);
    const album = await MediaLibrary.getAlbumAsync(ALBUMNNAME);
    try {
        if (album === null) {
            await MediaLibrary.createAlbumAsync(ALBUMNNAME, asset, false);
        } else {
            await MediaLibrary.addAssetsToAlbumAsync([asset], album, false);
        }
    } catch (e) {
        console.log(e);
        throw e;
    }

    alert('Picture saved to app files!');
    console.log(asset.uri);
    return asset.uri;
};
