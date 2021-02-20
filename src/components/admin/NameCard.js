import React from 'react'
import { GREY, MING } from '../common/styles'
import { View, Text, StyleSheet, Image } from 'react-native'
import { useFonts, Lato_700Bold, Lato_400Regular_Italic } from '@expo-google-fonts/lato'
import { TouchableWithoutFeedback } from 'react-native-gesture-handler'
import CheckedIcon from '../../assets/common/icons/checked.png'
import UncheckedIcon from '../../assets/common/icons/unchecked.png'

export default function NameCard ({ onPress, name, faculty, year, checked }) {
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
        cardChecked: {
            borderWidth: 1,
            borderColor: MING[4] 
        },
        personContainer: {
            flex: 6,
            justifyContent: 'center',
            flexDirection: 'column'
        },
        person: {
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
        iconContainer: {
            justifyContent: 'center',
            alignItems: 'center',
            marginRight: 30,
        },
        icon: {
            width: 30,
            height: 30
        }
    })
    return (isLoaded &&
        <TouchableWithoutFeedback onPress={onPress}>
            <View style={checked ? {...styles.card, ...styles.cardChecked} : styles.card}>
                <View style={styles.iconContainer}>
                    <Image
                        style={styles.icon}
                        source={checked ? CheckedIcon : UncheckedIcon }
                    />
                </View>
                <View style={styles.personContainer}>
                    <Text style={styles.person} ellipsizeMode='tail' numberOfLines={1} >{name}</Text>
                    <Text style={styles.shortDescription} ellipsizeMode='tail' numberOfLines={1} >{faculty} / {year}</Text>
                </View>
            </View>
        </TouchableWithoutFeedback>
    )
}