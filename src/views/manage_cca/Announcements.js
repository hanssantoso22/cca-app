import React, { useState } from 'react';
import { page } from '../../components/common/styles'
import { View, Text, FlatList } from 'react-native'
import CreatedAnnouncementCard from '../../components/manage_cca/CreatedAnnouncementCard'
import DeleteAnnouncementModal from './DeleteAnnouncementModal'

export default function AnnouncementsTab (props) {
    const createdAnnouncements = [
        {id: 0, name: 'Arduino Workshop', organizer: 'Garage @EEE'},
        {id: 1, name: 'Introduction to Machine Learning and Deep Learning', organizer: 'MLDA @EEE'},
        {id: 2, name: 'Subcommittee Recruitment Talk', organizer: 'EEE Club'}
    ]
    const [displayModal, setDisplayModal] = useState(false)
    const [selectedID, setSelectedID] = useState()
    const editHandler = (announcementID) => {
        props.navigation.navigate('EditAnnouncementScreen',{
            announcementID
        })
    }
    const deleteHandler = (eventID) => {
        setSelectedID(eventID)
        setDisplayModal(true)
    }
    const cancelHandler = () => {
        setDisplayModal(false)
    }
    const confirmHandler = (eventID) => {
        setDisplayModal(false)
        props.navigation.navigate('Announcements',{eventID: eventID})
        // ADD EDIT DATABASE CODE HERE
    }
    const closeModalHandler = () => {
        setDisplayModal(false)
    }
    return (
        <View style={page.main}>
            <FlatList data={createdAnnouncements}
                    keyExtractor={(item)=>item.id}
                    renderItem={({ item })=> (
                        <CreatedAnnouncementCard name={item.name} organizer={item.organizer} edit={editHandler.bind(this,item.id)} delete={deleteHandler.bind(this,item.id)} />
                    )}
            />
            <DeleteAnnouncementModal isModalVisible={displayModal} closeModal={closeModalHandler} cancelHandler={cancelHandler} confirmHandler={confirmHandler} eventID={selectedID}/>
        </View>
    )
}