import React from 'react'
import { View, Text, StyleSheet, TouchableWithoutFeedback } from 'react-native'
import { useFonts, Lato_400Regular } from '@expo-google-fonts/lato'
import { PURPLE, GREY, font } from '../../styles'
import { useSelector } from 'react-redux'
import { activeScreen } from '../../../../redux/reducers/slice'
import { AppLoading } from 'expo'

export default function ItemCard (props) {
    const [isLoaded] = useFonts({
        Lato_400Regular,
        'MaterialIcons-Regular': require('../../../../assets/fonts/MaterialIcons-Regular.ttf')
    })
    const active = useSelector(activeScreen)
    const styles = StyleSheet.create ({
        activeFont: {
            color: PURPLE[4],
            fontFamily: 'Lato_400Regular',
            letterSpacing: 3,
            fontSize: 20
        },
        inactiveFont: {
            color: GREY[3],
            fontFamily: 'Lato_400Regular',
            letterSpacing: 3,
            fontSize: 20
        },
        iconInactive: {
            color: GREY[2],
            fontFamily: 'MaterialIcons-Regular',
            fontSize: 24
        },
        iconActive: {
            color: PURPLE[4],
            fontFamily: 'MaterialIcons-Regular',
            fontSize: 24
        },
        card: {
            flexDirection: 'row',
            paddingVertical: 15,
            paddingHorizontal: 10,
            backgroundColor: 'white'
        }
    })
    
    if (!isLoaded) {
        return (<AppLoading />)
    }
    else {
        return (
            <TouchableWithoutFeedback onPress={props.pressed}>
                <View style={styles.card}>
                    <View style={{flex: 2, alignItems: 'center'}}>
                        <Text style={props.navScreen == active ? styles.iconActive : styles.iconInactive}>{props.icon}</Text>
                    </View>
                    <View style={{flex: 6, justifyContent: 'center'}}>
                        <Text style={props.navScreen == active ? styles.activeFont : styles.inactiveFont}>{props.menu}</Text>
                    </View>
                </View>
            </TouchableWithoutFeedback>
            
        )
    } 
}