import React from 'react'
import { MING, GREY, checkboxCard } from '../common/styles'
import { View, Text, StyleSheet, Image, TouchableWithoutFeedback } from 'react-native'
import { useFonts, Lato_400Regular } from '@expo-google-fonts/lato'

import CheckedIcon from '../../assets/common/icons/checked.png'
import UncheckedIcon from '../../assets/common/icons/unchecked.png'

const checkboxItem = (props) => {
    const [isLoaded] = useFonts({
        Lato_400Regular,
        'MaterialIcons-Regular': require('../../assets/fonts/MaterialIcons-Regular.ttf')
    })
    const styles = StyleSheet.create({
        container: {
            height: 40,
        },
        smallWrapper: {
            flex: 1,
            justifyContent: 'space-around',
            alignItems: 'center'
        },
        bigWrapper: {
            flex: 3,
            justifyContent: 'center',
        },
        activeFont: {
            color: MING[6],
            fontFamily: 'Lato_400Regular',
            letterSpacing: 0.5,
            fontSize: 20
        },
        inactiveFont: {
            color: GREY[3],
            fontFamily: 'Lato_400Regular',
            letterSpacing: 0.5,
            fontSize: 20
        },
        iconInactive: {
            color: GREY[2],
            fontFamily: 'MaterialIcons-Regular',
            fontSize: 24,
            marginTop: 5,
        },
        iconActive: {
            color: MING[5],
            fontFamily: 'MaterialIcons-Regular',
            fontSize: 24,
            marginTop: 5,
        },
        checkIcon: {
            width: 30,
            height: 30,
        }
    })
    return (isLoaded &&
        <TouchableWithoutFeedback onPress={props.selected}>
            <View style={props.active ? checkboxCard.active : checkboxCard.inactive}>
                <View style={styles.smallWrapper}>
                    <Text style={props.active ? styles.iconActive : styles.iconInactive}>{props.icon}</Text>
                </View>
                <View style={styles.bigWrapper}>
                    <Text style={props.active ? styles.activeFont : styles.inactiveFont}>{props.label}</Text>
                </View>
                <View style={styles.smallWrapper}>
                    <Image style={styles.checkIcon} source={props.active ? CheckedIcon : UncheckedIcon}/>
                </View>
            </View>
        </TouchableWithoutFeedback>
    )
}

export default checkboxItem