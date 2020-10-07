import React from 'react'
import { PURPLE, fontFamily } from '../../styles'
import { StyleSheet, View, Text } from 'react-native'
import { useFonts } from '@use-expo/font'
import { AppLoading } from 'expo'

export default function navbar (props) {
    const [isLoaded] = useFonts(fontFamily.material)
    const styles = StyleSheet.create ({
        navbar: {
            backgroundColor: PURPLE[5],
            height: '50px'
        },
        title: {
            fontFamily: 'Lato-Bold',
            color: 'white',
            fontSize: 24,
            justifyContent: 'center',
            flex: 8
        },
        burgerButton: {
            fontFamily: 'MaterialIcons-Regular',
            color: 'white',
            fontSize: 24,
            flex: 1
        }
    })
    if (!isLoaded) {
        return <AppLoading />
    }
    else {
        return (
            <View style={styles.navbar}>
                <Text style={styles.burgerButton}>menu</Text>
                <Text style={styles.title}>Title</Text>
            </View>
        )
    }
}
