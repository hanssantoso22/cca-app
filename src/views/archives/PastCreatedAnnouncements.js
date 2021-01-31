import React, { useEffect, useState } from 'react';
import { page } from '../../components/common/styles'
import { View, Text, FlatList } from 'react-native'
import PastAnnouncementCard from '../../components/archives/PastAnnouncementCard'
import { useFocusEffect } from '@react-navigation/native'

import axios from 'axios'
import {URL, authenticate} from '../../api/config'
import store from '../../redux/store/store'

export default function PastCreatedAnnouncements (props) {
    // const [pastAnnouncements, setPastAnnouncements] = useState([])
    const pastAnnouncements = [
        {id: 0, name: 'Arduino Workshop', organizer: 'Garage @EEE', read: false},
        {id: 1, name: 'Introduction to Machine Learning and Deep Learning', organizer: 'MLDA @EEE', read: true},
        {id: 2, name: 'Subcommittee Recruitment Talk', organizer: 'EEE Club', read: false}
    ]
    const onPressHandler = (announcementID) => {
        return null
    }
    useFocusEffect(() => {
        async function loadCreatedAnnouncements () {
            try {
                const res = await axios.get()
            } catch (err) {
                console.log(err)
            }
        }
        loadCreatedAnnouncements()
    }, [])
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