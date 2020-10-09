import { createAppContainer } from 'react-navigation'
import { createDrawerNavigator } from 'react-navigation-drawer';
import { createStackNavigator } from 'react-navigation-stack';
import { Dimensions } from 'react-native'

import HomeScreen from '../../views/home/home'
import EventsScreen from '../../views/events/events'
import RemindersScreen from '../../views/reminders/reminders'
import ClubsScreen from '../../views/clubs/clubs'
import ManageCCAScreen from '../../views/manage_cca/manage_cca'
import ArchivesScreen from '../../views/archives/archives'
import LogoutScreen from '../../views/login_logout/logout'
import DrawerMenu from '../common/navigation/sideDrawer/sideDrawer'

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

// CREATE STACK NAVIGATORS
const HomeNavigator = createStackNavigator({
    HomeScreen,
}, {
    headerMode: 'none',
})
const EventsNavigator = createStackNavigator({
    EventsScreen
}, {
    headerMode: 'none',
})
const RemindersNavigator = createStackNavigator({
    RemindersScreen
}, {
    headerMode: 'none',
})
const ClubsNavigator = createStackNavigator({
    ClubsScreen
}, {
    headerMode: 'none',
})
const ManageCCANavigator = createStackNavigator({
    ManageCCAScreen
}, {
    headerMode: 'none',
})
const ArchivesNavigator = createStackNavigator({
    ArchivesScreen
}, {
    headerMode: 'none',
})
const LogoutNavigator = createStackNavigator({
    LogoutScreen
}, {
    headerMode: 'none',
})

// CREATE DRAWER NAVIGATOR
const DrawerNavigator = createDrawerNavigator ({
    HomeScreen: HomeNavigator,
    EventsScreen: EventsNavigator,
    ClubsScreen: ClubsNavigator,
    RemindersScreen: RemindersNavigator,
    ManageCCAScreen: ManageCCANavigator,
    ArchivesScreen: ArchivesNavigator,
    LogoutScreen: LogoutNavigator,
}, {
    initialRouteName: 'HomeScreen',
    drawerBackgroundColor: 'white',
    contentComponent: DrawerMenu,
    drawerLockMode: "locked-closed",
    disableGestures: true,
    drawerWidth: screenWidth - 60,
})

export default RootController = createAppContainer(DrawerNavigator)

