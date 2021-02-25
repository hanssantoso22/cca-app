import React, { useState } from 'react'
import moment from 'moment'
import * as Print from 'expo-print'
import * as MediaLibrary from 'expo-media-library'
import { useFocusEffect } from '@react-navigation/native'
import { page, GREY } from '../../components/common/styles'
import WithLoading from '../../components/hoc/withLoading'
import LoadNoItem from '../../components/common/NoItemLoaded'
import { View, FlatList, StyleSheet, Image, Dimensions, Alert, TouchableWithoutFeedback } from 'react-native'
import PastEventCard from '../../components/events/PastEventCard'
import AttendanceModal from './AttendanceModal'
import DownloadButton from '../../assets/common/icons/download_floating.png'

import axios from 'axios'
import {URL, authenticate} from '../../api/config'
import store from '../../redux/store/store'

export default function PastRegisteredEvents (props) {
    const [pastEvents, setPastEvents] = useState([])
    const [isLoading, setIsLoading] = useState(true)
    const [selectedCard, setSelectedCard] = useState('')
    const iconSize = 65
    const styles = StyleSheet.create({
        downloadButtonWrapper: {
            position: 'absolute',
            bottom: 30,
            right: (Dimensions.get('window').width/2)-(iconSize/2)
        },
        icon: {
            width: iconSize,
            height: iconSize
        }
    })
    const onPressHandler = (eventID) => {
        setSelectedCard(eventID)
        setDisplayModal(true)
    }

    const [displayModal, setDisplayModal] = useState()
    const didNotAttendHandler = async (eventID) => {
        try {
            const res = await axios.delete(`${URL}/users/pastEvent/${eventID}/delete`, authenticate(store.getState().main.token))
            setDisplayModal(false)
        } catch (err) {
            console.log(err)
        }
    }
    const attendedHandler = (eventID) => {
        setDisplayModal(false)
        props.navigation.navigate('PastEventRating',{eventID})
    }
    const closeModalHandler = () => {
        setDisplayModal(false)
    }
    const downloadRecordsHandler = async () => {
        try {
            let htmlScript = `
                <h2>CCA Records</h2><br><br>
                <table><tr><th>Event</th><th>Date</th><th>Organizer</th><th>Description</th></tr>
            `
            pastEvents.forEach(pastEvent => {
                const eventDate = moment(pastEvent.event.startTime,`${'YYYY-MM-DD'}T${'HH:mm:ss.sssZ'}`).format('DD MMM YYYY')
                htmlScript+=`<tr><td>${pastEvent.event.eventName}</td><td>${eventDate}</td><td>${pastEvent.organizer.ccaName}</td><td>${pastEvent.event.description}</td></tr>`
            })
            htmlScript+=`</table>`
            const options = {
                html: htmlScript,
            }
            const file = await Print.printToFileAsync(options)
            const permissionStatus = await MediaLibrary.getPermissionsAsync()
            if (permissionStatus) await MediaLibrary.requestPermissionsAsync()
            const asset = await MediaLibrary.createAssetAsync(file.uri)
            const album = await MediaLibrary.getAlbumAsync('Downloads')
            if (album == null) {
                await MediaLibrary.createAlbumAsync('Download', asset, false)
            } else {
                await MediaLibrary.addAssetsToAlbumAsync([asset], album, false)
            }
            console.log(file)
            
        } catch (err) {
            console.log(err)
            Alert.alert('Download failed')
        }
    }
    useFocusEffect(() => {
        async function loadPastEvents () {
            try {
                const res = await axios.get(`${URL}/users/pastEvents`, authenticate(store.getState().main.token))
                setPastEvents(res.data)
                setIsLoading(false)
            } catch (err) {
                console.log(err)
            }
        }
        loadPastEvents()
    })
    return (
        <View style={page.main}>
            <WithLoading isLoading={isLoading} loadingMessage='Loading events...'>
            {pastEvents.length == 0 ? 
                <LoadNoItem color={GREY[2]} message={`Everything is loaded :)\n`} />
            : 
                <>
                <FlatList data={pastEvents}
                    keyExtractor={(item)=>item._id}
                    renderItem={({ item })=> (
                        <PastEventCard name={item.event.eventName} organizer={item.organizer.ccaName} read={item.read} pressed={item.read ? null : onPressHandler.bind(this,item._id)}/>
                    )}
                />
                <View style={styles.downloadButtonWrapper}>
                    <TouchableWithoutFeedback onPress={downloadRecordsHandler}>
                        <Image style={styles.icon} source={DownloadButton} />
                    </TouchableWithoutFeedback>
                </View>
                </>
            }
            </WithLoading>
            <AttendanceModal isModalVisible={displayModal} closeModal={closeModalHandler} didNotAttendHandler={didNotAttendHandler} attendedHandler={attendedHandler} eventID={selectedCard}/>
        </View>
    )
}