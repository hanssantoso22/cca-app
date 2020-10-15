import React from 'react'
import { GREY } from '../common/styles'
import { View, Text, StyleSheet, Image } from 'react-native'
import { useFonts, Lato_700Bold, Lato_400Regular } from '@expo-google-fonts/lato'
import { TouchableWithoutFeedback } from 'react-native-gesture-handler'

export default function NewsCard (props) {
    const [isLoaded] = useFonts({
        Lato_400Regular,
        Lato_700Bold
    })
    const loaded = isLoaded
    const styles = StyleSheet.create ({
        card: {
            borderRadius: 15,
            backgroundColor: 'white',
            marginBottom: 15,
            marginHorizontal: 15,
            shadowColor: 'black',
            shadowOffset: {width: 3, height: 4},
            shadowOpacity: 0.1,
            shadowRadius: 8,
        },
        thumbnail: {
            height: 150,
        },
        description: {
            paddingVertical: 15,
            paddingHorizontal: 20,
        },
        newsTitle: {
            fontFamily: 'Lato_700Bold',
            color: GREY[6],
            fontSize: 20,
            marginVertical: 5,
        },
        shortDescription: {
            fontFamily: 'Lato_400Regular',
            color: GREY[3],
            fontSize: 14,
            height: 40,
            
        }
    })
    return (
        <TouchableWithoutFeedback>
            <View style={styles.card}>
                <View style={styles.thumbnail}>
                    <Image source={props.imgSource} />
                </View>
                <View style={styles.description}>
                    <Text style={styles.newsTitle} ellipsizeMode='tail' numberOfLines={2}>{props.title}</Text>
                    <Text style={styles.shortDescription} ellipsizeMode='tail' numberOfLines={2} >{props.description}</Text>
                </View>
            </View>
        </TouchableWithoutFeedback>
    )
}