import React, { useState } from 'react'
import { Text, StyleSheet, TextInput, View } from 'react-native'
import { GREY, MING } from '../styles'
import { useFonts, Lato_400Regular} from '@expo-google-fonts/lato'

export default function MultiLineInput ( { label, onChangeText, value, maxLength, type } ) {
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
            paddingTop: 7,
            paddingBottom: 7,
            paddingHorizontal: 10,
            borderRadius: 10,
            borderWidth: 1,
            marginBottom: 15,
            height: 250,
            lineHeight: 25,
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
            <Text style={styles.inputLabel}>{label}</Text>
            <TextInput 
                style={{...styles.textInputContainer, ...styles.inputContent, borderColor: containerBorderColor}}
                onChangeText={onChangeText}
                value={value}
                type={type}
                multiline={true}
                onBlur={onBlur}
                onFocus={onFocus}
            />
        </View>
    )
}