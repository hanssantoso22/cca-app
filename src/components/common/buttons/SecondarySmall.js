import React from 'react'
import { button, PURPLE } from '../styles'
import { View, Text, StyleSheet, TouchableWithoutFeedback } from 'react-native'
import { useFonts, Lato_400Regular} from '@expo-google-fonts/lato'

export default function (props) {
    const [isLoaded] = useFonts ({
        Lato_400Regular
    })
    const styles = StyleSheet.create({
        label: {
            fontFamily: 'Lato_400Regular',
            color: PURPLE[5]
        }
    })
    const fontSize = props.fontSize
    return (isLoaded &&
        <TouchableWithoutFeedback onPress={props.pressHandler}>
            <View style={{...button.secondarySmall,...props.style}}>
                <Text style={{...styles.label,...props.style, fontSize:fontSize}}>{props.text}</Text>
            </View>
        </TouchableWithoutFeedback>
    )    
}