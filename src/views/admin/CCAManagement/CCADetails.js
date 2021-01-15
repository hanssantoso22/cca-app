import React from 'react'
import { SafeAreaView } from 'react-native'
import { useFonts, Lato_700Bold } from '@expo-google-fonts/lato'
import { page, PURPLE, MING, GREY } from '../../../components/common/styles'
import SubNavbar from '../../../components/common/navigation/navbar/SubNavbar'


export default function UserList (props) {
    const [isLoaded] = useFonts({Lato_700Bold})
    const loaded = isLoaded
    const onBackPress = () => {
        props.navigation.goBack()
    }
    const { id } = props.route.params
    const CCAs = [
        {id: 0, label: 'EEE Club', value: 'EEE Club'},
        {id: 1, label: 'Garage @EEE', value: 'Garage @EEE'},
        {id: 2, label: 'MLDA @EEE', value: 'MLDA @EEE'}
    ]
    const CCA = CCAs.find((item) => item.id == id)
    return (
        <SafeAreaView style={page.main}>
            <SubNavbar title={CCA.label} pressed={onBackPress} />
        </SafeAreaView>
    )
}
