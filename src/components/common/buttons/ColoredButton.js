import React from 'react'
import { button, MING } from '../styles'
import { View, Text, StyleSheet } from 'react-native'
import { TouchableWithoutFeedback } from 'react-native-gesture-handler'
import { useFonts, Lato_700Bold, Lato_400Regular} from '@expo-google-fonts/lato'

export default function ({ onPress, text }) {
    const [isLoaded] = useFonts ({
        Lato_700Bold,
        Lato_400Regular
    })
    const styles = StyleSheet.create({
        crossIcon: {
            fontFamily: 'Lato_400Regular',
            color: MING[6],
            fontSize: 13,
        },
        label: {
            fontFamily: 'Lato_700Bold',
            color: MING[6],
            fontSize: 13,
        },
        container: {
            flexDirection: 'row',
            maxWidth: 150,
            borderRadius: 50,
            borderWidth: 1,
            borderColor: MING[6],
            backgroundColor: MING[1],
            paddingVertical: 5,
            paddingHorizontal: 10,
            marginBottom: 8,
            marginRight: 3,
        }
    })
    return (isLoaded &&
        <TouchableWithoutFeedback onPress={onPress}>
            <View style={styles.container}>
                <Text style={styles.crossIcon}>x&nbsp;&nbsp;</Text>
                <Text style={styles.label} ellipsizeMode='tail' numberOfLines={1}>{text}</Text>
            </View>
        </TouchableWithoutFeedback>
    )
}  
    
