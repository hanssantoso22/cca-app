import React from 'react'
import { GREY, page } from '../../components/common/styles'
import Modal from 'react-native-modal';
import { View, Text, StyleSheet, Image } from 'react-native'
import { useFonts, Lato_700Bold, Lato_400Regular } from '@expo-google-fonts/lato'

import PrimaryButton from '../../components/common/buttons/PrimaryBig'
import CheckIcon from '../../assets/common/icons/check_circle.png'

const createNewModal = ({ isModalVisible, closeModal, submitHandler }) => {
    const [isLoaded] = useFonts({
        Lato_700Bold,
        Lato_400Regular,
        'MaterialIcons-Regular': require('../../assets/fonts/MaterialIcons-Regular.ttf')
    })
    const styles = StyleSheet.create ({
        title: {
            fontFamily: 'Lato_700Bold',
            fontSize: 24,
            color: GREY[6],
            textAlign: 'center',
            letterSpacing: 1,
        },
        iconWrapper: {
            alignItems: 'center',
        },
        checkIcon: {
            width: 50,
            height: 50,
            marginVertical: 20,
        },
        captionWrapper: {
            alignItems: 'center',
        },
        captionText: {
            textAlign: 'center',
            fontFamily: 'Lato_400Regular',
            fontSize: 16,
            color: GREY[4],
        },
    })
    return (isLoaded &&
        <Modal isVisible={isModalVisible} onBackdropPress={closeModal}>
            <View style={{...page.modal, paddingHorizontal: 25}}>
                <Text style={styles.title}>Thank You</Text>
                <View style={styles.iconWrapper}>
                    <Image style={styles.checkIcon} source={CheckIcon} />
                </View>
                <View style={styles.captionWrapper}>
                    <Text style={styles.captionText}>
                        Check out our event details in 'Reminders' page!
                    </Text>
                </View>
                <View style={{marginTop:25, marginBottom: 10}}>
                    <PrimaryButton text="Back to Events page" fontSize={16} pressHandler={submitHandler}/> 
                </View>
            </View>    
        </Modal>
    )  
}
export default createNewModal