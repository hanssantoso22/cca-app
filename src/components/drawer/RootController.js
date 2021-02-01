import React from 'react'
import { NavigationContainer } from '@react-navigation/native'
import { createDrawerNavigator } from '@react-navigation/drawer'
import { createStackNavigator } from '@react-navigation/stack'
import { Dimensions } from 'react-native'

//COMPONENTS FOR NON-ADMIN USERS
import HomeScreen from '../../views/home/home'
import ProfileScreen from '../../views/profile/ProfilePage'
import ArticleDetailScreen from '../../views/home/ArticleDetailPage'
import EventsScreen from '../../views/events/events'
import EventDetailsPage from '../../views/events/EventDetailsPage'
import PastEventRatingPage from '../../views/events/PastEventRatingPage'
import RemindersScreen from '../../views/reminders/reminders'
import ReminderDetailsPage from '../../views/reminders/ReminderDetailsPage'
import ManageCCAScreen from '../../views/manage_cca/ManageCCA'
import EditMemberScreen from '../../views/manage_cca/EditMembers'
import CreateEventScreen from '../../views/manage_cca/CreateEvent'
import CreateAnnouncementScreen from '../../views/manage_cca/CreateAnnouncement'
import EditAnnouncementScreen from '../../views/manage_cca/EditAnnouncement'
import EditEventScreen from '../../views/manage_cca/EditEvent'
import ViewParticipantScreen from '../../views/manage_cca/ViewParticipants'
import CreateNewModal from '../../views/manage_cca/createNewModal'
import ArchivesScreen from '../../views/archives/archives'
import EventReviewPage from '../../views/archives/EventReviewPage'
import LoginScreen from '../../views/login_logout/login'
import CreateAccountScreen from '../../views/login_logout/createNewAccount'
import ForgotPassScreen from '../../views/login_logout/ForgotPass'
import ForgotPassVerificationScreen from '../../views/login_logout/ForgotPassVerification'
import DrawerMenu from '../common/navigation/sideDrawer/sideDrawer'

//COMPONENTS FOR ADMIN
import UserListScreen from '../../views/admin/UserManagement/UserList'
import UserDetailsScreen from '../../views/admin/UserManagement/UserDetails'
import AdminDrawerMenu from '../common/navigation/sideDrawer/AdminSideDrawer'
import CCAListScreen from '../../views/admin/CCAManagement/CCAList'
import CCADetailsScreen from '../../views/admin/CCAManagement/CCADetails'
import AddNewCCAScreen from '../../views/admin/CCAManagement/CreateNewCCA'
import SelectManagersScreen from '../../views/admin/CCAManagement/SelectManagersPage'


import { isLoggedIn, isAdmin } from '../../redux/store/store'
import { useSelector } from 'react-redux'

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

// NON-ADMIN
const DrawerStack = createDrawerNavigator()
const ProfileStack = createStackNavigator()
const HomeStack = createStackNavigator()
const EventsStack = createStackNavigator()
const RemindersStack = createStackNavigator()
const ManageCCAStack = createStackNavigator()
const ArchivesStack = createStackNavigator()
const LogoutStack = createStackNavigator()
const AuthStack = createStackNavigator()

const ProfileStackScreen = () => (
    <ProfileStack.Navigator>
        <ProfileStack.Screen name="Profile" component={ProfileScreen} options={{headerShown: false}} />
    </ProfileStack.Navigator>
)
const HomeStackScreen = () => (
    <HomeStack.Navigator>
        <HomeStack.Screen name='Home' component={HomeScreen} options={{headerShown: false}}/>
        <HomeStack.Screen name='ArticleDetail' component={ArticleDetailScreen} options={{headerShown: false}} />
    </HomeStack.Navigator>
)
const EventsStackScreen = () => (
    <EventsStack.Navigator>
        <EventsStack.Screen name='Events' component={EventsScreen} options={{headerShown: false}} />
        <EventsStack.Screen name='EventsDetails' component={EventDetailsPage} options={{headerShown: false}} />
        <EventsStack.Screen name='PastEventRating' component={PastEventRatingPage} options={{headerShown: false}} />
    </EventsStack.Navigator>
)
const RemindersStackScreen = () => (
    <RemindersStack.Navigator>
        <RemindersStack.Screen name='Reminders' component={RemindersScreen} options={{headerShown: false}} />
        <RemindersStack.Screen name='ReminderDetails' component={ReminderDetailsPage} options={{headerShown: false}} />
    </RemindersStack.Navigator>
)
const ManageCCAStackScreen = () => (
    <ManageCCAStack.Navigator>
        <ManageCCAStack.Screen name="ManageCCAScreen" component={ManageCCAScreen} options={{headerShown: false}}/>
        <ManageCCAStack.Screen name="CreateNewModal" component={CreateNewModal} options={{headerShown: false, cardOverlayEnabled: true}}/>
        <ManageCCAStack.Screen name="CreateEventScreen" component={CreateEventScreen} options={{headerShown: false}}/>
        <ManageCCAStack.Screen name="CreateAnnouncementScreen" component={CreateAnnouncementScreen} options={{headerShown: false}}/>
        <ManageCCAStack.Screen name="EditAnnouncementScreen" component={EditAnnouncementScreen} options={{headerShown: false}}/>
        <ManageCCAStack.Screen name="EditEventScreen" component={EditEventScreen} options={{headerShown: false}}/>
        <ManageCCAStack.Screen name="ViewParticipantScreen" component={ViewParticipantScreen} options={{headerShown: false}}/>
        <ManageCCAStack.Screen name="EditMemberScreen" component={EditMemberScreen} options={{headerShown: false}}/>
    </ManageCCAStack.Navigator>
)
const ArchivesStackScreen = () => (
    <ArchivesStack.Navigator>
        <ArchivesStack.Screen name="ArchivesScreen" component={ArchivesScreen} options={{headerShown: false}}/>
        <ArchivesStack.Screen name="EventReview" component={EventReviewPage} options={{headerShown: false}}/>
    </ArchivesStack.Navigator>
)
const LogoutStackScreen = () => (LogoutScreen)

