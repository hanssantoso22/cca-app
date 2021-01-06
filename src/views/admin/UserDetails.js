import React from 'react'
import { SafeAreaView } from 'react-native'
import { useFonts, Lato_700Bold } from '@expo-google-fonts/lato'
import { page, PURPLE, MING, GREY } from '../../components/common/styles'
import SubNavbar from '../../components/common/navigation/navbar/SubNavbar'


export default function UserList (props) {
    const [isLoaded] = useFonts({Lato_700Bold})
    const loaded = isLoaded
    const onBackPress = () => {
        props.navigation.goBack()
    }
    return (
        <SafeAreaView style={page.main}>
            <SubNavbar title="Dummy" pressed={onBackPress} />
        </SafeAreaView>
    )
}
