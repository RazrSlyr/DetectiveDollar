import { AntDesign, Feather } from '@expo/vector-icons';
import { Camera } from 'expo-camera';
import * as MediaLibrary from 'expo-media-library';
import React, { useState, useEffect, useRef } from 'react';
import {
    TouchableOpacity,
    StyleSheet,
    Text,
    TextInput,
    View,
    Dimensions,
    Platform,
    Image,
    SafeAreaView,
    Button,
    Pressable,
} from 'react-native';

import { ALBUMNNAME, OPTIONS } from '../constants/ImageConstants';

export default function CameraWithPreview({ navigation }) {
    const cameraRef = useRef();
    const [hasCameraPermission, setHasCameraPermission] = useState();
    const [hasMediaLibraryPermission, setMediaLibraryPermission] = useState();
    const [photo, setPhoto] = useState();
    const [image_uri, setImageURI] = useState('');

    useEffect(() => {
        (async () => {
            const cameraPermission = await Camera.requestCameraPermissionsAsync();
            const mediaLibaryPermission = await MediaLibrary.requestPermissionsAsync();
            setHasCameraPermission(cameraPermission.status === 'granted');
            setMediaLibraryPermission(mediaLibaryPermission.status === 'granted');
        })();
    }, []);

    const takePic = async () => {
        if (hasCameraPermission === undefined) {
            return <Text>Requesting permissions...</Text>;
        } else if (!hasCameraPermission) {
            return <Text>Permission for camera not granted. Please change this in settings.</Text>;
        }
        if (cameraRef) {
            try {
                const newPhoto = await cameraRef.current.takePictureAsync(OPTIONS);
                console.log(newPhoto.uri);
                setPhoto(newPhoto);
            } catch (e) {
                console.log(e);
            }
        }
    };
    if (photo) {
        const savePicture = async () => {
            const asset = await MediaLibrary.createAssetAsync(photo.uri);
            const album = await MediaLibrary.getAlbumAsync(ALBUMNNAME);

            if (album === null) {
                await MediaLibrary.createAlbumAsync(ALBUMNNAME, asset, false);
            } else {
                await MediaLibrary.addAssetsToAlbumAsync([asset], album, false);
            }

            alert('Picture saved to app files!');
            setPhoto(undefined);
            setImageURI(asset.uri);
            console.log(asset.uri);
            navigation.navigate('PrevScreen', { image: image_uri });
        };
        return (
            <View style={{ flex: 1 }}>
                <SafeAreaView style={{ flex: 1 }}>
                    <Image style={styles.preview} source={{ uri: photo.uri }} />
                </SafeAreaView>
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
                <View style={{ position: 'absolute', bottom: 100, alignSelf: 'center' }}>
                    <TouchableOpacity onPress={savePicture}>
                        <AntDesign name="checkcircle" size={50} color="white" />
                    </TouchableOpacity>
                </View>
            </View>
        );
    } else {
        return (
            <View style={{ flex: 1 }}>
                <Camera style={{ flex: 1 }} type={Camera.Constants.Type.back} ref={cameraRef} />
                <View
                    style={{
                        position: 'absolute',
                        top: 20,
                        right: 20,
                        alignSelf: 'right',
                    }}>
                    <TouchableOpacity
                        onPress={() => {
                            console.log('disable camera');
                        }}>
                        <Feather name="x-circle" size={50} color="white" />
                    </TouchableOpacity>
                </View>
                <View style={{ position: 'absolute', bottom: 100, alignSelf: 'center' }}>
                    <TouchableOpacity onPress={takePic}>
                        <Feather name="camera" size={50} color="white" />
                    </TouchableOpacity>
                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f9f9f9',
        alignItems: 'center',
        justifyContent: 'top',
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
        alignSelf: 'stretch',
        flex: 1,
    },
});
