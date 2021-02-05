import React, { useState, useEffect } from 'react';
import { page, marginHorizontal, GREY } from '../../components/common/styles'
import { View, StyleSheet, FlatList } from 'react-native'
import { useFocusEffect } from '@react-navigation/native'
import CreatedAnnouncementCard from '../../components/manage_cca/CreatedAnnouncementCard'
import DeleteAnnouncementModal from './DeleteAnnouncementModal'
import CustomPicker from '../../components/common/forms/Picker'
import WithLoading from '../../components/hoc/withLoading'
import NoItemLoaded from '../../components/common/NoItemLoaded'

import axios from 'axios'
import {URL, authenticate} from '../../api/config'
import store from '../../redux/store/store'

export default function AnnouncementsTab (props) {
    const [isLoading, setIsLoading] = useState(false)
    const [createdAnnouncements, setCreatedAnnouncements] = useState([])
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
    const editHandler = (announcementID) => {
        props.navigation.navigate('EditAnnouncementScreen',{
            announcementID
        })
    }
    const deleteHandler = (announcementID) => {
        setSelectedID(announcementID)
        setDisplayModal(true)
    }
    const cancelHandler = () => {
        setDisplayModal(false)
    }
    const confirmHandler = async (announcementID) => {
        try {
            const res = await axios.delete(`${URL}/announcement/${announcementID}/delete`, authenticate(store.getState().main.token))
            const res2 = await axios.delete(`${URL}/announcement/${announcementID}/deleteImage`, authenticate(store.getState().main.token))
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
                console.log(err)
            }
        }
        loadManagedCCA()
    }, [])
    useEffect (() => {
        if (selectedCCAid != '') {
            async function loadCreatedAnnouncements () {
                try {
                    const res = await axios.get(`${URL}/CCA/${selectedCCAid}/pastAnnouncements`, authenticate(store.getState().main.token))
                    setCreatedAnnouncements(res.data)
                    setIsLoading(false)
                } catch (err) {
                    console.log(err)
                }
            }
            loadCreatedAnnouncements()
        }
        else {
            setCreatedAnnouncements([])
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
                {createdAnnouncements.length == 0 ?
                    <NoItemLoaded color={GREY[2]} message={`Everything is loaded :)\nWanna create a new announcement? Click '+' button on the top right corner`} />
                :
                    <FlatList data={createdAnnouncements}
                        keyExtractor={(item)=>item._id}
                        renderItem={({ item })=> (
                            <CreatedAnnouncementCard name={item.announcementTitle} edit={editHandler.bind(this,item._id)} delete={deleteHandler.bind(this,item._id)} />
                        )}
                    />
                }
            </WithLoading>
            </View>
            <DeleteAnnouncementModal isModalVisible={displayModal} closeModal={closeModalHandler} cancelHandler={cancelHandler} confirmHandler={confirmHandler} announcementID={selectedID}/>
        </View>
    )
}