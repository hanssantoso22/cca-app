import React from 'react'
import { button } from '../styles'
import { View, Text, StyleSheet } from 'react-native'
import { TouchableWithoutFeedback } from 'react-native-gesture-handler'
import { useFonts, Lato_700Bold} from '@expo-google-fonts/lato'
import { AppLoading } from 'expo'

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
    if (!isLoaded) {
        return (<AppLoading />)
    }
    else {
        return (
            <TouchableWithoutFeedback onPress={pressHandler}>
                <View style={{...button.primaryBig, ...style}}>
                    <Text style={{...styles.label, fontSize:fontSize, ...style}}>{text}</Text>
                </View>
            </TouchableWithoutFeedback>
        )
    }  
    
}