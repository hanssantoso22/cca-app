import React, { useState, useEffect } from 'react'
import { page, marginHorizontal, GREY } from '../../components/common/styles'
import { useFocusEffect } from '@react-navigation/native'
import { useFonts } from '@expo-google-fonts/lato'
import { View, Text, StyleSheet, FlatList, TouchableWithoutFeedback } from 'react-native'
import CustomPicker from '../../components/common/forms/Picker'
import ListCard from '../../components/common/ListCard'

import axios from 'axios'
import {URL, authenticate} from '../../api/config'
import store from '../../redux/store/store'

export default function MembersTab (props) {
    const [isLoaded] = useFonts({
        'MaterialIcons-Regular': require('../../assets/fonts/MaterialIcons-Regular.ttf')
    })
    const loaded = isLoaded
    const [members, setMembers] = useState([])
    const [managedCCA, setManagedCCA] = useState([])
    const [selectedCCA, setSelectedCCA] = useState('')
    const [selectedCCAid, setSelectedCCAid] = useState(null)
    const styles = StyleSheet.create({
        pickerContainer: {
            marginHorizontal
        },
        pageTitle: {
            fontFamily: 'Lato_400Regular',
            fontSize: 16,
            color: GREY[4],
            marginLeft: marginHorizontal,
            marginBottom: marginHorizontal,
        },
        icon: {
            fontFamily: 'MaterialIcons-Regular',
            fontSize: 20,
            color: GREY[3]
        }
    })
    const editHandler = (ccaID) => {
        props.navigation.navigate('EditMemberScreen',{
            ccaID
        })
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
            async function loadMembers () {
                try {
                    const res = await axios.get(`${URL}/CCA/${selectedCCAid}/viewMembers`, authenticate(store.getState().main.token))
                    setMembers(res.data.members)
                } catch (err) {
                    console.log('Load member error!',err)
                }
            }
            loadMembers()
        }
        else {
            setMembers([])
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
            {selectedCCAid!=null &&
            <> 
                <View style={{flexDirection: 'row'}}>
                    <Text style={styles.pageTitle}>{`Members \(${members.length}\)`}&nbsp;&nbsp;&nbsp;</Text>
                    <TouchableWithoutFeedback onPress={editHandler.bind(this, selectedCCAid)}>
                        <Text style={styles.icon}>mode_edit</Text>
                    </TouchableWithoutFeedback>
                </View>
                <FlatList data={members}
                    keyExtractor={(item)=>item._id}
                    renderItem={({ item })=> (
                        <ListCard title={item.fname} description={`${item.faculty} / ${item.year}`} />
                    )}
                />
            </>
            }
        </View>
    )
}