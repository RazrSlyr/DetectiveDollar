import { AntDesign, Feather } from '@expo/vector-icons';
import { Camera } from 'expo-camera';
import * as ImagePicker from 'expo-image-picker';
import { Image } from 'expo-image';
import * as MediaLibrary from 'expo-media-library';
import React, { useState, useEffect, useRef } from 'react';
import {
    TouchableOpacity,
    StyleSheet,
    Text,
    View,
    Dimensions,
    SafeAreaView,
    Modal,
} from 'react-native';

/* TODO change to use ImagePicker */
import { ALBUMNNAME, CAPTUREOPTIONS } from '../constants/ImageConstants';

const CameraComponent = ({ isVisible, onClose, onPictureTaken }) => {
    const cameraRef = useRef(null);
    const [hasCameraPermission, setHasCameraPermission] = useState();
    const [hasMediaLibraryPermission, setMediaLibraryPermission] = useState();
    const [photo, setPhoto] = useState();

    useEffect(() => {
        (async () => {
            const cameraPermission = await Camera.requestCameraPermissionsAsync();
            const mediaLibaryPermission = await MediaLibrary.requestPermissionsAsync();
            setHasCameraPermission(cameraPermission.status === 'granted');
            setMediaLibraryPermission(mediaLibaryPermission.status === 'granted');
        })();
    }, []);

    const takePicture = async () => {
        if (hasCameraPermission === undefined) {
            return <Text>Requesting permissions...</Text>;
        } else if (!hasCameraPermission) {
            return <Text>Permission for camera not granted. Please change this in settings.</Text>;
        }
        if (cameraRef) {
            try {
                const newPhoto = await cameraRef.current.takePictureAsync(CAPTUREOPTIONS);
                console.log(newPhoto.uri);
                setPhoto(newPhoto);
            } catch (e) {
                console.log(e);
            }
        }
    };
    const usePicture = async () => {
        if (!hasMediaLibraryPermission) {
            console.error('Missing Media Library Permission');
            setPhoto(null);
            onPictureTaken(null);
            return;
        }
        const assetRef = await MediaLibrary.createAssetAsync(photo.uri);
        const albumRef = await MediaLibrary.getAlbumAsync(ALBUMNNAME);
        //copy asset to album
        try {
            if (albumRef === null) {
                await MediaLibrary.createAlbumAsync(ALBUMNNAME, assetRef, true);
            } else {
                await MediaLibrary.addAssetsToAlbumAsync(assetRef, albumRef, true);
            }
            console.log('image moved succesfully');
        } catch (error) {
            console.log(error);
            setPhoto(null);
            throw error;
        }
        setPhoto(null);
        //get latest asset in album
        const albumAssets = await MediaLibrary.getAssetsAsync({
            album: albumRef,
            first: 1,
            sortBy: MediaLibrary.SortBy.creationTime,
        });
        if (albumAssets !== undefined || (albumAssets !== null && albumAssets.length > 0)) {
            const asset_uri = albumAssets.assets[0].uri;
            console.log('asset_uri: ' + asset_uri);
            onPictureTaken(asset_uri);
            return;
        }
        console.error('No files in Album');
    };
    return (
        <Modal animationType="slide" transparent={false} visible={isVisible}>
            <View style={{ flex: 1 }}>
                {photo ? (
                    <View style={styles.container}>
                        <Image style={styles.preview} source={{ uri: photo.uri }} />
                        <View
                            style={{
                                position: 'absolute',
                                top: 20,
                                right: 20,
                                alignSelf: 'right',
                            }}>
                            <TouchableOpacity
                                onPress={() => {
                                    console.log('retake photo');
                                    setPhoto(undefined);
                                }}>
                                <Feather name="x-circle" size={50} color="white" />
                            </TouchableOpacity>
                        </View>
                        <View style={{ position: 'absolute', bottom: 10, alignSelf: 'center' }}>
                            <TouchableOpacity onPress={usePicture}>
                                <AntDesign name="checkcircle" size={50} color="white" />
                            </TouchableOpacity>
                        </View>
                    </View>
                ) : (
                    <Camera style={{ flex: 1 }} ref={cameraRef}>
                        <View style={{ flex: 1, justifyContent: 'flex-end', alignItems: 'center' }}>
                            <TouchableOpacity onPress={takePicture}>
                                <Text style={{ fontSize: 18, marginBottom: 10, color: 'white' }}>
                                    Take Picture
                                </Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={onClose}>
                                <Text style={{ fontSize: 18, marginBottom: 20, color: 'white' }}>
                                    Cancel
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </Camera>
                )}
            </View>
        </Modal>
    );
};

export default CameraComponent;
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#37c871',
        alignItems: 'center',
    },
    button: {
        color: '#ffffff',
        fontFamily: 'Roboto-Bold',
        fontSize: 20,
        width: 250,
        height: 40,
        outlineColor: '#37c871',
        borderColor: '#37c871',
        borderRadius: 10,
        textAlign: 'center',
    },
    buttonContainer: {
        backgroundColor: '#37c871',
        padding: 10,
        borderRadius: 10,
        height: 60,
    },
    preview: {
        flex: 1,
        contentFit: 'contain',
        width: Dimensions.get('window').width,
        height: undefined,
    },
});
