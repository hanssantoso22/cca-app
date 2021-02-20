import React, { useState } from 'react'
import { GREY, page, button} from '../../components/common/styles'
import Modal from 'react-native-modal';
import { View, Text, StyleSheet } from 'react-native'
import { useFonts, Lato_700Bold } from '@expo-google-fonts/lato'

import { FlatList, TouchableWithoutFeedback } from 'react-native-gesture-handler';
import CheckBoxItem from '../../components/manage_cca/checkboxItem'
import PrimaryButton from '../../components/common/buttons/PrimaryBig'
import { selectItemInModal } from '../../redux/reducers/manageCCASlice'
import { selectedItem } from '../../redux/store/store'
import { useDispatch, useSelector } from 'react-redux';


const createNewModal = (props) => {
    const [isLoaded] = useFonts({
        Lato_700Bold,
        'MaterialIcons-Regular': require('../../assets/fonts/MaterialIcons-Regular.ttf')
    })
    const dispatch = useDispatch()
    const checked = useSelector(selectedItem)
    const styles = StyleSheet.create ({
        title: {
            fontFamily: 'Lato_700Bold',
            fontSize: 20,
            color: GREY[6],
            textAlign: 'center',
            letterSpacing: 1,
            marginBottom: 20,
        }
    })
    const data = [
        {id:0, label:'Event', icon:'event', selected: checked=='Event' ? true : false},
        {id:1, label:'Announcement',icon:'announcement', selected: checked=='Announcement' ? true : false}
    ]
    const selectItem = (label) => {
        if (label == 'Event'){
            dispatch(selectItemInModal('Event'))
        }
        else {
            dispatch(selectItemInModal('Announcement'))
        }
    }
    return (isLoaded &&
        <Modal isVisible={props.isModalVisible} onBackdropPress={props.closeModal}>
            <View style={page.modal}>
                <Text style={styles.title}>I wanna create a new...</Text>
                <FlatList data={data}
                            keyExtractor={item=>item.id}
                            renderItem={({ item }) => (
                                    <CheckBoxItem icon={item.icon} label={item.label} active={item.selected} selected={selectItem.bind(this,item.label)} />
                                    )}
                />
                <View style={{marginTop:5}}>
                    <PrimaryButton text="Create" fontSize={20} pressHandler={props.submit.bind(this,checked)} /> 
                </View>
            </View>    
        </Modal>
    )   
}
export default createNewModal