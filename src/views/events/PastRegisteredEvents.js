import React, { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import moment from 'moment'
import * as Print from 'expo-print'
import * as Sharing from 'expo-sharing'
import * as MediaLibrary from 'expo-media-library'
import { useFocusEffect } from '@react-navigation/native'
import { page, GREY } from '../../components/common/styles'
import WithLoading from '../../components/hoc/withLoading'
import LoadingOverlay from '../../components/common/LoadingOverlay'
import LoadNoItem from '../../components/common/NoItemLoaded'
import { View, FlatList, StyleSheet, Image, Dimensions, Alert, TouchableWithoutFeedback, Platform } from 'react-native'
import PastEventCard from '../../components/events/PastEventCard'
import AttendanceModal from './AttendanceModal'
import DownloadButton from '../../assets/common/icons/download_floating.png'

import axios from 'axios'
import {URL, authenticate} from '../../api/config'
import store from '../../redux/store/store'

export default function PastRegisteredEvents (props) {
    const [dataRes, setDataRes] = useState({pastEvents: [], pastCCAs: []})
    const [isSubmitLoading, setIsSubmitLoading] = useState(false)
    const [isLoading, setIsLoading] = useState(true)
    const [selectedCard, setSelectedCard] = useState('')
    const user = useSelector(state => state.main.user)
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
            setIsSubmitLoading(true)
            let htmlScript = `
                <style>
                    @page {
                        margin: 2.54cm;
                    }
                    th {
                        background-color: #205F67;
                        color: white;
                        padding: 15px;
                    }
                    td {
                        padding: 15px;
                    }
                    col-1 {
                        width: 15%;
                    }
                    col-2 {
                        width: 15%;
                    }
                    col-3 {
                        width: 15%;
                    }
                </style>
                <center><h2>School of Eletrical and Electronic Engineering</h2></center><br>
                <p>Dear ${user.fname},</p>
                <p>We would like to thank you for your participation in the events conducted by the School of Electrical and Electronic Engineering, and active contribution
                in Co-Curricular Activities. Hereby, this is the summary of your active contribution in the School of Electrical and Electronic Engineering.</p>
            `
            if (dataRes.pastCCAs.length > 0) {
                htmlScript+=`<h5>Leadership Activities</h5><table cellspacing="0" border="2"><tr><th class="col-1">Organization</th><th class="col-2">Period</th><th class="col-3">Position</th><th>Description</th></tr>`
                dataRes.pastCCAs.forEach(pastCCA => {
                    const starting = moment(pastCCA.start,`${'YYYY-MM-DD'}T${'HH:mm:ss.sssZ'}`).format('MMM YYYY')
                    const ending = moment(pastCCA.end,`${'YYYY-MM-DD'}T${'HH:mm:ss.sssZ'}`).format('MMM YYYY')
                    const executives = pastCCA.executives.filter(exco => exco._id == user._id)
                    const maincomms = pastCCA.maincomms.filter(maincomm => maincomm._id == user._id)
                    htmlScript+=`<tr><td>${pastCCA.ccaName}</td><td>${starting} - ${ending}</td>`
                    if (executives.length > 0) {
                        htmlScript+=`<td>Executive Committee</td>`
                    }
                    else if (maincomms.length > 0) {
                        htmlScript+=`<td>Main Committee</td>`
                    }
                    else {
                        htmlScript+=`<td>Sub Committee</td>`
                    }
                    htmlScript+=`<td>${pastCCA.ccaDescription}</td></tr>`
                })
                htmlScript+=`</table>`
            }
            if (dataRes.pastEvents.length > 0) {
                htmlScript+=`<h5>Event Participation</h5><table cellspacing="0" border="2"><tr><th class="col-1">Event</th><th class="col-2">Date</th><th class="col-3">Organizer</th><th>Description</th></tr>`
                dataRes.pastEvents.forEach(pastEvent => {
                    if (pastEvent.read == true) {
                        const eventDate = moment(pastEvent.event.startTime,`${'YYYY-MM-DD'}T${'HH:mm:ss.sssZ'}`).format('DD MMM YYYY')
                        htmlScript+=`<tr><td>${pastEvent.event.eventName}</td><td>${eventDate}</td><td>${pastEvent.organizer.ccaName}</td><td>${pastEvent.event.description}</td></tr>`
                    }
                })
                htmlScript+=`</table>`
            }
            const options = {
                html: htmlScript,
            }
            const file = await Print.printToFileAsync(options)
            if (Platform.OS == 'ios'){
                const res = await Sharing.shareAsync(file.uri)
            }
            else {
                await MediaLibrary.requestPermissionsAsync()
                const asset = await MediaLibrary.createAssetAsync(file.uri)
                const album = await MediaLibrary.getAlbumAsync('Downloads')
                if (album == null) {
                    await MediaLibrary.createAlbumAsync('Downloads', asset, false)
                } else {
                    await MediaLibrary.addAssetsToAlbumAsync([asset], album, false)
                }
            }
            setIsSubmitLoading(false)
            Alert.alert('Download successful')
            
        } catch (err) {
            setIsSubmitLoading(false)
            Alert.alert('Download failed')
        }
    }
    useFocusEffect(() => {
        async function loadPastEvents () {
            try {
                const res = await axios.get(`${URL}/users/pastEvents`, authenticate(store.getState().main.token))
                setDataRes(res.data)
                setIsLoading(false)
            } catch (err) {
                Alert.alert('Loading details failed')
            }
        }
        loadPastEvents()
    }, [])
    return (
        <View style={page.main}>
            {isSubmitLoading && <LoadingOverlay />}
            <WithLoading isLoading={isLoading} loadingMessage='Loading events...'>
            {dataRes.pastEvents.length == 0 ? 
                <LoadNoItem color={GREY[2]} message={`Everything is loaded :)\n`} />
            : 
                <FlatList data={dataRes.pastEvents}
                    keyExtractor={(item)=>item._id}
                    renderItem={({ item })=> (
                        <PastEventCard name={item.event.eventName} organizer={item.organizer.ccaName} read={item.read} pressed={item.read ? null : onPressHandler.bind(this,item._id)}/>
                    )}
                />
            }
            {dataRes.pastCCAs.length > 0 &&
                <View style={styles.downloadButtonWrapper}>
                    <TouchableWithoutFeedback onPress={downloadRecordsHandler}>
                        <Image style={styles.icon} source={DownloadButton} />
                    </TouchableWithoutFeedback>
                </View>
            }
            </WithLoading>
            <AttendanceModal isModalVisible={displayModal} closeModal={closeModalHandler} didNotAttendHandler={didNotAttendHandler} attendedHandler={attendedHandler} eventID={selectedCard}/>
        </View>
    )
}