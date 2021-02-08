import React, { useState, useEffect } from 'react'
import moment from 'moment'
import SubNavbar from '../../components/common/navigation/navbar/SubNavbar'
import WithLoading from '../../components/hoc/withLoading'
import { page, GREY, marginHorizontal, font } from '../../components/common/styles'
import { SafeAreaView, View, Text, StyleSheet, ScrollView, Image } from 'react-native'
import { useFonts, Lato_700Bold, Lato_400Regular, Lato_400Regular_Italic } from '@expo-google-fonts/lato'
import Dummy1 from '../../assets/dummy/image005.jpg'

import axios from 'axios'
import {URL, authenticate} from '../../api/config'
import store from '../../redux/store/store'

export default function ArticleDetailPage (props) {
    const [announcement, setAnnouncement] = useState({organizer: ''})
    const [isLoading, setIsLoading] = useState(true)
    const [isLoaded] = useFonts({
        Lato_400Regular,
        Lato_400Regular_Italic,
        Lato_700Bold
    })
    const loaded = isLoaded
    const onBackPress = () => {
        props.navigation.goBack()
    }
    const { articleID } = props.route.params
    const styles = StyleSheet.create ({
        imageWrapper: {
            marginTop: 5,
            marginBottom: 10,
            alignItems: 'center',
            flex: 1,
            height: 300,
            width: '100%',
        },
        pageTitle: {
            fontFamily: 'Lato_700Bold',
            marginLeft: 30,
            marginBottom: marginHorizontal,
        },
        smallDetailsWrapper: {
            marginVertical: 5,
            paddingHorizontal: 30,
        },
        image: {
            flex: 1,
            resizeMode: 'contain',
        },
        smallDetailsFont: {
            fontFamily: 'Lato_400Regular_Italic',
            fontSize: 13,
            color: GREY[3]
        },
        articleBodyWrapper: {
            paddingHorizontal: 30,
        },
        articleFont: {
            fontFamily: 'Lato_400Regular'
        },
    })
    useEffect (() => {
        async function loadAnnouncement () {
            try {
                const res = await axios.get(`${URL}/announcement/${articleID}`, authenticate(store.getState().main.token))
                setAnnouncement(res.data)
                setIsLoading(false)
            } catch (err) {
        
            }
        }
        loadAnnouncement()
    },[])
    return (

            <SafeAreaView style={page.main}>
                <SubNavbar title={announcement.announcementTitle} pressed={onBackPress} />
                <WithLoading isLoading={isLoading} loadingMessage='Loading details...'>
                <ScrollView>
                    <View style={page.main}>
                        <Text style={{...font.articleTitle,...styles.pageTitle}}>{announcement.announcementTitle}</Text>
                        <View style={styles.imageWrapper}>
                            <Image style={styles.image} source={Dummy1} />
                        </View>
                        <View style={styles.smallDetailsWrapper}>
                            <Text style={styles.smallDetailsFont}>Published on: {moment(announcement.createdAt,`${'YYYY-MM-DD'}T${'HH:mm:ss.sssZ'}`).format('LL')}</Text>
                            <Text style={styles.smallDetailsFont}>by {announcement.organizer.ccaName}</Text>
                        </View>
                        <View style={styles.articleBodyWrapper}>
                            <Text style={{...font.articleBody,...styles.articleFont}}>
                                {announcement.content}
                            </Text>
                        </View>
                    </View>
                </ScrollView>
                </WithLoading>
            </SafeAreaView>
        
    )
}