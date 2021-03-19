import React, { useState, useEffect } from 'react'
import { View, SafeAreaView, FlatList, StyleSheet, ScrollView, Alert } from 'react-native'
import { useFonts, Lato_700Bold } from '@expo-google-fonts/lato'
import { useDispatch, useSelector } from 'react-redux'
import { editSelectedUsers } from '../../redux/reducers/AdminSlice'
import { page, marginHorizontal } from '../../components/common/styles'
import SubNavbar from '../../components/common/navigation/navbar/SubNavbar'
import NameCard from '../../components/admin/NameCard'
import ColoredButton from '../../components/common/buttons/ColoredButton'
import TextInput from '../../components/common/forms/TextInputNoLabel'

import axios from 'axios'
import {URL, authenticate} from '../../api/config'
import store from '../../redux/store/store'

export default function (props) {
    const [isLoaded] = useFonts({Lato_700Bold})
    const [users, setUsers] = useState ([])
    //To store users based on keyword search
    const [filteredUsers, setFilteredUsers] = useState([])
    const [keyword, setKeyword] = useState('')
    const { ccaID } = props.route.params
    const styles = StyleSheet.create({
        sectionScroll: {
            maxHeight: 400,
            paddingBottom: 15,
        },
        selectedItemsContainer: {
            flexDirection: 'row',
            marginHorizontal,
            flexWrap: 'wrap',
            paddingBottom: 15,
        },
        searchContainer: {
            marginHorizontal,
        }
    })
    const dispatch = useDispatch()
    const selectedUsers = useSelector(state => state.admin.selectedUsers)
    const selectedUserIds = useSelector(state => state.admin.selectedUserIds)
    const onBackPress = () => {
        async function editMembers () {
            try {
                const res = await axios.patch(`${URL}/CCA/${ccaID}/editMembers`, {members: selectedUserIds}, authenticate(store.getState().main.token))
                props.navigation.reset({
                    index: 0,
                    routes: [{'name': 'ManageCCAScreen'}]
                })
                dispatch(editSelectedUsers({selectedUsers: [], selectedUserIds: []}))
            } catch (err) {
                
            }
        }
        editMembers()
    }
    const onCardPress = (managerName, managerID) => {
        let tempArray = [...selectedUsers]
        let tempArray2 = [...selectedUserIds]
        if (selectedUsers.includes(managerName)) {
            const index = selectedUsers.indexOf(managerName)
            delete tempArray[index]
            delete tempArray2[index]
            tempArray = tempArray.filter((item) => item!=undefined)
            tempArray2 = tempArray2.filter((item) => item!=undefined)
        }
        else {
            tempArray = tempArray.concat(managerName)
            tempArray2 = tempArray2.concat(managerID)
        }
        dispatch(editSelectedUsers({selectedUsers: tempArray, selectedUserIds: tempArray2}))
    }
    const removeItemHandler = (managerName) => {
        let tempArray = [...selectedUsers]
        let tempArray2 = [...selectedUserIds]
        const index = selectedUsers.indexOf(managerName)
        delete tempArray[index]
        delete tempArray2[index]
        tempArray = tempArray.filter((item) => item!=undefined)
        tempArray2 = tempArray2.filter((item) => item!=undefined)
        dispatch(editSelectedUsers({selectedUsers: tempArray, selectedUserIds: tempArray2}))
    }
    const onKeywordChange = (value) => {
        setKeyword(value)
        const filtered = users.filter(user => user.fname.toLowerCase().includes(value.toLowerCase()))
        setFilteredUsers(filtered)
    }
    useEffect (() => {
        async function loadUsers() {
            try {
                const res = await axios.get(`${URL}/users`, authenticate(store.getState().main.token))
                const res2 = await axios.get(`${URL}/CCA/${ccaID}/viewMembers`, authenticate(store.getState().main.token))
                let memberNames = []
                let memberIDs = []
                res2.data.members.forEach (item => {
                    memberNames.push(item.fname)
                    memberIDs.push(item._id)
                })
                setUsers(res.data)
                setFilteredUsers(res.data)
                dispatch(editSelectedUsers({selectedUsers: memberNames, selectedUserIds: memberIDs}))
            } catch (err) {
                Alert.alert('Loading users failed')
            }
        }
        loadUsers()
    }, [])
    return (isLoaded &&
        <SafeAreaView style={page.main}>
            <SubNavbar title='Select Members' pressed={onBackPress} back="Done"/>
            <View style={page.main}>
                <View style={styles.searchContainer}>
                    <TextInput 
                        value={keyword} 
                        onChangeText={onKeywordChange}
                        type="name"
                        customStyle={{fontStyle: 'italic'}}
                        placeHolder="Search name..."
                    />
                </View>
                <ScrollView style={styles.sectionScroll}>
                    <View style={styles.selectedItemsContainer}>
                        {selectedUsers != [] && selectedUsers.map((user,index) => (
                            <ColoredButton key={index} text={user} onPress={removeItemHandler.bind(this,user)} />
                        ))}
                    </View>
                </ScrollView>
                <FlatList 
                    data={filteredUsers}
                    keyExtractor={(item)=>item.id}
                    renderItem={({ item })=> (
                        <NameCard name={item.fname} faculty={item.faculty} year={item.year} onPress={onCardPress.bind(this,item.fname,item._id)} checked={selectedUsers.includes(item.fname)}/>
                    )}
                />
            </View>
        </SafeAreaView>
    )
}
