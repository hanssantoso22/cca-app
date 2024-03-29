import React, { useState } from 'react'
import { Text, StyleSheet, TextInput, View } from 'react-native'
import { GREY, MING } from '../styles'
import { useFonts, Lato_400Regular} from '@expo-google-fonts/lato'

export default function CustomTextInput ( { onChangeText, value, maxLength, type, customStyle, placeHolder } ) {
    const [isLoaded] = useFonts ({
        Lato_400Regular
    })
    const [containerBorderColor, setContainerBorderColor] = useState(GREY[2])
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
            marginBottom: 15,
            backgroundColor: GREY[0]
        },
    })
    const onBlur = () => {
        setContainerBorderColor(GREY[2])
    }
    const onFocus = () => {
        setContainerBorderColor(MING[3])
    }
    return (isLoaded &&
        <View>
            <TextInput 
                style={{...styles.textInputContainer, ...styles.inputContent, ...customStyle, borderColor: containerBorderColor}}
                onChangeText={onChangeText}
                value={value}
                maxLength={maxLength}
                type={type}
                onBlur={onBlur}
                onFocus={onFocus}
                placeholder={placeHolder}
                secureTextEntry={type=='password'}
            />
        </View>
    )
}