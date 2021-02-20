import React from 'react'
import { GREY } from '../common/styles'
import { View, Text, StyleSheet, Image } from 'react-native'
import { useFonts, Lato_700Bold, Lato_400Regular } from '@expo-google-fonts/lato'
import { AirbnbRating } from 'react-native-ratings'

export default function ReviewCard ({ rating, additionalComment }) {
    const [isLoaded] = useFonts({
        Lato_400Regular,
        Lato_700Bold
    })
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
            paddingHorizontal: 15,
            paddingVertical: 15,
        },
        label: {
            fontFamily: 'Lato_400Regular',
            color: GREY[3],
            fontSize: 13,
        },
        content: {
            fontFamily: 'Lato_400Regular',
            color: GREY[5],
            fontSize: 16,
            marginTop: 5,
        },
        starContainer: {
            marginVertical: 10,
            flexDirection: 'row',
        }
        
    })
    return (isLoaded &&
        <View style={styles.card}>
            <View style={styles.starContainer}>
                <Text style={{...styles.label, marginTop:4}}>Rating:         </Text>
                <AirbnbRating
                    count={4}
                    defaultRating={rating}
                    selectedColor={rating<3?'#AC1F2D':'#029356'}
                    size={20}
                    showRating={false}
                    isDisabled={true}
                />
            </View>
            {additionalComment?(
                <View>
                    <Text style={styles.label}>Comment:</Text>
                    <Text style={styles.content}>{additionalComment}</Text>
                </View>
            ):null}
            
        </View>
    )
}