import React, { useState, useEffect } from 'react'
import { View, Text, StyleSheet, SafeAreaView, Dimensions } from 'react-native'
import { Avatar } from 'react-native-elements'
import { FlatList, TouchableWithoutFeedback } from 'react-native-gesture-handler'
import ItemCard from './itemCard'
import { navigateToPage, logout } from '../../../../redux/reducers/mainSlice'
import { useDispatch } from 'react-redux'
import { useFonts, Lato_700Bold } from '@expo-google-fonts/lato'
import { AppLoading } from 'expo'
import { MING, GREY } from '../../styles'
import axios from 'axios'
import {URL, authenticate} from '../../../../api/config'
import store from '../../../../redux/store/store' 

export default function SideDrawer (props) {
    const [user, setUser] = useState('')
    const dispatch = useDispatch()

    const navigateToScreen  = (navScreen) => {
        if (navScreen=='LogoutScreen') {
            dispatch (logout(store.getState().main.token))
            return 0
        }
        props.navigation.navigate(navScreen)
        if (navScreen != 'ProfileScreen') {
            dispatch (navigateToPage(navScreen))
        }
        
    }
    const [isLoaded] = useFonts({
        Lato_700Bold,
    })
    const { width: screenWidth, height: screenHeight } = Dimensions.get('window');
    const menus = [
        {id:0, menu:'HOME', icon:'home', navScreen:'HomeScreen'},
        {id:1, menu:'EVENTS', icon:'event', navScreen:'EventsScreen'},
        {id:2, menu:'REMINDERS', icon:'notifications_none', navScreen:'RemindersScreen'},
        {id:3, menu:'MANAGE CCA', icon:'emoji_flags', navScreen:'ManageCCAScreen'},
        {id:4, menu:'ARCHIVES', icon:'history', navScreen:'ArchivesScreen'},
        {id:5, menu:'LOGOUT', icon:'exit_to_app', navScreen:'LogoutScreen'},
    ]
    const renderFlatList = () => (
        <FlatList scrollEnabled = {(screenHeight >= 667) ? false : true}
            data = {menus}
            keyExtractor = {item => item.id.toString()}
            renderItem = {({ item }) => {
                if (item.menu == 'MANAGE CCA' && user.role=='student') {
                    return null
                }
                if (item.menu == 'ARCHIVES' && user.role=='student') {
                    return null
                }       
                return (
                        <ItemCard pressed={()=>navigateToScreen(item.navScreen)} icon={item.icon} menu={item.menu} navScreen={item.navScreen}/>
                    ) 
                }}
        />

    )
    const styles = StyleSheet.create({
        nameContainer: {
            alignItems: 'center',
            marginVertical: 15,
        },
        userName: {
            fontFamily: 'Lato_700Bold',
            fontSize: 20,
            color: MING[5],
            textAlign: 'center',
            lineHeight: 30,
        }
    })
    useEffect(()=>{
        async function loadUser () {
            try {
                const res = await axios.get(`${URL}/users/profile`, authenticate(store.getState().main.token))
                setUser(res.data)
            } catch (err) {
                console.log(err)
            }
        }
        loadUser() 
    },[user])
    if (!isLoaded) {
        return (<AppLoading />)
    }
    else {
        return (
            <SafeAreaView>
                <TouchableWithoutFeedback onPress={navigateToScreen.bind(this,'ProfileScreen')}>
                    <View style={styles.nameContainer}>
                        <Avatar 
                            rounded 
                            size={110} 
                            containerStyle={{marginVertical: 20}} 
                            icon={user.avatar == null ? {name: 'user-circle-o', type:'font-awesome', color: GREY[2], size: 90} : null}
                            source={user.avatar != null ? {
                                uri: `data:image/png;base64,${user.avatar}`
                            } : null}
                        />
                        <Text style={styles.userName}>{user.fname}</Text>
                    </View>
                </TouchableWithoutFeedback>
                <View>
                    {renderFlatList()}
                </View>
            </SafeAreaView>
        )
    }
}