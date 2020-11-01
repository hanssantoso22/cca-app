import React, { useState } from 'react';
import SubNavbar from '../../components/common/navigation/navbar/SubNavbar'
import { page, GREY, marginHorizontal, font } from '../../components/common/styles'
import { SafeAreaView, View, Text, StyleSheet, ScrollView, FlatList } from 'react-native'
import { useFonts, Lato_700Bold, Lato_400Regular } from '@expo-google-fonts/lato'
import PrimaryButton from '../../components/common/buttons/PrimaryBig'

export default function EventDetailsPage (props) {
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
        {id:0, title: 'Test',date: '28 October 2020',time: '20:00' ,venue: 'Online',link: 'https://ntu-sg.zoom.us/j/99056295240 (Password: 312264)', description:'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.'},
        {id:1, title: 'Test3',date: '28 October 2020',time: '20:00' ,venue: 'Online',link: 'https://ntu-sg.zoom.us/j/99056295240 (Password: 312264)', description:'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.'},
        {id:2, title: 'Test2',date: '28 October 2020',time: '20:00' ,venue: 'Online',link: 'https://ntu-sg.zoom.us/j/99056295240 (Password: 312264)', description:'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.'}
    ]
    const eventDetails = dummyEvents.filter((item)=>eventID==item.id)
    const details = eventDetails[0]
    const schedDetails = {date: details.date, time: details.time, venue: details.venue, link: details.link}
    const styles = StyleSheet.create ({
        imageWrapper: {
            marginVertical: 5,
            alignItems: 'center',
        },
        pageTitle: {
            fontFamily: 'Lato_700Bold',
            marginHorizontal: 30,
            marginBottom: marginHorizontal,
        },
        scheduleWrapper: {
            marginVertical: 5,
            paddingHorizontal: 40,
        },
        scheduleFont: {
            fontFamily: '',
            fontSize: 13,
            color: GREY[3]
        },
        articleBodyWrapper: {
            paddingHorizontal: 30,
        },
        articleFont: {
            fontFamily: 'Lato_400Regular'
        },
        materialIcon: {
            fontFamily: 'MaterialIcons-Regular',
            fontSize: 24,
            color: GREY[3],
            marginRight: 15,
        },
        registerButtonWrapper: {
            flexDirection: 'column-reverse',
            paddingHorizontal: 30,
        },
    })
    const renderSchedDetails = []
    const listItems = () => {
        const icons = {date: 'calendar_today', time: 'access_time', venue: 'place', link: 'link'}
        for (const [key,value] of Object.entries(schedDetails)) {
            const isLink = key=='link'
            const labelStyle = !isLink?{...font.articleBody, paddingRight: 40}:{...font.articleBody, paddingRight: 40,...font.link}
            renderSchedDetails.push(
                <View style={{flexDirection: 'row', marginBottom: 20}}>
                    <Text style={styles.materialIcon}>{icons[key]}</Text>
                    <Text style={labelStyle}>{value}</Text>
                </View>
            )
        }
    }
    const addToCalendarHandler = () => {
        props.navigation.navigate('Reminders')
    }
    listItems()

    return (
        <SafeAreaView style={page.main}>
            <SubNavbar title={details.title} pressed={onBackPress} />
            <ScrollView>
                <View style={page.main}>
                    <View style={styles.imageWrapper}></View>
                    <Text style={{...font.articleTitle,...styles.pageTitle}}>{details.title}</Text>
                    <View style={styles.scheduleWrapper}>
                        {renderSchedDetails}
                    </View>
                    <View style={styles.articleBodyWrapper}>
                        <Text style={{...font.articleBody,...styles.articleFont}}>
                            {details.description}
                        </Text>
                    </View>
                </View>
            </ScrollView>
            <View style={styles.registerButtonWrapper}>
                <PrimaryButton fontSize={20} pressHandler={addToCalendarHandler} text='Add to Calendar' />
            </View>
        </SafeAreaView>
    )
}