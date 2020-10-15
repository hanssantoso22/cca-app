import React from 'react';
import SubNavbar from '../../components/common/navigation/navbar/SubNavbar'
import { page } from '../../components/common/styles'
import { SafeAreaView, View, Text } from 'react-native'

export default function home (props) {
    const onBackPress = () => {
        props.navigation.goBack()
    }
    return (
        <SafeAreaView style={page.main}>
            <SubNavbar title='Create Event' pressed={onBackPress} />
            <View style={page.main}>
                <Text>Create Event</Text>
            </View>
        </SafeAreaView>
    )
}