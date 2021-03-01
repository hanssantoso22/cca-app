import React, { useState, useEffect } from 'react'
import moment from 'moment'
import { GREY, RED, page } from '../../../components/common/styles'
import Modal from 'react-native-modal';
import { View, Text, StyleSheet, TouchableWithoutFeedback } from 'react-native'
import { useFonts, Lato_700Bold, Lato_400Regular } from '@expo-google-fonts/lato'
import { useForm, Controller } from 'react-hook-form'
import { useDispatch } from 'react-redux'
import { changeStartDate, changeEndDate } from '../../../redux/reducers/CreateEventSlice'
import DatePicker from '../../../components/common/forms/DateTimePicker'

import PrimaryButton from '../../../components/common/buttons/PrimarySmall'
import SecondaryButton from '../../../components/common/buttons/SecondarySmall'

import store from '../../../redux/store/store'

const createNewModal = ({ isModalVisible, closeModal, confirmHandler, cancelHandler, ccaID }) => {
    const dispatch = useDispatch()
    const [isLoaded] = useFonts({
        Lato_700Bold,
        Lato_400Regular,
        'MaterialIcons-Regular': require('../../../assets/fonts/MaterialIcons-Regular.ttf')
    })
    const [showStartPicker, setShowStartPicker] = useState(false)
    const [showEndPicker, setShowEndPicker] = useState(false)
    const [starting, setStarting] = useState(moment().format(`${'YYYY-MM-DD'}T${'HH:mm:ss.sssZ'}`))
    const [ending, setEnding] = useState(moment().format(`${'YYYY-MM-DD'}T${'HH:mm:ss.sssZ'}`))
    const styles = StyleSheet.create ({
        title: {
            fontFamily: 'Lato_700Bold',
            fontSize: 20,
            color: GREY[6],
            textAlign: 'center',
            letterSpacing: 0.5,
        },
        description: {
            fontFamily: 'Lato_400Regular',
            fontSize: 13,
            color: GREY[4],
            textAlign: 'center',
            lineHeight: 15,
            marginTop: 15
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
        },
        errorMessage: {
            color: RED[5],
            fontSize: 11,
            fontStyle: 'italic',
            marginBottom: 15,
            marginTop: -10
        },
    })
    const { control, handleSubmit, reset, setValue, errors } = useForm()
    const onSubmit = data => {
        data.start = store.getState().createEvent.startDate
        data.end = store.getState().createEvent.endDate
        confirmHandler(ccaID, data)
    }
    useEffect(() => {
        dispatch(changeStartDate(moment().format(`${'YYYY-MM-DD'}T${'HH:mm:ss.sssZ'}`)))
        dispatch(changeEndDate(moment().format(`${'YYYY-MM-DD'}T${'HH:mm:ss.sssZ'}`)))
    }, [])
    return (isLoaded &&
        <Modal isVisible={isModalVisible} onBackdropPress={closeModal}>
            <TouchableWithoutFeedback onPress={() => {setShowEndPicker(false); setShowStartPicker(false)}} >
            <View style={{...page.modal, paddingHorizontal: 25}}>
                <Text style={styles.title}>Are you sure to end the current committee?</Text>
                <Text style={styles.description}>Warning: This action will reset managers, members, executive committee, and main committee of this CCA.</Text>
                <Controller
                    control={control}
                    render={() => (
                        <DatePicker
                            label='Start*'
                            mode='date'
                            value={store.getState().createEvent.startDate}
                            onFocus={()=>setShowStartPicker(true)}
                            showPicker={showStartPicker}
                            onChangePicker={(event, itemValue) => {
                                const val = moment(itemValue).format(`${'YYYY-MM-DD'}T${'HH:mm:ss.sssZ'}`)
                                dispatch(changeStartDate(val))
                                dispatch(changeEndDate(val))
                            }}
                        />
                    )}
                    name="start"
                    defaultValue={store.getState().createEvent.startDate}
                />
                <Controller
                    control={control}
                    render={() => (
                        <DatePicker
                            label='End*'
                            mode='date'
                            value={store.getState().createEvent.endDate}
                            minimumDate={store.getState().createEvent.startDate}
                            onFocus={()=>setShowEndPicker(true)}
                            showPicker={showEndPicker}
                            onChangePicker={(event, itemValue) => {
                                const val = moment(itemValue).format(`${'YYYY-MM-DD'}T${'HH:mm:ss.sssZ'}`)
                                dispatch(changeEndDate(val))
                            }}
                        />
                    )}
                    name="end"
                    defaultValue={store.getState().createEvent.startDate}
                />

                <View style={{marginTop:25, marginBottom: 10}}>
                    <View style={{flexDirection: 'row'}}>
                        <View style={styles.buttonContainer}>
                            <SecondaryButton text="Cancel" fontSize={16} pressHandler={cancelHandler} style={styles.secondaryDanger} />
                        </View>
                        <View style={styles.buttonContainer}>
                            <PrimaryButton text="Yes, confirm" fontSize={16} pressHandler={handleSubmit(onSubmit)} style={styles.primaryDanger} />
                        </View>
                    </View>
                </View>
            </View> 
            </TouchableWithoutFeedback>   
        </Modal>
    )  
}
export default createNewModal