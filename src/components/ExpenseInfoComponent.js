import { AntDesign, Feather } from '@expo/vecsetPhototor-icons';
import { Camera } from 'expo-camera';
import { Image } from 'expo-image';
import * as MediaLibrary from 'expo-media-library';
import React, { useState, useEffect, useRef } from 'react';
import { TouchableOpacity, StyleSheet, Text, View, Dimensions, Modal } from 'react-native';

import { ALBUMNNAME } from '../constants/ImageConstants';
const ExpenseInfoComponent = ({ isVisible, onClose, onPictureTaken }) => {
    const [hasMediaLibraryPermission, setMediaLibraryPermission] = useState();
    useEffect(() => {
        (async () => {
            const mediaLibaryPermission = await MediaLibrary.requestPermissionsAsync();
            setMediaLibraryPermission(mediaLibaryPermission.status === 'granted');
        })();
    }, []);
};
