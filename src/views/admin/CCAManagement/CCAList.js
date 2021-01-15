import React from 'react'
import { View, SafeAreaView, FlatList } from 'react-native'
import { useFonts, Lato_700Bold } from '@expo-google-fonts/lato'
import { page, marginHorizontal } from '../../../components/common/styles'
import Navbar from '../../../components/common/navigation/navbar/navbar'
import ListCard from '../../../components/common/ListCard'


export default function CCAList (props) {
    const [isLoaded] = useFonts({Lato_700Bold})
    const loaded = isLoaded
    const onMenuPress = () => {
        props.navigation.openDrawer()
    }
    const CCAs = [
        {id: 0, label: 'EEE Club', value: 'EEE Club'},
        {id: 1, label: 'Garage @EEE', value: 'Garage @EEE'},
        {id: 2, label: 'MLDA @EEE', value: 'MLDA @EEE'}
    ]
    const onCardPress = (id) => {
        props.navigation.navigate('CCADetailsScreen', { id })
    }
    const addCCAHandler = () => {
        props.navigation.navigate('AddNewCCAScreen')
    }
    return (
        <SafeAreaView style={page.main}>
            <Navbar title="Manage CCA" pressed={onMenuPress} add={addCCAHandler}/>
            <View style={{paddingTop: marginHorizontal}}>
                <FlatList 
                    data={CCAs}
                    keyExtractor={(item)=>item.id}
                    renderItem={({ item })=> (
                        <ListCard title={item.label} onPress={onCardPress.bind(this,item.id)}/>
                    )}
                />
            </View>
        </SafeAreaView>
    )
}
