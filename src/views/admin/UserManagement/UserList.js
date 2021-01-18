import React from 'react'
import { View, SafeAreaView, FlatList } from 'react-native'
import { useFonts, Lato_700Bold } from '@expo-google-fonts/lato'
import { page, marginHorizontal } from '../../../components/common/styles'
import Navbar from '../../../components/common/navigation/navbar/navbar'
import ListCard from '../../../components/common/ListCard'

export default function UserList (props) {
    const [isLoaded] = useFonts({Lato_700Bold})
    const loaded = isLoaded

    const userList = [
        {id: 0, fname: 'Laurensius Hans Santoso 1', year:'4', faculty: 'EEE'},
        {id: 1, fname: 'Hans', year:'4', faculty: 'EEE'},
        {id: 2, fname: 'Laurensius Hans Santoso 3', year:'4', faculty: 'EEE'},
        {id: 3, fname: 'Laurensius Hans Santoso 4', year:'4', faculty: 'EEE'}
    ]
    
    const onMenuPress = () => {
        props.navigation.openDrawer()
    }
    const onCardPress = (id) => {
        props.navigation.navigate('UserDetailsScreen', { id })
    }
    return (
        <SafeAreaView style={page.main}>
            <Navbar title="Manage Users" pressed={onMenuPress} />
            <View style={{paddingTop: marginHorizontal}}>
                <FlatList 
                    data={userList}
                    keyExtractor={(item)=>item.id}
                    renderItem={({ item })=> (
                        <ListCard title={item.fname} onPress={onCardPress.bind(this,item.id)}/>
                    )}
                />
            </View>
            
        </SafeAreaView>
    )
}
