import React, { useState, useEffect } from 'react'
import moment from 'moment'
import SubNavbar from '../../components/common/navigation/navbar/SubNavbar'
import WithLoading from '../../components/hoc/withLoading'
import { page, GREY, marginHorizontal, font, MING } from '../../components/common/styles'
import { SafeAreaView, View, Text, StyleSheet, ScrollView, Image, Alert, TouchableWithoutFeedback } from 'react-native'
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
    const onBackPress = () => {
        props.navigation.goBack()
    }
    const { articleID } = props.route.params
    const styles = StyleSheet.create ({
        imageWrapper: {
            marginTop: 5,
            marginBottom: 10,
            marginHorizontal: 30,
            alignItems: 'center',
            height: 'auto',
        },
        pageTitle: {
            fontFamily: 'Lato_700Bold',
            marginHorizontal: 30,
            marginBottom: marginHorizontal,
        },
        smallDetailsWrapper: {
            marginVertical: 5,
            paddingHorizontal: 30,
        },
        image: {
            flex: 1,
            resizeMode: 'contain',
            width: '100%',
            height: 300,
        },
        smallDetailsFont: {
            fontFamily: 'Lato_400Regular_Italic',
            fontSize: 13,
            color: GREY[3],
            marginBottom: 5,
        },
        hyperlink: {
            fontFamily: 'Lato_400Regular_Italic',
            fontSize: 13,
            color: MING[5]
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
                Alert.alert('Loading details error')
            }
        }
        loadAnnouncement()
    },[])
    return (isLoaded &&
            <SafeAreaView style={page.main}>
                <SubNavbar title={announcement.announcementTitle} pressed={onBackPress} />
                <WithLoading isLoading={isLoading} loadingMessage='Loading details...'>
                <ScrollView>
                    <View style={page.main}>
                        <Text style={{...font.articleTitle,...styles.pageTitle}}>{announcement.announcementTitle}</Text>
                        <View style={styles.imageWrapper}>
                            <Image style={{...styles.image, height: announcement.image==null ? 0 : 300}} source={{uri: announcement.image}} />
                        </View>
                        <View style={styles.smallDetailsWrapper}>
                            <Text style={styles.smallDetailsFont}>Published on: {moment(announcement.createdAt,`${'YYYY-MM-DD'}T${'HH:mm:ss.sssZ'}`).format('LL')}</Text>
                            <TouchableWithoutFeedback onPress={()=>props.navigation.navigate('CCADetailScreenPublic',{ccaID: announcement.organizer._id})}>
                                <Text style={styles.hyperlink}>by {announcement.organizer.ccaName}</Text>
                            </TouchableWithoutFeedback>
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