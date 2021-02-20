import React from 'react'
import { ActivityIndicator, StyleSheet, View, Text } from 'react-native'
import { PURPLE } from '../common/styles'
import { useFonts, Lato_400Regular } from '@expo-google-fonts/lato'

const LoadingIndicator = ({ message }) => {
    const [isLoaded] = useFonts({Lato_400Regular})
    const styles = StyleSheet.create({
        container: {
            justifyContent: 'center',
            alignItems: 'center',
            height: '100%'
        },
        loadingMessage: {
            marginTop: 15,
            fontFamily: 'Lato_400Regular',
            fontSize: 13,
            color: PURPLE[5]
        }
    })
    return (isLoaded &&
        <View style={styles.container}>
            <ActivityIndicator size="large" color={PURPLE[5]} />
            <Text style={styles.loadingMessage}>{message}</Text>
        </View>
    )
}
export default function ({ children, isLoading, loadingMessage}) {
    return (
        <>
            {isLoading ? 
                <LoadingIndicator message={loadingMessage} />
            : 
                children
            }
        </>
    )
}