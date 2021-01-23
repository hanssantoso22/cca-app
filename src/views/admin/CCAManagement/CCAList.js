import React, {useEffect, useState} from 'react'
import { View, SafeAreaView, FlatList, StyleSheet } from 'react-native'
import { useFocusEffect } from '@react-navigation/native'
import { useFonts, Lato_700Bold } from '@expo-google-fonts/lato'
import { page, marginHorizontal } from '../../../components/common/styles'
import Navbar from '../../../components/common/navigation/navbar/navbar'
import ListCard from '../../../components/common/ListCard'
import TextInput from '../../../components/common/forms/TextInputNoLabel'

import axios from 'axios'
import {URL, authenticate} from '../../../api/config'
import store from '../../../redux/store/store'

export default function CCAList (props) {
    const [isLoaded] = useFonts({Lato_700Bold})
    const [CCAs, setCCAs] = useState([])
    const [filteredCCAs, setFilteredCCAs] = useState([])
    const [keyword, setKeyword] = useState('')
    const loaded = isLoaded
    const styles = StyleSheet.create({
        searchContainer: {
            marginHorizontal,
        }
    })
    const onKeywordChange = (value) => {
        setKeyword(value)
        const filtered = CCAs.filter(CCA => CCA.ccaName.toLowerCase().includes(value.toLowerCase()))
        setFilteredCCAs(filtered)
    }
    const onMenuPress = () => {
        props.navigation.openDrawer()
    }
    const onCardPress = (_id) => {
        props.navigation.navigate('CCADetailsScreen', { _id })
    }
    const addCCAHandler = () => {
        props.navigation.navigate('AddNewCCAScreen')
    }
    useFocusEffect(
        React.useCallback (() => {
            async function loadCCAs () {
                try {
                    const res = await axios.get(`${URL}/CCAs`, authenticate(store.getState().main.token))
                    setCCAs(res.data)
                    setFilteredCCAs(res.data)
                } catch (err) {
                    console.log(err)
                }
            }
            loadCCAs()
        },[])
    )
    return (
        <SafeAreaView style={page.main}>
            <Navbar title="Manage CCA" pressed={onMenuPress} add={addCCAHandler}/>
            <View style={{paddingTop: marginHorizontal}}>
                <View style={styles.searchContainer}>
                    <TextInput 
                        value={keyword} 
                        onChangeText={onKeywordChange}
                        type="name"
                        customStyle={{fontStyle: 'italic'}}
                        placeHolder="Search CCA..."
                    />
                </View>
                <FlatList 
                    data={filteredCCAs}
                    keyExtractor={(item)=>item._id}
                    renderItem={({ item })=> (
                        <ListCard title={item.ccaName} onPress={onCardPress.bind(this,item._id)}/>
                    )}
                />
            </View>
        </SafeAreaView>
    )
}
