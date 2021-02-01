import React, { useState, useEffect } from 'react'
import SubNavbar from '../../components/common/navigation/navbar/SubNavbar'
import { page, GREY, marginHorizontal } from '../../components/common/styles'
import { SafeAreaView, StyleSheet, View, FlatList } from 'react-native'
import { useFonts, Lato_700Bold, Lato_400Regular } from '@expo-google-fonts/lato'
import ListCard from '../../components/common/ListCard'

import axios from 'axios'
import { URL, authenticate } from '../../api/config'
import store from '../../redux/store/store'

export default function home (props) {
    const [isLoaded] = useFonts({
        Lato_400Regular,
        Lato_700Bold
    })
    const loaded = isLoaded
    const [participants, setParticipants] = useState([])
    const onBackPress = () => {
        props.navigation.goBack()
    }
    const styles = StyleSheet.create ({
        card: {
            borderRadius: 15,
            backgroundColor: 'white',
            marginBottom: 15,
            marginHorizontal: 15,
            shadowColor: 'black',
            shadowOffset: {width: 3, height: 4},
            shadowOpacity: 0.1,
            shadowRadius: 8,
            paddingHorizontal: 20,
            paddingTop: 20,
            paddingBottom: 20,
            marginHorizontal: marginHorizontal,
        },
        pageTitle: {
            fontFamily: 'Lato_400Regular',
            fontSize: 20,
            color: GREY[4],
            marginLeft: marginHorizontal,
            marginBottom: marginHorizontal,
        },
        inputLabel: {
            fontFamily: 'Lato_400Regular'
        },
    })
    
    useEffect(() => {
        async function loadParticipants () {
            try {
                const res = await axios.get(`${URL}/event/${props.route.params.eventID}/details`, authenticate(store.getState().main.token))
                setParticipants(res.data.participants)
            } catch (err) {
                console.log('Retrieve participants failed', err)
            }
        }
        loadParticipants()
    }, [])
    return (
        <SafeAreaView style={page.main}>
            <SubNavbar title={`View Participants \(${participants.length}\)`} pressed={onBackPress} />
            <View style={{paddingTop: marginHorizontal}}>
                {participants.length > 0 && 
                    <FlatList 
                        data={participants}
                        keyExtractor={(item)=>item._id}
                        renderItem={({ item })=> (
                            <ListCard title={item.fname} description={`${item.faculty} / ${item.year}`}/>
                        )}
                    />
                }
            </View>
        </SafeAreaView>
    )
}