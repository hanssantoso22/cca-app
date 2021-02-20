import React from 'react'
import { GREY } from '../styles'
import { View, Text, StyleSheet } from 'react-native'
import { useFonts } from '@expo-google-fonts/lato'

export default function dropDownIcon (props) {
    const [isLoaded] = useFonts({
        'MaterialIcons-Regular': require('../../../assets/fonts/MaterialIcons-Regular.ttf')
    })
    const styles = StyleSheet.create ({
        materialIcon: {
            color: GREY[5],
            fontFamily: 'MaterialIcons-Regular',
            fontSize: 30,
        },
        materialIconContainer: {
            paddingTop: 8,
        }
    })
    return (isLoaded &&
        <View style={styles.materialIconContainer}>
            <Text style={styles.materialIcon}>arrow_drop_down</Text>
        </View>
    )
}