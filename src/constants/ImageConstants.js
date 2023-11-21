import * as ImagePicker from 'expo-image-picker';
const SELECTOPTIONS = {
    quality: 1,
    exif: false,
    allowsEditing: true,
    mediaTypes: ImagePicker.MediaTypeOptions.Images,
};
const CAPTUREOPTIONS = {
    quality: 1,
    exif: false,
    allowsEditing: true,
    mediaTypes: ImagePicker.MediaTypeOptions.Images,
    cameraType: ImagePicker.CameraType.back,
};
const ALBUMNNAME = 'DetectiveDollar';
export { SELECTOPTIONS, CAPTUREOPTIONS, ALBUMNNAME };
