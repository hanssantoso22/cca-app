import React from 'react'
import { SafeAreaView } from 'react-native'
import { useFonts, Lato_700Bold } from '@expo-google-fonts/lato'
import { page, PURPLE, MING, GREY } from '../../components/common/styles'
import Navbar from '../../components/common/navigation/navbar/navbar'


export default function UserList (props) {
    const [isLoaded] = useFonts({Lato_700Bold})
    const loaded = isLoaded
    const onMenuPress = () => {
        props.navigation.openDrawer()
    }
    return (
        <SafeAreaView style={page.main}>
            <Navbar title="Users" pressed={onMenuPress} />
        </SafeAreaView>
    )
}
