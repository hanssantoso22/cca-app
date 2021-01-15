import React from 'react'
import { View, Text, StyleSheet, SafeAreaView, Dimensions } from 'react-native'
import { Avatar, Accessory } from 'react-native-elements'
import { FlatList } from 'react-native-gesture-handler'
import ItemCard from './itemCard'
import { navigateToPage, logout } from '../../../../redux/reducers/mainSlice'
import { isAdmin } from '../../../../redux/store/store'
import { useDispatch, useSelector } from 'react-redux'
import { useFonts, Lato_700Bold } from '@expo-google-fonts/lato'
import { AppLoading } from 'expo'
import { GREY } from '../../styles'

export default function SideDrawer (props) {
    const dispatch = useDispatch()

    const navigateToScreen  = (navScreen) => {
        if (navScreen=='LogoutScreen') {
            dispatch (logout())
            return 0
        }
        props.navigation.navigate(navScreen)
        dispatch (navigateToPage(navScreen))
        
    }
    const [isLoaded] = useFonts({
        Lato_700Bold,
    })
    const { width: screenWidth, height: screenHeight } = Dimensions.get('window');
    const menus = [
        {id:1, menu:'MANAGE USERS', icon:'people', navScreen:'AdminManageUserScreen'},
        {id:3, menu:'MANAGE CCA', icon:'emoji_flags', navScreen:'AdminManageCCAScreen'},
        {id:5, menu:'LOGOUT', icon:'exit_to_app', navScreen:'LogoutScreen'},
    ]
    const renderFlatList = () => (
        <FlatList scrollEnabled = {(screenHeight >= 667) ? false : true}
                    data = {menus}
                    keyExtractor = {item => item.id.toString()}
                    renderItem = {({ item }) => {
                                    return (
                                        <ItemCard pressed={()=>navigateToScreen(item.navScreen)} icon={item.icon} menu={item.menu} navScreen={item.navScreen}/>
                                    )}
                    }
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
            color: GREY[4],
            textAlign: 'center',
            lineHeight: 30,
        }
    })
    if (!isLoaded) {
        return (<AppLoading />)
    }
    else {
        return (
            <SafeAreaView>
                <Avatar rounded size="large" />
                <Accessory />
                <View style={styles.nameContainer}><Text style={styles.userName}>Admin</Text></View>
                <View>
                    {renderFlatList()}
                </View>
            </SafeAreaView>
        )
    }
}