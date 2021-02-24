import React from 'react'
import { button, GREY } from '../styles'
import { View, Text, StyleSheet } from 'react-native'
import { useFonts, Lato_700Bold} from '@expo-google-fonts/lato'

export default function ({ fontSize, text, style }) {
    const [isLoaded] = useFonts ({
        Lato_700Bold
    })
    const styles = StyleSheet.create({
        label: {
            fontFamily: 'Lato_700Bold',
            color: GREY[4]
        },
    })
    return (isLoaded &&
        <View style={{...button.primaryBigDisabled, ...style}}>
            <Text style={{...styles.label, fontSize:fontSize, ...style}}>{text}</Text>
        </View>
    ) 
    
}