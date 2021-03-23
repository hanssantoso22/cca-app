import React, { useState, useEffect } from 'react'
import * as Google from 'expo-google-app-auth'
import moment from 'moment'
import SubNavbar from '../../components/common/navigation/navbar/SubNavbar'
import { page, GREY, marginHorizontal, font } from '../../components/common/styles'
import { SafeAreaView, View, Text, StyleSheet, ScrollView, Image, Alert } from 'react-native'
import { useFonts, Lato_700Bold, Lato_400Regular } from '@expo-google-fonts/lato'
import PrimaryButton from '../../components/common/buttons/PrimaryBig'
import WithLoading from '../../components/hoc/withLoading'
import ConfirmationModal from './ConfirmationModal'
import AsyncStorage from '@react-native-community/async-storage'

import axios from 'axios'
import {URL, authenticate, googleConfig, gapiURL, gapiKey} from '../../api/config'
import store from '../../redux/store/store'
import { add } from 'react-native-reanimated'

const createEvent = async (token, details) => {
    try {
        const eventDescription = `${details.description}\n${details.link != '' ? `Link: ${details.link}` : ''}`
        const event = {
            summary: details.eventName,
            description: eventDescription,
            location: `${details.location == '' ? '': details.venue}`,
            start: {
                dateTime: details.startTime,
                timezone: 'Singapore'
            },
            end: {
                dateTime: details.endTime,
                timezone: 'Singapore'
            }
        }
        const res3 = await axios.post(`${gapiURL}/calendar/v3/calendars/primary/events?key=${gapiKey}`, event, {headers: {Authorization: `Bearer ${token}`}})
    } catch (err) {
        Alert.alert('Adding event to calendar failed')
    }
}
export default function EventDetailsPage (props) {
    const [details, setDetails] = useState({})
    const [isModalVisible, setIsModalVisible] = useState(false)
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
    const schedDetails = {
        date: moment(details.startTime,`${'YYYY-MM-DD'}T${'HH:mm:ss.sssZ'}`).format('DD MMM YYYY'), 
        time: [moment(details.startTime,`${'YYYY-MM-DD'}T${'HH:mm:ss.sssZ'}`).format('HH:mm'), moment(details.endTime, `${'YYYY-MM-DD'}T${'HH:mm:ss.sssZ'}`).format('HH:mm')], 
        venue: details.venue == '' ? 'Online' : details.venue,
        link: details.link,
}
    const styles = StyleSheet.create ({
        imageWrapper: {
            marginTop: 5,
            marginBottom: 10,
            marginHorizontal: 30,
            alignItems: 'center',
            height: 'auto',
        },
        image: {
            flex: 1,
            resizeMode: 'contain',
            width: '100%',
            height: 300,
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
            paddingVertical: 15
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
    
    //Modal handlers
    const addToCalendarHandler = async () => {
        try {
            const gToken = await AsyncStorage.getItem('googleOAuth')
            if (gToken === null) {
                const { type, accessToken, user } = await Google.logInAsync (googleConfig)
                if (type === 'success') {
                    await AsyncStorage.setItem('googleOAuth', accessToken)
                    await createEvent(accessToken, details)
                }
                setIsModalVisible(true)
            }
            else {
                try {
                    await createEvent(gToken, details)
                    setIsModalVisible(true)
                }
                //If token expires, it will prompt users to login again
                catch (err) {
                    await AsyncStorage.setItem('googleOAuth', null)
                    addToCalendarHandler()
                }
            }
        } catch (err) {
            
        }
    }
    const closeModalHandler = () => {
        setIsModalVisible(false)
    }
    const exitPageHandler = () => {
        setIsModalVisible(false)
        props.navigation.goBack()
    }
    listItems()
    useEffect (() => {
        async function loadEvent() {
            try {
                const res = await axios.get(`${URL}/users/reminders/${eventID}`, authenticate(store.getState().main.token))
                setDetails(res.data)
                setIsLoading(false)
            } catch (err) {
                Alert.alert('Loading events failed')
            }
        }
        loadEvent()
    },[])
    return (isLoaded &&
        <SafeAreaView style={page.main}>
            <SubNavbar title={details.eventName} pressed={onBackPress} />
            <WithLoading isLoading={isLoading} loadingMessage='Loading details...'>
            <ScrollView>
                <View style={page.main}>
                    <View style={styles.imageWrapper}>
                        <Image style={{...styles.image, height: details.image==null ? 0 : 300}} source={{uri: details.image}} />
                    </View>
                    <Text style={{...font.articleTitle,...styles.pageTitle}}>{details.eventName}</Text>
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
            <ConfirmationModal isModalVisible={isModalVisible} closeModal={closeModalHandler} submitHandler={exitPageHandler} />
        </SafeAreaView>
    )
}