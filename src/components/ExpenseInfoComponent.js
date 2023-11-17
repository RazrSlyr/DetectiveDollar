import { AntDesign, Feather } from '@expo/vector-icons';
import { Image } from 'expo-image';
import * as MediaLibrary from 'expo-media-library';
import React, { useState, useEffect, useRef } from 'react';
import { TouchableOpacity, StyleSheet, Text, View, Dimensions, Modal } from 'react-native';

import { ALBUMNNAME } from '../constants/ImageConstants';
import { Button } from 'react-native-web';
export const ExpenseInfoComponent = ({ isVisable, onClose, expense }) => {
    const [hasMediaLibraryPermission, setMediaLibraryPermission] = useState();
    useEffect(() => {
        (async () => {
            const mediaLibaryPermission = await MediaLibrary.requestPermissionsAsync();
            setMediaLibraryPermission(mediaLibaryPermission.status === 'granted');
        })();
    }, []);
    return (
        <Modal animationType="slide" transparent={false} visible={expense !== null}>
            <View>
                <Text>Expense Info</Text>
                <Button> Close </Button>
            </View>
        </Modal>
    );
};
