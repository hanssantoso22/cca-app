import React, { useState } from 'react';
import Navbar from '../../components/common/navigation/navbar/navbar'
import ModalWindow from './createNewModal'
import { page } from '../../components/common/styles'
import { SafeAreaView, View, Text } from 'react-native'
import { toggleModal } from '../../redux/reducers/manageCCASlice'
import { isModalOpened } from '../../redux/store/store'
import { useDispatch, useSelector } from 'react-redux'

export default function ManageCCA (props) {
    const modalVisibility = useSelector(isModalOpened)
    const dispatch = useDispatch()
    const onMenuPress = () => {
        props.navigation.openDrawer()
    }
    const openAddModal = () => {
        dispatch(toggleModal())
    }
    return (
        <SafeAreaView style={page.main}>
            <Navbar title="Manage CCA" pressed={onMenuPress} add={openAddModal}/>
            <View style={page.main}>
                <Text>Manage CCA</Text>
            </View>
            <ModalWindow isModalVisible={modalVisibility} closeModal={openAddModal}/>
        </SafeAreaView>
    )
}