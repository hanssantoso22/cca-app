import React, { useState, useEffect } from 'react'
import { View, SafeAreaView, FlatList } from 'react-native'
import { useFonts, Lato_700Bold } from '@expo-google-fonts/lato'
import { page, marginHorizontal } from '../../../components/common/styles'
import Navbar from '../../../components/common/navigation/navbar/navbar'
import ListCard from '../../../components/common/ListCard'

import axios from 'axios'
import {URL, authenticate} from '../../../api/config'
import store from '../../../redux/store/store'

export default function UserList (props) {
    const [isLoaded] = useFonts({Lato_700Bold})
    const [userList, setUserList] = useState([])
    const loaded = isLoaded
    
    const onMenuPress = () => {
        props.navigation.openDrawer()
    }
    const onCardPress = (_id) => {
        props.navigation.navigate('UserDetailsScreen', { _id })
    }
    useEffect(()=>{
        async function loadUsers () {
            try {
                const res = await axios.get(`${URL}/users`, authenticate(store.getState().main.token))
                setUserList(res.data)
            } catch (err) {
                console.log(err)
            }
        }
        loadUsers() 
    },[userList])
    return (
        <SafeAreaView style={page.main}>
            <Navbar title="Manage Users" pressed={onMenuPress} />
            <View style={{paddingTop: marginHorizontal}}>
                <FlatList 
                    data={userList}
                    keyExtractor={(item)=>item._id}
                    renderItem={({ item })=> (
                        <ListCard title={item.fname} onPress={onCardPress.bind(this,item._id)}/>
                    )}
                />
            </View>
            
        </SafeAreaView>
    )
}
