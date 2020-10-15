import React from 'react';
import { page } from '../../components/common/styles'
import { View, Text, FlatList } from 'react-native'
import CreatedEventCard from '../../components/manage_cca/CreatedEventCard'

export default function EventsTab (props) {
    const createdEvents = [
        {id: 0, name: 'Arduino Workshop', organizer: 'Garage @EEE'},
        {id: 1, name: 'Introduction to Machine Learning and Deep Learning', organizer: 'MLDA @EEE'},
        {id: 2, name: 'Subcommittee Recruitment Talk', organizer: 'EEE Club'}
    ]
    const onClickHandler = (eventID) => {
        return null
    }
    return (
        <View style={page.main}>
            <FlatList data={createdEvents}
                    keyExtractor={(item)=>item.id}
                    renderItem={({ item })=> (
                        <CreatedEventCard name={item.name} organizer={item.organizer} pressed={onClickHandler.bind(this,item.id)} />
                    )}
            />
        </View>
    )
}