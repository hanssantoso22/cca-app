import React from 'react'
import { button, PURPLE } from '../styles'
import { View, Text, StyleSheet } from 'react-native'
import { TouchableWithoutFeedback } from 'react-native-gesture-handler'
import { useFonts, Lato_400Regular} from '@expo-google-fonts/lato'
import { AppLoading } from 'expo'

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
    if (!isLoaded) {
        return (<AppLoading />)
    }
    else {
        return (
            <TouchableWithoutFeedback onPress={props.pressHandler}>
                <View style={{...button.secondarySmall,...props.style}}>
                    <Text style={{...styles.label,...props.style, fontSize:fontSize}}>{props.text}</Text>
                </View>
            </TouchableWithoutFeedback>
        )
    }  
    
}