import React from 'react';
import Navbar from '../../components/common/navigation/navbar/navbar'
import { page } from '../../components/common/styles'
import { SafeAreaView, View, Text } from 'react-native'

export default function events (props) {
    onMenuPress = () => {
        props.navigation.openDrawer()
    }
    return (
        <SafeAreaView style={page.main}>
            <Navbar title="Events" pressed={onMenuPress}/>
            <View style={page.main}>
                <Text>Events</Text>
            </View>
        </SafeAreaView>
    )
}