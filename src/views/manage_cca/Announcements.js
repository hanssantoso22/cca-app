import React from 'react';
import { page } from '../../components/common/styles'
import { View, Text, FlatList } from 'react-native'
import CreatedAnnouncementCard from '../../components/manage_cca/CreatedAnnouncementCard'

export default function AnnouncementsTab (props) {
    const createdAnnouncements = [
        {id: 0, name: 'Arduino Workshop', organizer: 'Garage @EEE'},
        {id: 1, name: 'Introduction to Machine Learning and Deep Learning', organizer: 'MLDA @EEE'},
        {id: 2, name: 'Subcommittee Recruitment Talk', organizer: 'EEE Club'}
    ]
    const editHandler = (announcementID) => {

    }
    const deleteHandler = (announcementID) => {

    }
    return (
        <View style={page.main}>
            <FlatList data={createdAnnouncements}
                    keyExtractor={(item)=>item.id}
                    renderItem={({ item })=> (
                        <CreatedAnnouncementCard name={item.name} organizer={item.organizer} edit={editHandler.bind(this,item.id)} delete={deleteHandler.bind(this,item.id)} />
                    )}
            />
        </View>
    )
}