import React from 'react'
import { NavigationContainer } from '@react-navigation/native'
import { createDrawerNavigator } from '@react-navigation/drawer';
import { createStackNavigator } from '@react-navigation/stack';
import { Dimensions } from 'react-native'

import HomeScreen from '../../views/home/home'
import EventsScreen from '../../views/events/events'
import RemindersScreen from '../../views/reminders/reminders'
import ClubsScreen from '../../views/clubs/clubs'
import ManageCCAScreen from '../../views/manage_cca/ManageCCA'
import CreateEventScreen from '../../views/manage_cca/CreateEvent'
import CreateAnnouncementScreen from '../../views/manage_cca/CreateAnnouncement'
import CreateNewModal from '../../views/manage_cca/createNewModal'
import ArchivesScreen from '../../views/archives/archives'
import LoginScreen from '../../views/login_logout/login'
import CreateAccountScreen from '../../views/login_logout/createNewAccount'
import DrawerMenu from '../common/navigation/sideDrawer/sideDrawer'

import { isLoggedIn } from '../../redux/store/store'
import { useSelector } from 'react-redux';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

const DrawerStack = createDrawerNavigator()
const HomeStack = createStackNavigator()
const EventsStack = createStackNavigator()
const RemindersStack = createStackNavigator()
const ClubsStack = createStackNavigator()
const ManageCCAStack = createStackNavigator()
const ArchivesStack = createStackNavigator()
const LogoutStack = createStackNavigator()
const AuthStack = createStackNavigator()

const HomeStackScreen = () => (
    <HomeStack.Navigator>
        <HomeStack.Screen name='Home' component={HomeScreen} options={{headerShown: false}}/>
    </HomeStack.Navigator>
)
const EventsStackScreen = () => (EventsScreen)
const RemindersStackScreen = () => (RemindersScreen)
const ClubsStackScreen = () => (ClubsScreen)
const ManageCCAStackScreen = () => (
    <ManageCCAStack.Navigator>
        <ManageCCAStack.Screen name="ManageCCAScreen" component={ManageCCAScreen} options={{headerShown: false}}/>
        <ManageCCAStack.Screen name="CreateNewModal" component={CreateNewModal} options={{headerShown: false, cardOverlayEnabled: true}}/>
        <ManageCCAStack.Screen name="CreateEventScreen" component={CreateEventScreen} options={{headerShown: false}}/>
        <ManageCCAStack.Screen name="CreateAnnouncementScreen" component={CreateAnnouncementScreen} options={{headerShown: false}}/>
    </ManageCCAStack.Navigator>
)
const ArchivesStackScreen = () => (ArchivesScreen)
const LogoutStackScreen = () => (LogoutScreen)

const RootController = () => {
    const isAuth = useSelector(isLoggedIn)
    return (
    <NavigationContainer>
        {isAuth ? (
            <DrawerStack.Navigator initialRouteName="HomeStackScreen"
                        drawerBackgroundColor= "white"
                        drawerContent= {props => <DrawerMenu {...props}/>}
                        drawerLockMode= "locked-closed"
                        disableGestures= {true}
                        drawerWidth= {screenWidth - 60} >
                <HomeStack.Screen name="HomeScreen" component={HomeStackScreen} />
                <EventsStack.Screen name="EventsScreen" component={EventsScreen} />
                <RemindersStack.Screen name="RemindersScreen" component={RemindersScreen} />
                <ClubsStack.Screen name="ClubsScreen" component={ClubsScreen} />
                <ManageCCAStack.Screen name="ManageCCAScreen" component={ManageCCAStackScreen} />
                <ArchivesStack.Screen name="ArchivesScreen" component={ArchivesScreen} />
                <LogoutStack.Screen name="LogoutScreen" component={LoginScreen} />
            </DrawerStack.Navigator>
        ) : (
            <AuthStack.Navigator initialRouteName="AuthStackScreen">
                <AuthStack.Screen name="LoginScreen" component={LoginScreen} />
                <AuthStack.Screen name="CreateAccount" component={props => <CreateAccountScreen {...props} />} />
            </AuthStack.Navigator>
        ) }
        
    </NavigationContainer>
)}
export default RootController

