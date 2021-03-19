import React from 'react'
import { View, Text, StyleSheet } from 'react-native'
import { useFonts, Lato_400Regular } from '@expo-google-fonts/lato'

export default function ({ message, color }) {
    const [isLoaded] = useFonts({
        Lato_400Regular,
        'MaterialIcons-Regular': require('../../assets/fonts/MaterialIcons-Regular.ttf')
    })
    const fontColor = color
    const styles = StyleSheet.create({
        container: {
            height: '100%',
            justifyContent: 'center',
            alignItems: 'center'
        },
        message: {
            fontFamily: 'Lato_400Regular',
            fontSize: 16,
            paddingHorizontal: 25,
            lineHeight: 25,
            color: fontColor,
            marginTop: 15,
            textAlign: 'center'
        },
        icon: {
            fontFamily: 'MaterialIcons-Regular',
            fontSize: 70,
            color: fontColor
        }
    })
    return (isLoaded &&
        <View style={styles.container}>
            <Text style={styles.icon}>check_circle_outline</Text>
            <Text style={styles.message}>{message}</Text>
        </View>
    )
}