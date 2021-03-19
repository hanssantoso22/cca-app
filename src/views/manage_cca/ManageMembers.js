import React, { useState, useEffect } from 'react'
import { page, marginHorizontal, GREY } from '../../components/common/styles'
import { useFocusEffect } from '@react-navigation/native'
import { useFonts } from '@expo-google-fonts/lato'
import { View, Text, StyleSheet, FlatList, TouchableWithoutFeedback, Alert } from 'react-native'
import WithLoading from '../../components/hoc/withLoading'
import NoItemLoaded from '../../components/common/NoItemLoaded'
import CustomPicker from '../../components/common/forms/Picker'
import ListCard from '../../components/common/ListCard'

import axios from 'axios'
import {URL, authenticate} from '../../api/config'
import store from '../../redux/store/store'

export default function MembersTab (props) {
    const [isLoaded] = useFonts({
        'MaterialIcons-Regular': require('../../assets/fonts/MaterialIcons-Regular.ttf')
    })
    const [isLoading, setIsLoading] = useState(false)
    const [members, setMembers] = useState([])
    const [managedCCA, setManagedCCA] = useState([])
    const [selectedCCA, setSelectedCCA] = useState('')
    const [selectedCCAid, setSelectedCCAid] = useState('')
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
            async function loadMembers () {
                try {
                    const res = await axios.get(`${URL}/CCA/${selectedCCAid}/viewMembers`, authenticate(store.getState().main.token))
                    setMembers(res.data.members)
                    setIsLoading(false)
                } catch (err) {
                    Alert.alert('Loading members error')
                }
            }
            loadMembers()
        }
        else {
            setMembers([])
        }
    }, [selectedCCAid])
    return (isLoaded &&
        <View style={page.main}>
            <View style={styles.pickerContainer}>
                <CustomPicker items = {managedCCA}
                            value = {selectedCCA}
                            onValueChange = {item => onPickerChange(item)}
                            label  = 'Select CCA'
                />
            </View>
            {selectedCCAid!='' ?
                <WithLoading isLoading={isLoading} loadingMessage="Loading members...">
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
                </WithLoading>
            :
            null
            }
        </View>
    )
}