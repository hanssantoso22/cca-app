import React from 'react'
import { button } from '../styles'
import { View, Text, StyleSheet } from 'react-native'
import { TouchableWithoutFeedback } from 'react-native-gesture-handler'
import { useFonts, Lato_700Bold} from '@expo-google-fonts/lato'
import { AppLoading } from 'expo'

export default function (props) {
    const [isLoaded] = useFonts ({
        Lato_700Bold
    })
    const styles = StyleSheet.create({
        label: {
            fontFamily: 'Lato_700Bold',
            color: 'white'
        }
    })
    const fontSize = props.fontSize
    if (!isLoaded) {
        return (<AppLoading />)
    }
    else {
        return (
            <TouchableWithoutFeedback onPress={props.pressHandler}>
                <View style={button.primaryLong}>
                    <Text style={{...styles.label, fontSize:fontSize}}>{props.text}</Text>
                </View>
            </TouchableWithoutFeedback>
        )
    }  
    
}