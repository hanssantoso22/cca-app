import React from 'react'
import { SafeAreaView } from 'react-native'
import { useFonts, Lato_700Bold } from '@expo-google-fonts/lato'
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs'
import { page, PURPLE, MING, GREY } from '../../components/common/styles'
import Navbar from '../../components/common/navigation/navbar/navbar'
import CalendarView from './CalendarView'
import PastEvents from './PastRegisteredEvents'


export default function Events (props) {
    const [isLoaded] = useFonts({Lato_700Bold})
    const loaded = isLoaded
    const EventsTabs = createMaterialTopTabNavigator()
    const onMenuPress = () => {
        props.navigation.openDrawer()
    }
    return (
        <SafeAreaView style={page.main}>
            <Navbar title="Events" pressed={onMenuPress} />
            <EventsTabs.Navigator 
                tabBarOptions={{
                    style: {
                        backgroundColor: GREY[0],
                    },
                    labelStyle: {
                        fontFamily: 'Lato_700Bold',
                        fontSize: 13
                    },
                    indicatorStyle: {backgroundColor: MING[4], height: 3},
                    activeTintColor: PURPLE[6],
                    inactiveTintColor: GREY[2]
                }}
            >
                <EventsTabs.Screen name="Upcoming" component={CalendarView} />
                <EventsTabs.Screen name="Past" component={PastEvents} />
            </EventsTabs.Navigator>
        </SafeAreaView>
    )
}
