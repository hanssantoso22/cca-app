import React from 'react'
import { GREY, page } from '../../components/common/styles'
import Modal from 'react-native-modal';
import { View, Text, StyleSheet } from 'react-native'
import { useFonts, Lato_700Bold, Lato_400Regular } from '@expo-google-fonts/lato'
import { AppLoading } from 'expo'
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
            letterSpacing: 1,
        },
        buttonContainer: {
            flex: 1,
            paddingHorizontal: 5
        },
        secondaryDanger: {
            borderColor:  '#AA042C',
            color: '#AA042C',
        },
        primaryDanger: {
            backgroundColor: '#AA042C',
        }
    })
    
    if (!isLoaded) {
        return (<AppLoading />)
    }
    else {
        return (
            <Modal isVisible={isModalVisible} onBackdropPress={closeModal}>
                <View style={{...page.modal, paddingHorizontal: 25}}>
                    <Text style={styles.title}>Are you sure to remove your profile picture?</Text>
                    <View style={{marginTop:25, marginBottom: 10}}>
                        <View style={{flexDirection: 'row'}}>
                            <View style={styles.buttonContainer}>
                                <SecondaryButton text="Cancel" fontSize={16} pressHandler={cancelHandler} style={styles.secondaryDanger} />
                            </View>
                            <View style={styles.buttonContainer}>
                                <PrimaryButton text="Yes, just delete" fontSize={16} pressHandler={confirmHandler} style={styles.primaryDanger} />
                            </View>
                        </View>
                    </View>
                </View>    
            </Modal>
        )
    }   
}
export default createNewModal