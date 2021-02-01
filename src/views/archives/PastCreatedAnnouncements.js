import React, { useEffect, useState } from 'react';
import { page, marginHorizontal } from '../../components/common/styles'
import { View, StyleSheet, FlatList } from 'react-native'
import { useFocusEffect } from '@react-navigation/native'
import PastAnnouncementCard from '../../components/archives/PastAnnouncementCard'
import CustomPicker from '../../components/common/forms/Picker'

import axios from 'axios'
import {URL, authenticate} from '../../api/config'
import store from '../../redux/store/store'

export default function PastCreatedAnnouncements (props) {
    const [pastAnnouncements, setPastAnnouncements] = useState([])
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
                    const res = await axios.get(`${URL}/CCA/${selectedCCAid}/archivedAnnouncements`, authenticate(store.getState().main.token))
                    setPastAnnouncements(res.data)
                } catch (err) {
                    console.log(err)
                }
            }
            loadCreatedAnnouncements()
        }
        else {
            setPastAnnouncements([])
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
            <FlatList data={pastAnnouncements}
                        keyExtractor={(item)=>item.id}
                        renderItem={({ item })=> (
                            <PastAnnouncementCard name={item.announcementTitle} />
                        )}
            />
        </View>
    )
}