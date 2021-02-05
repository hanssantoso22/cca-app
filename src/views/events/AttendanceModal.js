import React from 'react'
import { GREY, page } from '../../components/common/styles'
import Modal from 'react-native-modal';
import { View, Text, StyleSheet } from 'react-native'
import { useFonts, Lato_700Bold, Lato_400Regular } from '@expo-google-fonts/lato'
import { AppLoading } from 'expo'
import PrimaryButton from '../../components/common/buttons/PrimarySmall'
import SecondaryButton from '../../components/common/buttons/SecondarySmall'

const createNewModal = ({ isModalVisible, closeModal, didNotAttendHandler, attendedHandler, eventID }) => {
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
            letterSpacing: 1,
        },
        buttonContainer: {
            flex: 1,
            paddingHorizontal: 5
        }
    })
    if (!isLoaded) {
        return (<AppLoading />)
    }
    else {
        return (
            <Modal isVisible={isModalVisible} onBackdropPress={closeModal}>
                <View style={{...page.modal, paddingHorizontal: 25}}>
                    <Text style={styles.title}>Did you attend the event?</Text>
                    <View style={{marginTop:25, marginBottom: 10}}>
                        <View style={{flexDirection: 'row'}}>
                            <View style={styles.buttonContainer}>
                                <SecondaryButton text="No" fontSize={16} pressHandler={didNotAttendHandler.bind(this,eventID)} />
                            </View>
                            <View style={styles.buttonContainer}>
                                <PrimaryButton text="Yes, I attended" fontSize={16} pressHandler={attendedHandler.bind(this,eventID)} />
                            </View>
                        </View>
                    </View>
                </View>    
            </Modal>
        )
    }   
}
export default createNewModal