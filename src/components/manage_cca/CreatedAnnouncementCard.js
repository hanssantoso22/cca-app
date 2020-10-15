import React from 'react'
import { GREY } from '../common/styles'
import { View, Text, StyleSheet } from 'react-native'
import { useFonts, Lato_700Bold, Lato_400Regular_Italic } from '@expo-google-fonts/lato'
import { TouchableWithoutFeedback } from 'react-native-gesture-handler'

export default function CreatedAnnouncementCard (props) {
    const [isLoaded] = useFonts({
        Lato_400Regular_Italic,
        Lato_700Bold,
        'MaterialIcons-Regular': require('../../assets/fonts/MaterialIcons-Regular.ttf')
    })
    const loaded = isLoaded
    const styles = StyleSheet.create ({
        card: {
            borderRadius: 15,
            backgroundColor: 'white',
            flexDirection: 'row',
            marginBottom: 15,
            marginHorizontal: 15,
            paddingHorizontal: 20,
            paddingVertical: 10,
            shadowColor: 'black',
            shadowOffset: {width: 3, height: 4},
            shadowOpacity: 0.05,
            shadowRadius: 7,
        },
        eventNameContainer: {
            flex: 5,
            justifyContent: 'center',
            flexDirection: 'column',
        },
        indicatorContainer: {
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
        },
        eventName: {
            fontFamily: 'Lato_700Bold',
            color: GREY[6],
            fontSize: 16,
            marginVertical: 5,
            paddingRight: 10,
        },
        shortDescription: {
            fontFamily: 'Lato_400Regular_Italic',
            color: GREY[3],
            fontSize: 14,
            marginBottom: 5,
        },
        icon: {
            fontFamily: 'MaterialIcons-Regular',
            fontSize: 20,
            color: GREY[2],
            paddingHorizontal: 5,
        }
    })
    return (
        <View style={styles.card}>
            <View style={styles.eventNameContainer}>
                <Text style={styles.eventName} ellipsizeMode='tail' numberOfLines={1} >{props.name}</Text>
                <Text style={styles.shortDescription} ellipsizeMode='tail' numberOfLines={1} >by {props.organizer}</Text>
            </View>
            <TouchableWithoutFeedback style={styles.indicatorContainer} onPress={props.edit}>
                <Text style={styles.icon}>edit</Text>
            </TouchableWithoutFeedback>
            <TouchableWithoutFeedback style={styles.indicatorContainer} onPress={props.delete}>
                <Text style={styles.icon}>delete</Text>
            </TouchableWithoutFeedback>
        </View>
    )
}