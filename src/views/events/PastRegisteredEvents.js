import React, { useState } from 'react'
import { useFocusEffect } from '@react-navigation/native'
import { page, GREY } from '../../components/common/styles'
import WithLoading from '../../components/hoc/withLoading'
import LoadNoItem from '../../components/common/NoItemLoaded'
import { View, FlatList } from 'react-native'
import PastEventCard from '../../components/events/PastEventCard'
import AttendanceModal from './AttendanceModal'

import axios from 'axios'
import {URL, authenticate} from '../../api/config'
import store from '../../redux/store/store'

export default function PastRegisteredEvents (props) {
    const [pastEvents, setPastEvents] = useState([])
    const [isLoading, setIsLoading] = useState(true)
    // const pastEvents = [
    //     {id: 0, name: 'Arduino Workshop', organizer: 'Garage @EEE', read: false},
    //     {id: 1, name: 'Introduction to Machine Learning and Deep Learning', organizer: 'MLDA @EEE', read: true},
    //     {id: 2, name: 'Subcommittee Recruitment Talk', organizer: 'EEE Club', read: false}
    // ]
    const [selectedCard, setSelectedCard] = useState('')
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
                <FlatList data={pastEvents}
                    keyExtractor={(item)=>item._id}
                    renderItem={({ item })=> (
                        <PastEventCard name={item.event.eventName} organizer={item.organizer.ccaName} read={item.read} pressed={item.read ? null : onPressHandler.bind(this,item._id)}/>
                    )}
                />
            }
            </WithLoading>
            <AttendanceModal isModalVisible={displayModal} closeModal={closeModalHandler} didNotAttendHandler={didNotAttendHandler} attendedHandler={attendedHandler} eventID={selectedCard}/>
        </View>
    )
}