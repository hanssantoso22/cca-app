import React from 'react'
import { button } from '../styles'
import { View, Text, StyleSheet, TouchableWithoutFeedback } from 'react-native'
import { useFonts, Lato_700Bold} from '@expo-google-fonts/lato'

export default function ({ fontSize, pressHandler, text, style }) {
    const [isLoaded] = useFonts ({
        Lato_700Bold
    })
    const styles = StyleSheet.create({
        label: {
            fontFamily: 'Lato_700Bold',
            color: 'white'
        },
    })
    return (isLoaded &&
        <TouchableWithoutFeedback onPress={pressHandler}>
            <View style={{...button.dangerPrimaryBig, ...style}}>
                <Text style={{...styles.label, fontSize:fontSize, ...style}}>{text}</Text>
            </View>
        </TouchableWithoutFeedback>
    ) 
}