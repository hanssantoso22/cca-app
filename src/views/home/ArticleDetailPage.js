import React from 'react';
import SubNavbar from '../../components/common/navigation/navbar/SubNavbar'
import { page, GREY, marginHorizontal, font } from '../../components/common/styles'
import { SafeAreaView, View, Text, StyleSheet, ScrollView, Image } from 'react-native'
import { useFonts, Lato_700Bold, Lato_400Regular, Lato_400Regular_Italic } from '@expo-google-fonts/lato'
import Dummy1 from '../../assets/dummy/image005.jpg'
import Dummy2 from '../../assets/dummy/thumbnail_image004.png'

export default function ArticleDetailPage (props) {
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
    const dummyAnnouncements = [
        {id:0, title: 'Deep Learning Week 2020 Industry Night',description:'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.'},
        {id:1, title: 'NTUSU Election Day 2020',description:'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.'},
        {id:2, title: 'Subcommittee Recruitment',description:'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.'}
    ]
    const announcementDetails = dummyAnnouncements.filter((item)=>articleID==item.id)
    const details = announcementDetails[0]
    const styles = StyleSheet.create ({
        imageWrapper: {
            marginVertical: 5,
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

    return (

            <SafeAreaView style={page.main}>
                <SubNavbar title={details.title} pressed={onBackPress} />
                <ScrollView>
                    <View style={page.main}>
                        <Text style={{...font.articleTitle,...styles.pageTitle}}>{details.title}</Text>
                        <View style={styles.imageWrapper}>
                            <Image style={styles.image} source={Dummy1} />
                        </View>
                        <View style={styles.smallDetailsWrapper}>
                            <Text style={styles.smallDetailsFont}>Published on: {details.date}</Text>
                            <Text style={styles.smallDetailsFont}>by {details.CCAName}</Text>
                        </View>
                        <View style={styles.articleBodyWrapper}>
                            <Text style={{...font.articleBody,...styles.articleFont}}>
                                {details.description}
                            </Text>
                        </View>
                    </View>
                </ScrollView>
            </SafeAreaView>
        
    )
}