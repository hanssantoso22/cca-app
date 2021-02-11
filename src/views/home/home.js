import React, { useState } from 'react'
import Constants from 'expo-constants'
import * as Permissions from 'expo-permissions'
import { useSelector, useDispatch } from 'react-redux'
import { changeAskPushNotification } from '../../redux/reducers/mainSlice'
import { Notifications } from 'expo'
import { useFocusEffect } from '@react-navigation/native'
import Navbar from '../../components/common/navigation/navbar/navbar'
import WithLoading from '../../components/hoc/withLoading'
import NoItemLoaded from '../../components/common/NoItemLoaded'
import { page, GREY } from '../../components/common/styles'
import { SafeAreaView, View, FlatList } from 'react-native'
import NewsCard from '../../components/home/NewsCard'

import axios from 'axios'
import {URL, authenticate} from '../../api/config'
import store from '../../redux/store/store'


// const registerForPushNotificationsAsync = async () => {
//     if (Constants.isDevice) {
//       const { status: existingStatus } = await Notifications.getPermissionsAsync();
//       let finalStatus = existingStatus;
//       if (existingStatus !== 'granted') {
//         const { status } = await Notifications.requestPermissionsAsync();
//         finalStatus = status;
//       }
//       if (finalStatus !== 'granted') {
//         console.log('Failed to get push token for push notification!');
//         return;
//       }
//       const token = (await Notifications.getExpoPushTokenAsync()).data;
//       console.log(token);
//     } else {
//       console.log('Must use physical device for Push Notifications');
//     }
  
//     if (Platform.OS === 'android') {
//       Notifications.setNotificationChannelAsync('default', {
//         name: 'default',
//         importance: Notifications.AndroidImportance.MAX,
//         vibrationPattern: [0, 250, 250, 250],
//         lightColor: '#FF231F7C',
//       });
//     }
// };
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
    // const registerForPushNotifications = async () => { 
    //     try {
    //         const askedBefore = store.getState().main.askPushNotification
    //         const { existingStatus } = await Permissions.getAsync(Permissions.NOTIFICATIONS)
    //         let finalStatus = existingStatus
    //         if (existingStatus !== 'granted' && !askedBefore) {
    //             const { status } = await Permissions.askAsync(Permissions.NOTIFICATIONS)
    //             dispatch (changeAskPushNotification(true))
    //             finalStatus = status
    //             if (status !== 'granted') return
    //             const token = (await Notifications.getExpoPushTokenAsync()).data
    //             const res = await axios.patch(`${URL}/users/pushNotificationToken`, { token }, authenticate(store.getState().main.token))
    //             console.log(res)
    //         }
    //     } catch (error) {
    //         console.log('Error getting a token', error)
    //     }
    // }
    useFocusEffect(() => {
        async function fetchData() {
            try {
                const response = await axios.get(`${URL}/announcements`, authenticate(store.getState().main.token))
                const data = response.data
                setAnnouncements(data)
                setIsLoading(false)
                // await registerForPushNotifications()
            } catch (err) {
                console.log(err)
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