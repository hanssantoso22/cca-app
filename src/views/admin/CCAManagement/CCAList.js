import React, {useEffect, useState} from 'react'
import { View, SafeAreaView, FlatList } from 'react-native'
import { useFonts, Lato_700Bold } from '@expo-google-fonts/lato'
import { page, marginHorizontal } from '../../../components/common/styles'
import Navbar from '../../../components/common/navigation/navbar/navbar'
import ListCard from '../../../components/common/ListCard'

import axios from 'axios'
import {URL, authenticate} from '../../../api/config'
import store from '../../../redux/store/store'

export default function CCAList (props) {
    const [isLoaded] = useFonts({Lato_700Bold})
    const [CCAs, setCCAs] = useState([])
    const loaded = isLoaded
    const onMenuPress = () => {
        props.navigation.openDrawer()
    }
    const onCardPress = (_id) => {
        props.navigation.navigate('CCADetailsScreen', { _id })
    }
    const addCCAHandler = () => {
        props.navigation.navigate('AddNewCCAScreen')
    }
    useEffect (() => {
        async function loadCCAs () {
            try {
                const res = await axios.get(`${URL}/CCAs`, authenticate(store.getState().main.token))
                setCCAs(res.data)
            } catch (err) {
                console.log(err)
            }
        }
        loadCCAs()
    }, [CCAs])
    return (
        <SafeAreaView style={page.main}>
            <Navbar title="Manage CCA" pressed={onMenuPress} add={addCCAHandler}/>
            <View style={{paddingTop: marginHorizontal}}>
                <FlatList 
                    data={CCAs}
                    keyExtractor={(item)=>item._id}
                    renderItem={({ item })=> (
                        <ListCard title={item.ccaName} onPress={onCardPress.bind(this,item._id)}/>
                    )}
                />
            </View>
        </SafeAreaView>
    )
}
