import * as MediaLibrary from 'expo-media-library';

import { ALBUMNNAME } from '../constants/ImageConstants';
export const saveImageToAlbum = async (asset, create) => {
    if (!asset || asset === '') {
        console.error('Improper Image URI');
        return null;
    }
    const { mediaLibraryStatus } = await MediaLibrary.requestPermissionsAsync();
    if (!(mediaLibraryStatus === 'granted')) {
        console.error('Media Library permission not granted');
        throw new Error('Media Library permission not granted');
    }
    try {
        let assetRef = asset;
        if (create) {
            assetRef = await MediaLibrary.createAssetAsync(asset.uri);
        }
        const albumRef = await MediaLibrary.getAlbumAsync(ALBUMNNAME);
        if (albumRef === null) {
            await MediaLibrary.createAlbumAsync(ALBUMNNAME, assetRef, false);
        } else {
            await MediaLibrary.addAssetsToAlbumAsync([assetRef], albumRef, false);
        }
        const albumAssets = await MediaLibrary.getAssetsAsync({
            album: albumRef,
            first: 1,
            sortBy: MediaLibrary.SortBy.creationTime,
        });
        if (albumAssets !== undefined || (albumAssets !== null && albumAssets.length > 0)) {
            const asset_uri = albumAssets.assets[0].uri;
            console.log('asset_uri: ' + asset_uri);
            return asset_uri;
        }
    } catch (e) {
        console.log(e);
    }
    return null;
};
