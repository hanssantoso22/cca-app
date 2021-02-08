import React, { useState, useEffect } from 'react'
import moment from 'moment'
import SubNavbar from '../../components/common/navigation/navbar/SubNavbar'
import { page, GREY, marginHorizontal, font } from '../../components/common/styles'
import { SafeAreaView, View, Text, StyleSheet, ScrollView, FlatList } from 'react-native'
import { useFonts, Lato_700Bold, Lato_400Regular } from '@expo-google-fonts/lato'
import PrimaryButton from '../../components/common/buttons/PrimaryBig'
import WithLoading from '../../components/hoc/withLoading'

import axios from 'axios'
import {URL, authenticate} from '../../api/config'
import store from '../../redux/store/store'

export default function EventDetailsPage (props) {
    const [details, setDetails] = useState({})
    const [isLoading, setIsLoading] = useState(true)
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
    const schedDetails = {
        date: moment(details.startTime,`${'YYYY-MM-DD'}T${'HH:mm:ss.sssZ'}`).format('DD MMM YYYY'), 
        time: [moment(details.startTime,`${'YYYY-MM-DD'}T${'HH:mm:ss.sssZ'}`).format('HH:mm'), moment(details.endTime, `${'YYYY-MM-DD'}T${'HH:mm:ss.sssZ'}`).format('HH:mm')], 
        venue: details.venue == '' ? 'Online' : details.venue,
        link: details.link,
}
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
            if (key=='link' && value=='') continue
            if (key=='time') {
                renderSchedDetails.push(
                    <View style={{flexDirection: 'row', marginBottom: 20}}>
                        <Text style={styles.materialIcon}>{icons[key]}</Text>
                        <Text style={labelStyle}>{`${value[0]} - ${value[1]}`}</Text>
                    </View>
                )
                continue
            }
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
    useEffect (() => {
        async function loadEvent() {
            try {
                const res = await axios.get(`${URL}/users/reminders/${eventID}`, authenticate(store.getState().main.token))
                setDetails(res.data)
                setIsLoading(false)
            } catch (err) {
                console.log(err)
            }
        }
        loadEvent()
    },[])
    return (
        <SafeAreaView style={page.main}>
            <SubNavbar title={details.eventName} pressed={onBackPress} />
            <WithLoading isLoading={isLoading} loadingMessage='Loading details...'>
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
            </WithLoading>
        </SafeAreaView>
    )
}