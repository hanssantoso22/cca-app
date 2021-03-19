import React, { useState, useEffect } from 'react'
import { useFocusEffect } from '@react-navigation/native'
import { page, marginHorizontal, GREY } from '../../components/common/styles'
import { View, StyleSheet, FlatList, Alert } from 'react-native'
import WithLoading from '../../components/hoc/withLoading'
import NoItemLoaded from '../../components/common/NoItemLoaded'
import PastEventCard from '../../components/archives/PastEventCard'
import CustomPicker from '../../components/common/forms/Picker'

import axios from 'axios'
import {URL, authenticate} from '../../api/config'
import store from '../../redux/store/store'

export default function PastCreatedEvents (props) {
    const [isLoading, setIsLoading] = useState(false)
    const [pastEvents, setPastEvents] = useState([])
    const [managedCCA, setManagedCCA] = useState([])
    const [selectedCCA, setSelectedCCA] = useState('')
    const [selectedCCAid, setSelectedCCAid] = useState('')
    const styles = StyleSheet.create({
        pickerContainer: {
            marginHorizontal
        }
    })
    const onPickerChange = (cca) => {
        if (cca != null) {
            setSelectedCCA(cca)
            setSelectedCCAid(cca)
            setIsLoading(true)
        }
        else {
            setSelectedCCA('')
            setSelectedCCAid('')
        }
    }
    const onPressHandler = (eventID) => {
        props.navigation.navigate('EventReview',{
            eventID,
        })
    }
    useFocusEffect(() => {
        async function loadManagedCCA () {
            try {
                const res = await axios.get(`${URL}/users/managedCCAs`, authenticate(store.getState().main.token))
                const ccaArray = res.data.map((CCA) => {
                    return {label: CCA.ccaName, value: CCA._id}
                })
                setManagedCCA(ccaArray)
            } catch (err) {
                Alert.alert('Loading CCA failed')
            }
        }
        loadManagedCCA()
    }, [])
    useEffect (() => {
        if (selectedCCAid != '') {
            async function loadCreatedEvents () {
                try {
                    const res = await axios.get(`${URL}/CCA/${selectedCCAid}/archivedEvents`, authenticate(store.getState().main.token))
                    setPastEvents(res.data)
                    setIsLoading(false)
                } catch (err) {
                    Alert.alert('Loading events failed')
                }
            }
            loadCreatedEvents()
        }
        else {
            setPastEvents([])
        }
    }, [selectedCCAid])
    return (
        <View style={page.main}>
            <View style={styles.pickerContainer}>
                <CustomPicker items = {managedCCA}
                            value = {selectedCCA}
                            onValueChange = {item => onPickerChange(item)}
                            label  = 'Select CCA'
                />
            </View>
            <View style={{justifyContent: 'center', height: '100%', flex: 8}}>
            <WithLoading isLoading={isLoading} loadingMessage='Loading events...'>
            {pastEvents.length == 0 ? 
                <NoItemLoaded color={GREY[2]} message={`Everything is loaded :)\nWanna create a new event? Go to 'Manage CCA' to create one`} />
            :
                <FlatList data={pastEvents}
                    keyExtractor={(item)=>item.id}
                    renderItem={({ item })=> (
                        <PastEventCard name={item.eventName} pressed={onPressHandler.bind(this,item._id)} />
                    )}
                />
            }
            </WithLoading>
            </View>
        </View>
    )
}