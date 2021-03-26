import React, { useState } from 'react'
import { useDispatch } from 'react-redux'
import { useFocusEffect } from '@react-navigation/native'
import Navbar from '../../components/common/navigation/navbar/navbar'
import WithLoading from '../../components/hoc/withLoading'
import NoItemLoaded from '../../components/common/NoItemLoaded'
import { page, GREY } from '../../components/common/styles'
import { SafeAreaView, View, FlatList, Alert } from 'react-native'
import NewsCard from '../../components/home/NewsCard'

import axios from 'axios'
import {URL, authenticate} from '../../api/config'
import store from '../../redux/store/store'
import { logout } from '../../redux/reducers/mainSlice'

export default function home (props) {
    const [isLoading, setIsLoading] = useState(true)
    const [announcements, setAnnouncements] = useState([])
    const dispatch = useDispatch()
    const onMenuPress = () => {
        props.navigation.openDrawer()
    }
    const onCardPressHandler = (articleID) => {
        props.navigation.navigate('ArticleDetail', {
            articleID
        })
    }
    useFocusEffect(() => {
        async function fetchData() {
            try {
                const response = await axios.get(`${URL}/announcements`, authenticate(store.getState().main.token))
                const data = response.data
                setAnnouncements(data)
                setIsLoading(false)
            } catch (err) {
                if (err.response.status === 401) return dispatch(logout(store.getState().main.token))
                Alert.alert('Loading announcements failed')
            }
        }
        fetchData()
    },[])
    return (
        <SafeAreaView >
            <Navbar title="Home" pressed={onMenuPress} />
            <WithLoading isLoading={isLoading} loadingMessage="Loading announcements...">
            <View style={page.main}>
                {announcements.length == 0 ? 
                    <NoItemLoaded color={GREY[2]} message={`Everything is loaded :)\nIt seems there's no announcement right now.`} />
                : 
                    <FlatList data={announcements}
                        keyExtractor={item => item._id}
                        renderItem={({ item }) => (
                            <NewsCard imgSource={item.image} pressed={onCardPressHandler.bind(this,item._id)} title={item.announcementTitle} description={item.content} />
                        )}
                    />
                }
            </View>
            </WithLoading>
        </SafeAreaView>
    )
}