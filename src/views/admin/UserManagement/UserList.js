import React, { useState } from 'react'
import { View, SafeAreaView, FlatList, StyleSheet, Alert } from 'react-native'
import { useFocusEffect } from '@react-navigation/native'
import { useFonts, Lato_700Bold } from '@expo-google-fonts/lato'
import { page, marginHorizontal, GREY } from '../../../components/common/styles'
import WithLoading from '../../../components/hoc/withLoading'
import NoItemLoaded from '../../../components/common/NoItemLoaded'
import Navbar from '../../../components/common/navigation/navbar/navbar'
import ListCard from '../../../components/common/ListCard'
import TextInput from '../../../components/common/forms/TextInputNoLabel'

import axios from 'axios'
import {URL, authenticate} from '../../../api/config'
import store from '../../../redux/store/store'

export default function UserList (props) {
    const [isLoaded] = useFonts({Lato_700Bold})
    const [isLoading, setIsLoading] = useState(true)
    const [userList, setUserList] = useState([])
    const [keyword, setKeyword] = useState([])
    const [filteredUserList, setFilteredUserList] = useState([])
    const styles = StyleSheet.create({
        searchContainer: {
            marginHorizontal,
        }
    })
    const onMenuPress = () => {
        props.navigation.openDrawer()
    }
    const onCardPress = (_id) => {
        props.navigation.navigate('UserDetailsScreen', { _id })
    }
    const onKeywordChange = (value) => {
        setKeyword(value)
        const filtered = userList.filter(user => user.fname.toLowerCase().includes(value.toLowerCase()))
        setFilteredUserList(filtered)
    }
    useFocusEffect (
        React.useCallback (() => {
            async function loadUsers () {
                try {
                    const res = await axios.get(`${URL}/users`, authenticate(store.getState().main.token))
                    setFilteredUserList(res.data)
                    setUserList(res.data)
                    setIsLoading(false)
                } catch (err) {
                    Alert.alert('Loading users failed')
                }
            }
            loadUsers()
        },[])
    )
    return (isLoaded &&
        <SafeAreaView style={page.main}>
            <Navbar title="Manage Users" pressed={onMenuPress} />
            <WithLoading isLoading={isLoading} loadingMessage='Loading users...'>
                <View style={{paddingTop: marginHorizontal}}>
                    {userList.length == 0 ? 
                        <NoItemLoaded color={GREY[2]} message={`Everything is loaded :)\nIt seems there's no user.`} />
                    :
                        <>
                        <View style={styles.searchContainer}>
                            <TextInput 
                                value={keyword} 
                                onChangeText={onKeywordChange}
                                type="name"
                                customStyle={{fontStyle: 'italic'}}
                                placeHolder="Search users..."
                            />
                        </View>
                        <FlatList 
                            data={filteredUserList}
                            keyExtractor={(item)=>item._id}
                            renderItem={({ item })=> (
                                <ListCard title={item.fname} onPress={onCardPress.bind(this,item._id)}/>
                            )}
                        />
                        </>
                    }
                </View>
            </WithLoading>
        </SafeAreaView>
    )
}
