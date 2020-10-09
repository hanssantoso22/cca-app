import React from 'react';
import Navbar from '../../components/common/navigation/navbar/navbar'
import { page } from '../../components/common/styles'
import { SafeAreaView, View, Text } from 'react-native'

export default function logout (props) {
    onMenuPress = () => {
        props.navigation.openDrawer()
    }
    return (
        <SafeAreaView style={page.main}>
            <Navbar title="Logout" pressed={onMenuPress}/>
            <View style={page.main}>
                <Text>Logout</Text>
            </View>
        </SafeAreaView>
    )
}