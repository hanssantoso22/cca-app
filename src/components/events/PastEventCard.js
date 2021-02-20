import React from 'react'
import { GREY } from '../common/styles'
import { View, Text, StyleSheet } from 'react-native'
import { useFonts, Lato_700Bold, Lato_400Regular_Italic } from '@expo-google-fonts/lato'
import { TouchableWithoutFeedback } from 'react-native-gesture-handler'

export default function PastEventCard (props) {
    const [isLoaded] = useFonts({
        Lato_400Regular_Italic,
        Lato_700Bold,
        'MaterialIcons-Regular': require('../../assets/fonts/MaterialIcons-Regular.ttf')
    })
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
            flex: 6,
            justifyContent: 'center',
            flexDirection: 'column'
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
        },
        shortDescription: {
            fontFamily: 'Lato_400Regular_Italic',
            color: GREY[3],
            fontSize: 14,
            marginBottom: 5,
        },
        indicator: {
            fontFamily: 'MaterialIcons-Regular',
            fontSize: 16,
            color: '#FFCD1D',
        }
    })
    return (isLoaded &&
        <TouchableWithoutFeedback onPress={props.pressed}>
            <View style={styles.card}>
                <View style={styles.eventNameContainer}>
                    <Text style={styles.eventName} ellipsizeMode='tail' numberOfLines={1} >{props.name}</Text>
                    <Text style={styles.shortDescription} ellipsizeMode='tail' numberOfLines={1} >by {props.organizer}</Text>
                </View>
                <View style={styles.indicatorContainer}>
                    {props.read ? null : <Text style={styles.indicator}>fiber_manual_record</Text>}
                </View>
            </View>
        </TouchableWithoutFeedback>
    )
}