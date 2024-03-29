import React from 'react'
import { View, Text, StyleSheet, SafeAreaView, Dimensions, TouchableWithoutFeedback } from 'react-native'
import { Avatar } from 'react-native-elements'
import { FlatList } from 'react-native-gesture-handler'
import ItemCard from './itemCard'
import { navigateToPage, logout } from '../../../../redux/reducers/mainSlice'
import { useDispatch } from 'react-redux'
import { useFonts, Lato_700Bold } from '@expo-google-fonts/lato'

import { MING } from '../../styles'
import store from '../../../../redux/store/store'

export default function SideDrawer (props) {
    const dispatch = useDispatch()

    const navigateToScreen  = (navScreen) => {
        if (navScreen=='LogoutScreen') {
            dispatch (logout(store.getState().main.token))
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
            color: MING[5],
            textAlign: 'center',
            lineHeight: 30,
        }
    })
    return (isLoaded &&
        <SafeAreaView>
            <Avatar rounded size="large" />
            <View style={styles.nameContainer}>
            <TouchableWithoutFeedback onPress={navigateToScreen.bind(this,'AdminProfileScreen')}>
                <Text style={styles.userName}>Admin</Text>
            </TouchableWithoutFeedback>
            </View>
            <View>
                {renderFlatList()}
            </View>
        </SafeAreaView>
    )
}