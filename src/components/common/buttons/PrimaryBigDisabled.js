import React from 'react'
import { button, GREY } from '../styles'
import { View, Text, StyleSheet } from 'react-native'
import { TouchableWithoutFeedback } from 'react-native-gesture-handler'
import { useFonts, Lato_700Bold} from '@expo-google-fonts/lato'
import { AppLoading } from 'expo'

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
    if (!isLoaded) {
        return (<AppLoading />)
    }
    else {
        return (
            <View style={{...button.primaryBigDisabled, ...style}}>
                <Text style={{...styles.label, fontSize:fontSize, ...style}}>{text}</Text>
            </View>
        )
    }  
    
}