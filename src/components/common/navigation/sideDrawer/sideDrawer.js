import React from 'react'
import { View, Text, StyleSheet, SafeAreaView, Dimensions } from 'react-native'
import { Avatar, Accessory } from 'react-native-elements'
import { FlatList } from 'react-native-gesture-handler'
import ItemCard from './itemCard'
import { navigateToPage } from '../../../../redux/reducers/slice'
import { useDispatch } from 'react-redux'
import { useFonts, Lato_700Bold } from '@expo-google-fonts/lato'
import { AppLoading } from 'expo'
import { GREY } from '../../styles'

export default function SideDrawer (props) {
    const dispatch = useDispatch()
    const navigateToScreen  = (navScreen) => {
        props.navigation.navigate(navScreen)
        dispatch (navigateToPage(navScreen))
    }
    const [isLoaded] = useFonts({
        Lato_700Bold,
    })
    const { width: screenWidth, height: screenHeight } = Dimensions.get('window');
    const menus = [
        {id:0, menu:'HOME', icon:'home', navScreen:'HomeScreen'},
        {id:1, menu:'EVENTS', icon:'event', navScreen:'EventsScreen'},
        {id:2, menu:'REMINDERS', icon:'notifications_none', navScreen:'RemindersScreen'},
        {id:3, menu:'CLUBS', icon:'people_outline', navScreen:'ClubsScreen'},
        {id:4, menu:'MANAGE CCA', icon:'emoji_flags', navScreen:'ManageCCAScreen'},
        {id:5, menu:'ARCHIVES', icon:'history', navScreen:'ArchivesScreen'},
        {id:6, menu:'LOGOUT', icon:'exit_to_app', navScreen:'LogoutScreen'},
    ]
    const renderFlatList = () => (
        <FlatList scrollEnabled = {(screenHeight >= 667) ? false : true}
                    data = {menus}
                    keyExtractor = {item => item.id.toString()}
                    renderItem = {({ item }) => (
                                <ItemCard pressed={()=>navigateToScreen(item.navScreen)} icon={item.icon} menu={item.menu} navScreen={item.navScreen}/>
                    )}
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
                <View style={styles.nameContainer}><Text style={styles.userName}>Laurensius Hans Santoso</Text></View>
                <View>
                    {renderFlatList()}
                </View>
            </SafeAreaView>
        )
    }
}