import React, { useState } from 'react';
import SubNavbar from '../../components/common/navigation/navbar/SubNavbar'
import { page, GREY, marginHorizontal, font } from '../../components/common/styles'
import { SafeAreaView, View, Text, StyleSheet, ScrollView, FlatList } from 'react-native'
import { useFonts, Lato_700Bold, Lato_400Regular } from '@expo-google-fonts/lato'
import PrimaryButton from '../../components/common/buttons/PrimaryBig'
import ReviewCard from '../../components/archives/ReviewCard'

export default function PastEventReviewPage (props) {
    const [isLoaded] = useFonts({
        'MaterialIcons-Regular': require('../../assets/fonts/MaterialIcons-Regular.ttf'),
        Lato_400Regular,
        Lato_700Bold
    })
    const loaded = isLoaded
    const onBackPress = () => {
        props.navigation.goBack()
    }
    const { eventID } = props.route.params
    const dummyEvents = [
        {id:0, title: 'Arduino Workshop',review: [
            {id:0,comment:"",rating:2},
            {id:1,comment:"Nice", rating:4}
        ]},
        {id:1, title: 'Introduction to Machine Learning and Deep Learning',review: [
            {id:0,comment:"",rating:4}
        ]},
        {id:2, title: 'Subcommittee Recruitment Talk',review:[
            
        ]}
    ]
    const eventDetails = dummyEvents.filter((item)=>eventID==item.id)
    const details = eventDetails[0]
    const reviews = details.review
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
    return (
        <SafeAreaView style={page.main}>
            <SubNavbar title={details.title} pressed={onBackPress} />
                <View style={page.main}>
                <Text style={{...font.articleTitle,...styles.pageTitle}}>{details.title}</Text>
                <Text style={{...font.articleTitle,...styles.rating}}>Overall rating:   {overallRating()}</Text>
                    <FlatList
                        data={reviews}
                        keyExtractor={(item)=>item.id}
                        renderItem={({ item })=>(
                            <ReviewCard rating={item.rating} additionalComment={item.comment} />
                        )}
                    />
                </View>
        </SafeAreaView>
    )
}