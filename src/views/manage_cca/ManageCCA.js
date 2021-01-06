import React from 'react';
import Navbar from '../../components/common/navigation/navbar/navbar'
import ModalWindow from './createNewModal'
import { page, PURPLE, MING, GREY } from '../../components/common/styles'
import { SafeAreaView } from 'react-native'
import { toggleModal, selectItemInModal } from '../../redux/reducers/manageCCASlice'
import { isModalOpened } from '../../redux/store/store'
import { useDispatch, useSelector } from 'react-redux'
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs'
import { useFonts, Lato_700Bold } from '@expo-google-fonts/lato'
import EventsScreen from './Events'
import AnnouncementsScreen from './Announcements'

export default function ManageCCA (props) {
    const [isLoaded] = useFonts({Lato_700Bold})
    const loaded = isLoaded
    const modalVisibility = useSelector(isModalOpened)
    const dispatch = useDispatch()
    const onMenuPress = () => {
        props.navigation.openDrawer()
    }
    const openAddModal = () => {
        dispatch(toggleModal())
    }
    const createNewHandler = (checked) => {
        if (checked == 'Event') {
            props.navigation.push('CreateEventScreen')
        }
        else {
            props.navigation.push('CreateAnnouncementScreen')
        }
        dispatch(toggleModal())
        dispatch(selectItemInModal(null))
    } 
    const ManageCCATabs = createMaterialTopTabNavigator()
    return (
        <SafeAreaView style={page.main}>
            <Navbar title="Manage CCA" pressed={onMenuPress} add={openAddModal}/>
            <ManageCCATabs.Navigator 
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
                <ManageCCATabs.Screen name="Events" component={EventsScreen} />
                <ManageCCATabs.Screen name="Announcements" component={AnnouncementsScreen} />
            </ManageCCATabs.Navigator>
            
            <ModalWindow isModalVisible={modalVisibility} closeModal={openAddModal} submit={createNewHandler}/>
        </SafeAreaView>
    )
}