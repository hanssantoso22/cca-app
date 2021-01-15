import React, { useState } from 'react';
import { page } from '../../components/common/styles'
import { View, Text, FlatList } from 'react-native'
import PastEventCard from '../../components/events/PastEventCard'
import AttendanceModal from './AttendanceModal'

export default function PastRegisteredEvents (props) {
    const pastEvents = [
        {id: 0, name: 'Arduino Workshop', organizer: 'Garage @EEE', read: false},
        {id: 1, name: 'Introduction to Machine Learning and Deep Learning', organizer: 'MLDA @EEE', read: true},
        {id: 2, name: 'Subcommittee Recruitment Talk', organizer: 'EEE Club', read: false}
    ]
    const [selectedCard, setSelectedCard] = useState('')
    const onPressHandler = (eventID) => {
        setSelectedCard(eventID)
        setDisplayModal(true)
    }
    const [displayModal, setDisplayModal] = useState()
    const didNotAttendHandler = () => {
        setDisplayModal(false)
        props.navigation.navigate('Events')
    }
    const attendedHandler = (eventID) => {
        setDisplayModal(false)
        props.navigation.navigate('PastEventRating',{eventID})
    }
    const closeModalHandler = () => {
        setDisplayModal(false)
    }
    return (
        <View style={page.main}>
            <FlatList data={pastEvents}
                        keyExtractor={(item)=>item.id}
                        renderItem={({ item })=> (
                            <PastEventCard name={item.name} organizer={item.organizer} read={item.read} pressed={onPressHandler.bind(this,item.id)}/>
                        )}
            />
            <AttendanceModal isModalVisible={displayModal} closeModal={closeModalHandler} didNotAttendHandler={didNotAttendHandler} attendedHandler={attendedHandler} eventID={selectedCard}/>
        </View>
    )
}