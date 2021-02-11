import React, { useState, useEffect } from 'react'
import SubNavbar from '../../components/common/navigation/navbar/SubNavbar'
import WithLoading from '../../components/hoc/withLoading'
import { page, GREY, marginHorizontal, font } from '../../components/common/styles'
import { SafeAreaView, View, Text, StyleSheet, ScrollView, Alert } from 'react-native'
import { useFonts, Lato_700Bold, Lato_400Regular, Lato_300Light } from '@expo-google-fonts/lato'
import PrimaryButton from '../../components/common/buttons/PrimaryBig'
import { AirbnbRating } from 'react-native-ratings';
import MultiLineInput from '../../components/common/forms/MultiLineInput'

import axios from 'axios'
import {URL, authenticate} from '../../api/config'
import store from '../../redux/store/store'

export default function EventDetailsPage (props) {
    const [isLoading, setIsLoading] = useState(true)
    const [event, setEvent] = useState({event: {}})
    const [isLoaded] = useFonts({
        'MaterialIcons-Regular': require('../../assets/fonts/MaterialIcons-Regular.ttf'),
        Lato_300Light,
        Lato_400Regular,
        Lato_700Bold
    })
    const loaded = isLoaded
    const onBackPress = () => {
        props.navigation.goBack()
    }
    const { eventID } = props.route.params
    const [commentBox, setCommentBox] = useState('')
    const [rating, setRating] = useState(null)
    const submitHandler = async () => {
        try {
            if (rating == null) {
                throw new Error('Please rate the event')
            }
            const res = await axios.patch(`${URL}/users/pastEvent/${eventID}/submitReview`, {rating, comment: commentBox}, authenticate(store.getState().main.token))
            props.navigation.goBack()
        } catch (err) {
            Alert.alert('Review not submitted')
        }
    }
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
            paddingHorizontal: 20,
            paddingTop: 20,
            paddingBottom: 20,
            marginHorizontal: marginHorizontal,
        },
        eventName: {
            fontFamily: 'Lato_300Light',
            textAlign: 'center',
            color: GREY[4],
            fontSize: 16,
            textTransform: 'uppercase',
            letterSpacing: 2,
            lineHeight: 30,
        },
        question: {
            fontFamily: 'Lato_700Bold',
            fontSize: 16,
            color: GREY[4],
            textTransform: 'uppercase',
            letterSpacing: 1,
            textAlign: 'center',
            marginTop: 25,
            marginBottom: 10,
        },
        submitButtonWrapper: {
            flexDirection: 'column-reverse',
            paddingHorizontal: 30,
        },
        commentBoxContainer: {
            marginTop: 30,
        }
    })
    useEffect (() => {
        async function loadEvent () {
            try {
                const res = await axios.get(`${URL}/users/pastEvent/${eventID}`, authenticate(store.getState().main.token))
                setEvent(res.data)
                setIsLoading(false)
            } catch (err) {
                console.log(err)
            }
        }
        loadEvent()
    },[])
    return (
        <SafeAreaView style={page.main}>
            <SubNavbar title='Event Rating' pressed={onBackPress} />
            <WithLoading isLoading={isLoading} loadingMessage='Loading details...'>
            <ScrollView>
                <View style={page.main}>
                    <View style={styles.card}>
                        <Text style={styles.eventName} numberOfLines={2} ellipsizeMode='tail'>{event.event.eventName}</Text>
                        <Text style={styles.question}>How was the event?</Text>
                        <AirbnbRating
                            count={4}
                            reviews={['Terrible','Bad','Good','Awesome']}
                            defaultRating={0}
                            size={30}
                            reviewSize={16}
                            reviewColor={GREY[2]}
                            onFinishRating={rating => setRating(rating)}
                        />
                        <View style={styles.commentBoxContainer}>
                            <MultiLineInput
                                label="We'd like to hear more from you..."
                                value={commentBox}
                                onChangeText={(text)=>setCommentBox(text)}
                                type="name"
                                maxLength={500}
                            />
                        </View>
                    </View>
                </View>
            </ScrollView>
            <View style={styles.submitButtonWrapper}>
                <PrimaryButton fontSize={20} pressHandler={submitHandler} text='Submit' />
            </View>
            </WithLoading>
        </SafeAreaView>
    )
}