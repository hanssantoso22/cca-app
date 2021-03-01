import React, { useState, useEffect } from 'react'
import { View, SafeAreaView, FlatList, StyleSheet } from 'react-native'
import { useFonts, Lato_700Bold } from '@expo-google-fonts/lato'
import { useDispatch, useSelector } from 'react-redux'
import { editMaincomms } from '../../../redux/reducers/AdminSlice'
import { page, marginHorizontal } from '../../../components/common/styles'
import SubNavbar from '../../../components/common/navigation/navbar/SubNavbar'
import WithLoading from '../../../components/hoc/withLoading'
import NameCard from '../../../components/admin/NameCard'
import ColoredButton from '../../../components/common/buttons/ColoredButton'
import TextInput from '../../../components/common/forms/TextInputNoLabel'

import axios from 'axios'
import {URL, authenticate} from '../../../api/config'
import store from '../../../redux/store/store'

export default function (props) {
    const [isLoaded] = useFonts({Lato_700Bold})
    const [users, setUsers] = useState ([])
    const [isLoading, setIsLoading] = useState(true)
    //To store users based on keyword search
    const [filteredUsers, setFilteredUsers] = useState([])
    const [keyword, setKeyword] = useState('')
    const styles = StyleSheet.create({
        selectedItemsContainer: {
            flexDirection: 'row',
            marginHorizontal,
            flexWrap: 'wrap'
        },
        searchContainer: {
            marginHorizontal,
        }
    })
    const onBackPress = () => {
        props.navigation.goBack()
    }
    const dispatch = useDispatch()
    const selectedMaincomms = useSelector(state => state.admin.selectedMaincomms)
    const selectedMaincommIds = useSelector(state => state.admin.selectedMaincommIds)
    const onCardPress = (maincommName, maincommID) => {
        let tempArray = [...selectedMaincomms]
        let tempArray2 = [...selectedMaincommIds]
        if (selectedMaincomms.includes(maincommName)) {
            const index = selectedMaincomms.indexOf(maincommName)
            delete tempArray[index]
            delete tempArray2[index]
            tempArray = tempArray.filter((item) => item!=undefined)
            tempArray2 = tempArray2.filter((item) => item!=undefined)
        }
        else {
            tempArray = tempArray.concat(maincommName)
            tempArray2 = tempArray2.concat(maincommID)
        }
        dispatch(editMaincomms({selectedMaincomms: tempArray, selectedMaincommIds: tempArray2}))
    }
    const removeItemHandler = (maincommName) => {
        let tempArray = [...selectedMaincomms]
        let tempArray2 = [...selectedMaincommIds]
        const index = selectedMaincomms.indexOf(maincommName)
        delete tempArray[index]
        delete tempArray2[index]
        tempArray = tempArray.filter((item) => item!=undefined)
        tempArray2 = tempArray2.filter((item) => item!=undefined)
        dispatch(editMaincomms({selectedMaincomms: tempArray, selectedMaincommIds: tempArray2}))
    }
    const onKeywordChange = (value) => {
        setKeyword(value)
        const filtered = users.filter(user => user.fname.toLowerCase().includes(value.toLowerCase()))
        setFilteredUsers(filtered)
    }
    useEffect (() => {
        async function loadUsers() {
            try {
                console.log('fetching')
                const res = await axios.get(`${URL}/users`, authenticate(store.getState().main.token))
                setUsers(res.data)
                setFilteredUsers(res.data)
                setIsLoading(false)
            } catch (err) {
                console.log(err)
            }
        }
        loadUsers()
    }, [])
    return (isLoaded &&
        <SafeAreaView style={page.main}>
            <SubNavbar title='Select maincomms' pressed={onBackPress} back="Done"/>
            <View style={page.main}>
                <WithLoading isLoading={isLoading} loadingMessage='Loading users...'>
                    <View style={styles.searchContainer}>
                        <TextInput 
                            value={keyword} 
                            onChangeText={onKeywordChange}
                            type="name"
                            customStyle={{fontStyle: 'italic'}}
                            placeHolder="Search name..."
                        />
                    </View>
                    <View style={styles.selectedItemsContainer}>
                        {selectedMaincomms != [] && selectedMaincomms.map((user,index) => (
                            <ColoredButton key={index} text={user} onPress={removeItemHandler.bind(this,user)} />
                        ))}
                    </View>
                    <FlatList 
                        data={filteredUsers}
                        keyExtractor={(item)=>item.id}
                        renderItem={({ item })=> (
                            <NameCard name={item.fname} faculty={item.faculty} year={item.year} onPress={onCardPress.bind(this,item.fname,item._id)} checked={selectedMaincomms.includes(item.fname)}/>
                        )}
                    />
                </WithLoading>
            </View>
        </SafeAreaView>
    )
}