// ADMIN ACCESS
const AdminDrawerStack = createDrawerNavigator()
const AdminManageUsersStack = createStackNavigator()
const AdminManageCCAStack = createStackNavigator()

const AdminManageUsersStackScreen = () => (
    <AdminManageUsersStack.Navigator>
        <AdminManageUsersStack.Screen name="UserListScreen" component={UserListScreen} options={{headerShown: false}}/>
        <AdminManageUsersStack.Screen name="UserDetailsScreen" component={UserDetailsScreen} options={{headerShown: false}}/>
    </AdminManageUsersStack.Navigator>
)
const AdminManageCCAStackScreen = () => (
    <AdminManageCCAStack.Navigator>
        <AdminManageCCAStack.Screen name="CCAListScreen" component={CCAListScreen} options={{headerShown: false}}/>
        <AdminManageCCAStack.Screen name="CCADetailsScreen" component={CCADetailsScreen} options={{headerShown: false}}/>
        <AdminManageCCAStack.Screen name="AddNewCCAScreen" component={AddNewCCAScreen} options={{headerShown: false}}/>
        <AdminManageCCAStack.Screen name="SelectManagersScreen" component={SelectManagersScreen} options={{headerShown: false}}/>
    </AdminManageCCAStack.Navigator>
)

const RootController = () => {
    const isAuth = useSelector(isLoggedIn)
    const isAdminStatus = useSelector(isAdmin)
    return (
    <NavigationContainer>
        {isAuth ? isAdminStatus ? (
            <AdminDrawerStack.Navigator initialRouteName="AdminManageUsersStackScreen"
                drawerBackgroundColor= "white"
                drawerContent= {props => <AdminDrawerMenu {...props}/>}
                drawerLockMode= "locked-closed"
                disableGestures= {true}
                drawerWidth= {screenWidth - 60} >
                <AdminManageUsersStack.Screen name="AdminManageUserScreen" component={AdminManageUsersStackScreen} />
                <AdminManageCCAStack.Screen name="AdminManageCCAScreen" component={AdminManageCCAStackScreen} />
            </AdminDrawerStack.Navigator>
        ) : (
            <DrawerStack.Navigator initialRouteName="HomeStackScreen"
                        drawerBackgroundColor= "white"
                        drawerContent= {props => <DrawerMenu {...props}/>}
                        drawerLockMode= "locked-closed"
                        disableGestures= {true}
                        drawerWidth= {screenWidth - 60} >
                <HomeStack.Screen name="HomeScreen" component={HomeStackScreen} />
                <EventsStack.Screen name="EventsScreen" component={EventsStackScreen} />
                <RemindersStack.Screen name="RemindersScreen" component={RemindersStackScreen} />
                <ManageCCAStack.Screen name="ManageCCAScreen" component={ManageCCAStackScreen} />
                <ArchivesStack.Screen name="ArchivesScreen" component={ArchivesStackScreen} />
                <LogoutStack.Screen name="LogoutScreen" component={LoginScreen} />
                <ProfileStack.Screen name="ProfileScreen" component={ProfileStackScreen} />
            </DrawerStack.Navigator>
        ) : (
            <AuthStack.Navigator initialRouteName="AuthStackScreen">
                <AuthStack.Screen name="LoginScreen" component={LoginScreen} options={{headerShown: false}}/>
                <AuthStack.Screen name="CreateAccount" component={props => <CreateAccountScreen {...props} />} options={{headerShown: false}}/>
                <AuthStack.Screen name="ForgotPassScreen" component={ForgotPassScreen} options={{headerShown: false}}/>
                <AuthStack.Screen name="ForgotPassVerificationScreen" component={ForgotPassVerificationScreen} options={{headerShown: false}}/>
            </AuthStack.Navigator>
        ) }
        
    </NavigationContainer>
)}
export default RootController

