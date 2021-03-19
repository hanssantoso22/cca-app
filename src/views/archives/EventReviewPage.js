import React, { useState, useEffect } from 'react';
import SubNavbar from '../../components/common/navigation/navbar/SubNavbar'
import WithLoading from '../../components/hoc/withLoading'
import { page, marginHorizontal, font } from '../../components/common/styles'
import { SafeAreaView, View, Text, StyleSheet, FlatList, Alert } from 'react-native'
import { useFonts, Lato_700Bold, Lato_400Regular } from '@expo-google-fonts/lato'
import ReviewCard from '../../components/archives/ReviewCard'

import axios from 'axios'
import {URL, authenticate} from '../../api/config'
import store from '../../redux/store/store'

export default function PastEventReviewPage (props) {
    const [event, setEvent] = useState({})
    const [reviews, setReviews] = useState([])
    const [isLoading, setIsLoading] = useState(true)
    const [isLoaded] = useFonts({
        'MaterialIcons-Regular': require('../../assets/fonts/MaterialIcons-Regular.ttf'),
        Lato_400Regular,
        Lato_700Bold
    })
    const onBackPress = () => {
        props.navigation.goBack()
    }
    const { eventID } = props.route.params
    const overallRating = () => {
        if (reviews.length>0) {
            let sum = 0
            reviews.forEach((item)=>{
                sum+=item.rating
            })
            const averageRating = parseFloat(sum/reviews.length).toPrecision(3)
            return `${averageRating} / 4.00`
        }
        else {
            return 'N/A'
        }
    }
    const styles = StyleSheet.create ({
        pageTitle: {
            fontFamily: 'Lato_700Bold',
            marginHorizontal: 15,
            marginBottom: marginHorizontal,
        },
        rating: {
            fontFamily: 'Lato_400Regular',
            marginHorizontal: 15,
            marginBottom: marginHorizontal,
            fontSize: 16
        }
    })
    useEffect (() => {
        async function loadEvent () {
            try {
                const res = await axios.get(`${URL}/event/${eventID}/details`, authenticate(store.getState().main.token))
                setEvent(res.data)
                setReviews(res.data.reviews)
                setIsLoading(false)
            } catch (err) {
                Alert.alert('Loading events failed')
            }
        }
        loadEvent()
    },[])
    return (isLoaded &&
        <SafeAreaView style={page.main}>
            <SubNavbar title={event.eventName} pressed={onBackPress} />
                <WithLoading isLoading={isLoading} loadingMessage='Loading reviews...'>
                <View style={page.main}>
                <Text style={{...font.articleTitle,...styles.pageTitle}}>{event.eventName}</Text>
                <Text style={{...font.articleTitle,...styles.rating}}>Overall rating:   {overallRating()}</Text>
                    <FlatList
                        data={reviews}
                        keyExtractor={(item)=>item.id}
                        renderItem={({ item })=>(
                            <ReviewCard rating={item.rating} additionalComment={item.comment} />
                        )}
                    />
                </View>
                </WithLoading>
        </SafeAreaView>
    )
}