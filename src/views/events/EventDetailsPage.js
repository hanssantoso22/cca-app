import React, { useState, useEffect } from 'react'
import moment from 'moment'
import SubNavbar from '../../components/common/navigation/navbar/SubNavbar'
import WithLoading from '../../components/hoc/withLoading'
import { page, GREY, marginHorizontal, font, MING } from '../../components/common/styles'
import { SafeAreaView, View, Text, StyleSheet, ScrollView, TouchableWithoutFeedback, Image, Alert } from 'react-native'
import { useFonts, Lato_700Bold, Lato_400Regular, Lato_400Regular_Italic } from '@expo-google-fonts/lato'
import PrimaryButton from '../../components/common/buttons/PrimaryBig'
import PrimaryDisabled from '../../components/common/buttons/PrimaryBigDisabled'
import ConfirmationModal from './ConfirmationModal'

import axios from 'axios'
import {URL, authenticate} from '../../api/config'
import store from '../../redux/store/store'

export default function EventDetailsPage (props) {
    const [isLoading, setIsLoading] = useState(true)
    const [details, setDetails] = useState({organizer:''})
    const [isLoaded] = useFonts({
        'MaterialIcons-Regular': require('../../assets/fonts/MaterialIcons-Regular.ttf'),
        Lato_400Regular,
        Lato_700Bold,
        Lato_400Regular_Italic
    })
    const onBackPress = () => {
        props.navigation.goBack()
    }
    const { eventID } = props.route.params
    const schedDetails = {
        date: moment(details.startTime,`${'YYYY-MM-DD'}T${'HH:mm:ss.sssZ'}`).format('DD MMM YYYY'), 
        time: [moment(details.startTime,`${'YYYY-MM-DD'}T${'HH:mm:ss.sssZ'}`).format('HH:mm'), moment(details.endTime, `${'YYYY-MM-DD'}T${'HH:mm:ss.sssZ'}`).format('HH:mm')], 
        venue: details.venue == '' ? 'Online' : details.venue, 
    }
    const styles = StyleSheet.create ({
        imageWrapper: {
            marginTop: 5,
            marginBottom: 10,
            marginHorizontal: 30,
            alignItems: 'center',
            height: 'auto',
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
            paddingVertical: 15,
        },
        hyperlink: {
            fontFamily: 'Lato_400Regular_Italic',
            fontSize: 13,
            color: MING[5],
            marginBottom: 15,
            marginHorizontal: 30
        },
        image: {
            flex: 1,
            resizeMode: 'contain',
            width: '100%',
            height: 300,
        },
    })
    const renderSchedDetails = []
    const listItems = () => {
        const icons = {date: 'calendar_today', time: 'access_time', venue: 'place', link: 'link'}
        for (const [key,value] of Object.entries(schedDetails)) {
            const isLink = key=='link'
            const labelStyle = !isLink?{...font.articleBody, paddingRight: 40}:{...font.articleBody, paddingRight: 40,...font.link}
            if (key=='time') {
                renderSchedDetails.push(
                    <View key={key} style={{flexDirection: 'row', marginBottom: 20}}>
                        <Text style={styles.materialIcon}>{icons[key]}</Text>
                        <Text style={labelStyle}>{`${value[0]} - ${value[1]}`}</Text>
                    </View>
                )
                continue
            }
            renderSchedDetails.push(
                <View key={key} style={{flexDirection: 'row', marginBottom: 20}}>
                    <Text style={styles.materialIcon}>{icons[key]}</Text>
                    <Text style={labelStyle}>{value}</Text>
                </View>
            )
        }
    }
    const [displayModal, setDisplayModal] = useState(false)
    const closeModalHandler = () => {
        setDisplayModal(false)
    }
    const registerHandler = async (eventID) => {
        try {
            const res = await axios.post(`${URL}/event/${eventID}/register`, {}, authenticate (store.getState().main.token))
            setDisplayModal(true)
        } catch (err) {

        }
    }
    const submitModalHandler = () => {
        props.navigation.reset({
            index: 0,
            routes: [{'name': 'Events'}]
        })
    }
    listItems()
    useEffect(() => {
        async function loadEventDetails () {
            try {
                const res = await axios.get(`${URL}/event/${eventID}`, authenticate(store.getState().main.token))
                setDetails(res.data)
                setIsLoading(false)
            } catch (err) {
                
            }
        }
        loadEventDetails()
    }, [])

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
                        <TouchableWithoutFeedback onPress={()=>props.navigation.navigate('CCADetailScreenPublic',{ccaID: details.organizer._id})}>
                            <Text style={styles.hyperlink}>by {details.organizer.ccaName}</Text>
                        </TouchableWithoutFeedback>
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
                    {!details.canRegister ? 
                        <PrimaryDisabled fontSize={20} text='Cannot Register' />
                    : details.registered ? 
                        <PrimaryDisabled fontSize={20} text='Registered' />
                    :
                        <PrimaryButton fontSize={20} pressHandler={registerHandler.bind(this, eventID)} text='Register' />
                    }
                </View>
            </WithLoading>
            <ConfirmationModal isModalVisible={displayModal} closeModal={closeModalHandler} submitHandler={submitModalHandler} />
        </SafeAreaView>
    )
}