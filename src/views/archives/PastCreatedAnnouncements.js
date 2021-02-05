import React, { useEffect, useState } from 'react';
import { page, marginHorizontal, GREY } from '../../components/common/styles'
import { View, StyleSheet, FlatList } from 'react-native'
import { useFocusEffect } from '@react-navigation/native'
import WithLoading from '../../components/hoc/withLoading'
import NoItemLoaded from '../../components/common/NoItemLoaded'
import PastAnnouncementCard from '../../components/archives/PastAnnouncementCard'
import CustomPicker from '../../components/common/forms/Picker'

import axios from 'axios'
import {URL, authenticate} from '../../api/config'
import store from '../../redux/store/store'

export default function PastCreatedAnnouncements (props) {
    const [isLoading, setIsLoading] = useState(false)
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
                    const res = await axios.get(`${URL}/CCA/${selectedCCAid}/archivedAnnouncements`, authenticate(store.getState().main.token))
                    setPastAnnouncements(res.data)
                    setIsLoading(false)
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
            <View style={{justifyContent: 'center', height: '100%', flex: 8}}>
            <WithLoading isLoading={isLoading} loadingMessage='Loading announcements...'>
            {pastAnnouncements.length == 0 ? 
                <NoItemLoaded color={GREY[2]} message={`Everything is loaded :)\nWanna create a new announcement? Go to 'Manage CCA' to create one.`} />
            :
                <FlatList data={pastAnnouncements}
                    keyExtractor={(item)=>item.id}
                    renderItem={({ item })=> (
                        <PastAnnouncementCard name={item.announcementTitle} />
                    )}
                />
            }
            </WithLoading>
            </View>
        </View>
    )
}