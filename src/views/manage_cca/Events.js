import React, { useState, useEffect } from 'react'
import { page, marginHorizontal } from '../../components/common/styles'
import { useFocusEffect } from '@react-navigation/native'
import { View, StyleSheet, FlatList } from 'react-native'
import CreatedEventCard from '../../components/manage_cca/CreatedAnnouncementCard'
import DeleteEventModal from './DeleteEventModal'
import CustomPicker from '../../components/common/forms/Picker'

import axios from 'axios'
import {URL, authenticate} from '../../api/config'
import store from '../../redux/store/store'

export default function EventsTab (props) {
    const [createdEvents, setCreatedEvents] = useState([])
    const [managedCCA, setManagedCCA] = useState([])
    const [selectedCCA, setSelectedCCA] = useState('')
    const [selectedCCAid, setSelectedCCAid] = useState('')
    const [displayModal, setDisplayModal] = useState(false)
    const [selectedID, setSelectedID] = useState()
    const styles = StyleSheet.create({
        pickerContainer: {
            marginHorizontal
        }
    })
    const editHandler = (eventID) => {
        props.navigation.navigate('EditEventScreen',{
            eventID
        })
    }
    const deleteHandler = (eventID) => {
        setSelectedID(eventID)
        setDisplayModal(true)
    }
    const cancelHandler = () => {
        setDisplayModal(false)
    }
    const confirmHandler = async (eventID) => {
        try {
            const res = await axios.delete(`${URL}/event/${eventID}/delete`, authenticate(store.getState().main.token))
            const res2 = await axios.delete(`${URL}/event/${eventID}/deleteImage`, authenticate(store.getState().main.token))
            setDisplayModal(false)
            props.navigation.reset({
                index: 0,
                routes: [{'name': 'ManageCCAScreen'}]
            })
        } catch (err) {
            console.log(err)
        }
    }
    const closeModalHandler = () => {
        setDisplayModal(false)
    }
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
                    const res = await axios.get(`${URL}/CCA/${selectedCCAid}/pastEvents`, authenticate(store.getState().main.token))
                    setCreatedEvents(res.data)
                } catch (err) {
                    console.log(err)
                }
            }
            loadCreatedEvents()
        }
        else {
            setCreatedEvents([])
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
            <FlatList data={createdEvents}
                    keyExtractor={(item)=>item.id}
                    renderItem={({ item })=> (
                        <CreatedEventCard name={item.eventName} edit={editHandler.bind(this,item._id)} delete={deleteHandler.bind(this,item._id)} />
                    )}
            />
            <DeleteEventModal isModalVisible={displayModal} closeModal={closeModalHandler} cancelHandler={cancelHandler} confirmHandler={confirmHandler} eventID={selectedID}/>
        </View>
    )
}