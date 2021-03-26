import React from 'react'
import { GREY, page } from '../../components/common/styles'
import Modal from 'react-native-modal';
import { View, Text, StyleSheet } from 'react-native'
import { useFonts, Lato_700Bold, Lato_400Regular } from '@expo-google-fonts/lato'

import PrimaryButton from '../../components/common/buttons/PrimarySmall'
import SecondaryButton from '../../components/common/buttons/SecondarySmall'

const createNewModal = ({ isModalVisible, closeModal, confirmHandler, cancelHandler }) => {
    const [isLoaded] = useFonts({
        Lato_700Bold,
        Lato_400Regular,
        'MaterialIcons-Regular': require('../../assets/fonts/MaterialIcons-Regular.ttf')
    })
    const styles = StyleSheet.create ({
        title: {
            fontFamily: 'Lato_700Bold',
            fontSize: 20,
            color: GREY[6],
            textAlign: 'center',
            letterSpacing: 0.5,
        },
        buttonContainer: {
            flex: 1,
            paddingHorizontal: 5
        },
    })
    return (isLoaded &&
        <Modal isVisible={isModalVisible} onBackdropPress={closeModal}>
            <View style={{...page.modal, paddingHorizontal: 25}}>
                <Text style={styles.title}>Are you sure to logout all devices?</Text>
                <View style={{marginTop:25, marginBottom: 10}}>
                    <View style={{flexDirection: 'row'}}>
                        <View style={styles.buttonContainer}>
                            <SecondaryButton text="Cancel" fontSize={16} pressHandler={cancelHandler} />
                        </View>
                        <View style={styles.buttonContainer}>
                            <PrimaryButton text="Yes, just logout" fontSize={16} pressHandler={confirmHandler} />
                        </View>
                    </View>
                </View>
            </View>    
        </Modal>
    )  
}
export default createNewModal