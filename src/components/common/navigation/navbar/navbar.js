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
            fontSize: 24,
        },
        padding: {
            flex: 1,
            paddingLeft: 20,
        },
        titleWrapper: {
            flex: 3,
            alignItems: 'center',
        },
        burgerButton: {
            fontFamily: 'MaterialIcons-Regular',
            color: 'white',
            fontSize: 36,
        },
        addButton: {
            fontFamily: 'MaterialIcons-Regular',
            color: 'white',
            fontSize: 30,
            textAlign: 'center'
        }
    })
    if (!isLoaded) {
        return <AppLoading />
    }
    else {
        return (
            <View style={styles.container}>
                <View style={styles.padding}>
                    <Text style={styles.burgerButton} onPress={props.pressed}>menu</Text>
                </View>
                <View style={styles.titleWrapper}>
                    <Text style={styles.title}>{props.title}</Text>
                </View>
                <View style={styles.padding}>
                    {props.title=='Manage CCA'?<Text style={styles.addButton} onPress={props.add}>add</Text>:null}
                </View>
            </View>
        )
    }
}
