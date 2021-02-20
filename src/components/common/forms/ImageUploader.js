import React, { useEffect, useState } from 'react'
import { Text, StyleSheet, View, TouchableWithoutFeedback, Image } from 'react-native'
import { GREY, MING, RED } from '../styles'
import { useFonts, Lato_400Regular} from '@expo-google-fonts/lato'

export default function ImageUploader ({ label, pickImageHandler, removeImageHandler, imageURI, uploaded }) {
    const [isLoaded] = useFonts ({
        Lato_400Regular
    })
    const styles = StyleSheet.create({
        inputLabel: {
            fontSize: 13,
            fontFamily: 'Lato_400Regular',
            color: GREY[3],
            marginBottom: 5
        },
        inputContent: {
            fontSize: 16,
            fontFamily: 'Lato_400Regular',
            color: GREY[5],
        },
        textInputContainer:{
            paddingVertical: 13,
            paddingHorizontal: 10,
            borderRadius: 10,
            borderWidth: 1,
            marginBottom: 15
        },
        previewContainer: {
            marginBottom: 15,
        },
        hyperlink: {
            fontSize: 13,
            fontFamily: 'Lato_400Regular',
            color: MING[5],
            marginBottom: 15
        },
        redHyperlink: {
            fontSize: 13,
            fontFamily: 'Lato_400Regular',
            color: RED[5],
            marginBottom: 15
        },
        thumbnail: {
            resizeMode: 'contain',
            height: 200,
        },
        imageUploadedLabel: {
            fontSize: 13,
            fontFamily: 'Lato_400Regular',
            color: GREY[3],
            marginBottom: 15
        },
    })
    const onBlur = () => {
        setContainerBorderColor(GREY[2])
    }
    const onFocus = () => {
        setContainerBorderColor(MING[6])
    }
    return (isLoaded &&
        <View>
            <View style={{flexDirection: 'row'}}>
                <Text style={styles.inputLabel}>{label}</Text>
                {imageURI != null || uploaded == true? 
                    <TouchableWithoutFeedback onPress={removeImageHandler}>
                        <Text style={styles.redHyperlink}>Remove image</Text>
                    </TouchableWithoutFeedback>
                :
                    <TouchableWithoutFeedback onPress={pickImageHandler}>
                        <Text style={styles.hyperlink}>Pick image</Text>
                    </TouchableWithoutFeedback>
                }
            </View>
            {imageURI != null && 
                <View style={styles.previewContainer}>
                    <Image source={{uri: imageURI}} style={styles.thumbnail} />
                </View>
            }
            {uploaded == true && 
                <Text style={styles.imageUploadedLabel}>Image Uploaded</Text>
            }
        </View>
    )
}