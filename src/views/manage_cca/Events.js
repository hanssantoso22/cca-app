import React, { useState, useEffect } from 'react'
import { page, marginHorizontal, GREY } from '../../components/common/styles'
import { useFocusEffect } from '@react-navigation/native'
import { View, Text, StyleSheet, FlatList, Alert } from 'react-native'
import WithLoading from '../../components/hoc/withLoading'
import NoItemLoaded from '../../components/common/NoItemLoaded'
import CreatedEventCard from '../../components/manage_cca/CreatedAnnouncementCard'
import DeleteEventModal from './DeleteEventModal'
import CustomPicker from '../../components/common/forms/Picker'

import axios from 'axios'
import {URL, authenticate} from '../../api/config'
import store from '../../redux/store/store'

export default function EventsTab (props) {
    const [isLoading, setIsLoading] = useState(false)
    const [createdEvents, setCreatedEvents] = useState([])
    const [managedCCA, setManagedCCA] = useState([])
    const [selectedCCA, setSelectedCCA] = useState('')
    const [selectedCCAid, setSelectedCCAid] = useState('')
    const [displayModal, setDisplayModal] = useState(false)
    const [selectedID, setSelectedID] = useState()
    const styles = StyleSheet.create({
        pickerContainer: {
            marginHorizontal,
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
            
        }
    }
    const closeModalHandler = () => {
        setDisplayModal(false)
    }
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
    useFocusEffect(() => {
        async function loadManagedCCA () {
            try {
                const res = await axios.get(`${URL}/users/managedCCAs`, authenticate(store.getState().main.token))
                const ccaArray = res.data.map((CCA) => {
                    return {label: CCA.ccaName, value: CCA._id}
                })
                setManagedCCA(ccaArray)
            } catch (err) {
                
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
                    setIsLoading(false)
                } catch (err) {
                    Alert.alert('Loading events failed')
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
            <View style={{justifyContent: 'center', height: '100%', flex: 8}}>
            <WithLoading isLoading={isLoading} loadingMessage='Loading events...'>
            {createdEvents.length == 0 ? 
                <NoItemLoaded color={GREY[2]} message={`Everything is loaded :)\nWanna create a new event? Click '+' button on the top right corner`} />
            : 
                <FlatList data={createdEvents}
                    keyExtractor={(item)=>item.id}
                    renderItem={({ item })=> (
                        <CreatedEventCard name={item.eventName} edit={editHandler.bind(this,item._id)} delete={deleteHandler.bind(this,item._id)} />
                    )}
                />
            }
            </WithLoading>
            </View>
            <DeleteEventModal isModalVisible={displayModal} closeModal={closeModalHandler} cancelHandler={cancelHandler} confirmHandler={confirmHandler} eventID={selectedID}/>
        </View>
    )
}