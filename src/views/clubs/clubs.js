import React from 'react';
import Navbar from '../../components/common/navigation/navbar/navbar'
import { page } from '../../components/common/styles'
import { SafeAreaView, View, Text } from 'react-native'

export default function clubs (props) {
    onMenuPress = () => {
        props.navigation.openDrawer()
    }
    return (
        <SafeAreaView style={page.main}>
            <Navbar title="Clubs" pressed={onMenuPress}/>
            <View style={page.main}>
                <Text>Clubs</Text>
            </View>
        </SafeAreaView>
    )
}