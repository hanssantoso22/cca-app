import React from 'react'
import { GREY } from '../../components/common/styles'
import { ActivityIndicator, StyleSheet, View, Text, Dimensions } from 'react-native'
import { useFonts, Lato_400Regular } from '@expo-google-fonts/lato'

export default Loading = () => {
    const styles = StyleSheet.create({
        container: {
            top: 0,
            bottom: 0,
            left: 0,
            right: 0,
            zIndex: 2,
            backgroundColor: 'black',
            opacity: 0.7,
            position: 'absolute',
            justifyContent: 'center',
            alignItems: 'center'
        }
    })
    return (
        <View style={styles.container}>
            <ActivityIndicator size="large" style={{color: GREY[5]}}/>
        </View>
    )
}