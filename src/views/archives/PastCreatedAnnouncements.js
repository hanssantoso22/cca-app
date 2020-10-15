import React from 'react';
import { page } from '../../components/common/styles'
import { View, Text, FlatList } from 'react-native'
import PastAnnouncementCard from '../../components/archives/PastAnnouncementCard'

export default function PastCreatedAnnouncements (props) {
    const pastAnnouncements = [
        {id: 0, name: 'Arduino Workshop', organizer: 'Garage @EEE', read: false},
        {id: 1, name: 'Introduction to Machine Learning and Deep Learning', organizer: 'MLDA @EEE', read: true},
        {id: 2, name: 'Subcommittee Recruitment Talk', organizer: 'EEE Club', read: false}
    ]
    const onPressHandler = (announcementID) => {
        return null
    }
    return (
        <View style={page.main}>
            <FlatList data={pastAnnouncements}
                        keyExtractor={(item)=>item.id}
                        renderItem={({ item })=> (
                            <PastAnnouncementCard name={item.name} organizer={item.organizer} pressed={onPressHandler.bind(this,item.id)} />
                        )}
            />
        </View>
    )
}