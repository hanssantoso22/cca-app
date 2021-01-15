import React from 'react'
import { GREY } from './styles'
import { View, Text, StyleSheet } from 'react-native'
import { useFonts, Lato_700Bold, Lato_400Regular_Italic } from '@expo-google-fonts/lato'
import { TouchableWithoutFeedback } from 'react-native-gesture-handler'

export default function ListCard ({ title, description, onPress }) {
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
        titleContainer: {
            flex: 6,
            justifyContent: 'center',
            flexDirection: 'column'
        },
        indicatorContainer: {
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
        },
        title: {
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
    return (
        <TouchableWithoutFeedback onPress={onPress}>
            <View style={styles.card}>
                <View style={styles.titleContainer}>
                    <Text style={styles.title} ellipsizeMode='tail' numberOfLines={1} >{title}</Text>
                    {description && 
                        (<Text style={styles.shortDescription} ellipsizeMode='tail' numberOfLines={1} >{description}</Text>)
                    }
                </View>
            </View>
        </TouchableWithoutFeedback>
    )
}