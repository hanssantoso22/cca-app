import React, { useState } from 'react'
import moment from 'moment'
import { View, SafeAreaView, Text, StyleSheet, TouchableWithoutFeedback, Alert, Keyboard, Platform } from 'react-native'
import { page, RED, GREY, marginHorizontal } from '../../../components/common/styles'
import SubNavbar from '../../../components/common/navigation/navbar/SubNavbar'
import { useFonts, Lato_700Bold, Lato_400Regular } from '@expo-google-fonts/lato'
import { useForm, Controller } from 'react-hook-form'
import SecondaryButton from '../../../components/common/buttons/SecondarySmall'
import PrimaryButton from '../../../components/common/buttons/PrimarySmall'
import DatePicker from '../../../components/common/forms/DatePicker'
import axios from 'axios'
import {URL, authenticate} from '../../../api/config'
import store from '../../../redux/store/store'

export default function CCADetails (props) {
    const [isLoaded] = useFonts({
        Lato_700Bold,
        Lato_400Regular,
        'MaterialIcons-Regular': require('../../../assets/fonts/MaterialIcons-Regular.ttf')
    })
    const [showStartPicker, setShowStartPicker] = useState(false)
    const [showEndPicker, setShowEndPicker] = useState(false)
    const [startDate, setStartDate] = useState(moment().format(`${'YYYY-MM-DD'}T${'HH:mm:ss.sssZ'}`))
    const [endDate, setEndDate] = useState(moment().format(`${'YYYY-MM-DD'}T${'HH:mm:ss.sssZ'}`))
    const { ccaID } = props.route.params
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
    const { control, handleSubmit } = useForm()
    const onBackPress = () => {
        props.navigation.goBack()
    }
    const confirmEndCommitteeHandler = async (ccaID, data) => {
        try {
            const res = await axios.patch(`${URL}/CCA/${ccaID}/endCommittee`, data, authenticate(store.getState().main.token))
            props.navigation.navigate('CCAListScreen')
        } catch (err) {
            Alert.alert('Process failed')
        }
    }
    const onSubmit = data => {
        data.start = startDate
        data.end = endDate
        confirmEndCommitteeHandler(ccaID, data)
    }
    return (isLoaded &&
        <TouchableWithoutFeedback onPress={() => {setShowEndPicker(false); setShowStartPicker(false); Keyboard.dismiss()}} >
        <SafeAreaView style={page.main}>
            <SubNavbar title='Confirmation' pressed={onBackPress} />
            <View style={{marginTop: marginHorizontal, marginHorizontal}}>
                <Text style={styles.title}>Are you sure to end the current committee?</Text>
                <Text style={styles.description}>Warning: This action will reset managers, members, executive committee, and main committee of this CCA.</Text>
                <Controller
                    control={control}
                    render={() => (
                        <DatePicker
                            label='Start*'
                            mode='date'
                            value={startDate}
                            minimumDate={Date.parse(moment().subtract(1,'year').format(`${'YYYY-MM-DD'}T${'HH:mm:ss.sssZ'}`))}
                            onFocus={()=>setShowStartPicker(true)}
                            showPicker={showStartPicker}
                            onChangePicker={(event, itemValue) => {
                                if (Platform.OS == "android"){ 
                                    setShowStartPicker(!showStartPicker)
                                    Keyboard.dismiss()
                                }
                                const val = moment(itemValue).format(`${'YYYY-MM-DD'}T${'HH:mm:ss.sssZ'}`)
                                setStartDate(val)
                                setEndDate(val)
                            }}
                        />
                    )}
                    name="start"
                    defaultValue={startDate}
                />
                <Controller
                    control={control}
                    render={() => (
                        <DatePicker
                            label='End*'
                            mode='date'
                            value={endDate}
                            minimumDate={Date.parse(startDate)}
                            onFocus={()=>setShowEndPicker(true)}
                            showPicker={showEndPicker}
                            onChangePicker={(event, itemValue) => {
                                if (Platform.OS == "android") {
                                    setShowEndPicker(!showEndPicker)
                                    Keyboard.dismiss()
                                }
                                const val = moment(itemValue).format(`${'YYYY-MM-DD'}T${'HH:mm:ss.sssZ'}`)
                                setEndDate(val)
                            }}
                        />
                    )}
                    name="end"
                    defaultValue={startDate}
                />

                <View style={{marginTop:25, marginBottom: 10}}>
                    <View style={{flexDirection: 'row'}}>
                        <View style={styles.buttonContainer}>
                            <SecondaryButton text="Cancel" fontSize={16} pressHandler={onBackPress} style={styles.secondaryDanger} />
                        </View>
                        <View style={styles.buttonContainer}>
                            <PrimaryButton text="Yes, confirm" fontSize={16} pressHandler={handleSubmit(onSubmit)} style={styles.primaryDanger} />
                        </View>
                    </View>
                </View>
            </View> 
        </SafeAreaView>
        </TouchableWithoutFeedback>
    )
}
