import React from 'react';
import Navbar from '../../components/common/navigation/navbar/navbar'
import { page } from '../../components/common/styles'
import { SafeAreaView, View, Text, FlatList } from 'react-native'
import NewsCard from '../../components/home/NewsCard'

export default function home (props) {
    const onMenuPress = () => {
        props.navigation.openDrawer()
    }
    const announcements = [
        {id:0, imgUrl: '../../assets/dummy/image005.jpg', title: 'Deep Learning Week 2020 Industry Night',description:'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.'},
        {id:1, title: 'NTUSU Election Day 2020',description:'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.'},
        {id:2, title: 'Subcommittee Recruitment',description:'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.'}
    ]
    const onCardPressHandler = (articleID) => {
        props.navigation.navigate('ArticleDetail', {
            articleID
        })
    }
    return (
        <SafeAreaView >
            <Navbar title="Home" pressed={onMenuPress} />
            <View style={page.main}>
                <FlatList data={announcements}
                        keyExtractor={item => item.id}
                        renderItem={({ item }) => (
                            <NewsCard imgSource={item.imgUrl} pressed={onCardPressHandler.bind(this,item.id)} title={item.title} description={item.description} />
                        )}
                />
            </View>
        </SafeAreaView>
    )
}