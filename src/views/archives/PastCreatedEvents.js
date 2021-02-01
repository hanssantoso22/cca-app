import React, { useState, useEffect } from 'react'
import { useFocusEffect } from '@react-navigation/native'
import { page, marginHorizontal } from '../../components/common/styles'
import { View, StyleSheet, FlatList } from 'react-native'
import PastEventCard from '../../components/archives/PastEventCard'
import CustomPicker from '../../components/common/forms/Picker'

import axios from 'axios'
import {URL, authenticate} from '../../api/config'
import store from '../../redux/store/store'

export default function PastCreatedEvents (props) {
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
            console.log(selectedCCA)
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
                console.log(err)
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
                } catch (err) {
                    console.log(err)
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
            <FlatList data={pastEvents}
                        keyExtractor={(item)=>item.id}
                        renderItem={({ item })=> (
                            <PastEventCard name={item.name} organizer={item.organizer} pressed={onPressHandler.bind(this,item.id)} />
                        )}
            />
        </View>
    )
}