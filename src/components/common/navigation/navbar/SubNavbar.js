import React from 'react'
import { PURPLE } from '../../styles'
import { StyleSheet, View, Text } from 'react-native'
import { useFonts, Lato_700Bold } from '@expo-google-fonts/lato'
import { AppLoading } from 'expo'

export default function navbar (props) {
    const [isLoaded] = useFonts({
        Lato_700Bold,
        'MaterialIcons-Regular': require('../../../../assets/fonts/MaterialIcons-Regular.ttf')
    })
    const styles = StyleSheet.create ({
        container: {
            backgroundColor: PURPLE[5],
            height: 70,
            width: '100%',
            flexDirection: 'row',
            alignItems: 'center',
        },
        title: {
            fontFamily: 'Lato_700Bold',
            color: 'white',
            fontSize: 16,
            justifyContent: 'center',
            textAlign: 'center'
        },
        padding: {
            flex: 1,
            flexDirection: 'row',
            paddingLeft: 20,
        },
        titleWrapper: {
            flex: 3,
            alignItems: 'center',
        },
        backButton: {
            fontFamily: 'MaterialIcons-Regular',
            color: 'white',
            fontSize: 24,
        },
        addButton: {
            fontFamily: 'MaterialIcons-Regular',
            color: 'white',
            fontSize: 30,
            textAlign: 'center'
        },
        backButtonDesc: {
            color: 'white',
            fontFamily: 'Lato_700Bold',
            fontSize: 16,
        }
    })
    if (!isLoaded) {
        return <AppLoading />
    }
    else {
        return (
            <View style={styles.container}>
                <View style={styles.padding}>
                    {props.back ? <Text onPress={props.pressed} style={styles.backButtonDesc}>{props.back}</Text> : <Text onPress={props.pressed} style={styles.backButton}>arrow_back_ios</Text>}
                </View>
                <View style={styles.titleWrapper}>
                    <Text numberOfLines={1} ellipsizeMode='tail' style={styles.title}>{props.title}</Text>
                </View>
                <View style={styles.padding}>
                    
                </View>
            </View>
        )
    }
}
