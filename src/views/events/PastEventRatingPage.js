import React, { useState } from 'react';
import SubNavbar from '../../components/common/navigation/navbar/SubNavbar'
import { page, GREY, marginHorizontal, font } from '../../components/common/styles'
import { SafeAreaView, View, Text, StyleSheet, ScrollView, FlatList } from 'react-native'
import { useFonts, Lato_700Bold, Lato_400Regular, Lato_300Light } from '@expo-google-fonts/lato'
import PrimaryButton from '../../components/common/buttons/PrimaryBig'
import { AirbnbRating } from 'react-native-ratings';
import MultiLineInput from '../../components/common/forms/MultiLineInput'

export default function EventDetailsPage (props) {
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
    const dummyEvents = [
        {id:0, title: 'Arduino Workshop',date: '28 October 2020',time: '20:00' ,venue: 'Online',link: 'https://ntu-sg.zoom.us/j/99056295240 (Password: 312264)', description:'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.'},
        {id:1, title: 'Introduction to Machine Learning and Deep Learning',date: '28 October 2020',time: '20:00' ,venue: 'Online',link: 'https://ntu-sg.zoom.us/j/99056295240 (Password: 312264)', description:'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.'},
        {id:2, title: 'Subcommittee Recruitment Talk',date: '28 October 2020',time: '20:00' ,venue: 'Online',link: 'https://ntu-sg.zoom.us/j/99056295240 (Password: 312264)', description:'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.'}
    ]
    const eventDetails = dummyEvents.filter((item)=>eventID==item.id)
    const details = eventDetails[0]
    const submitHandler = () => {
        props.navigation.navigate('Events')
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

    return (
        <SafeAreaView style={page.main}>
            <SubNavbar title='Event Rating' pressed={onBackPress} />
            <ScrollView>
                <View style={page.main}>
                    <View style={styles.card}>
                        <Text style={styles.eventName} numberOfLines={2} ellipsizeMode='tail'>{details.title}</Text>
                        <Text style={styles.question}>How was the event?</Text>
                        <AirbnbRating
                            count={4}
                            reviews={['Terrible','Bad','Good','Awesome']}
                            defaultRating={0}
                            size={30}
                            reviewSize={16}
                            reviewColor={GREY[2]}
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
        </SafeAreaView>
    )
}