import React, { useState, useEffect } from 'react';
import SubNavbar from '../../components/common/navigation/navbar/SubNavbar'
import { page, GREY, marginHorizontal } from '../../components/common/styles'
import { SafeAreaView, View, Text, StyleSheet, TouchableWithoutFeedback, Keyboard, ScrollView } from 'react-native'
import { useFonts, Lato_700Bold, Lato_400Regular } from '@expo-google-fonts/lato'
import { useForm, Controller } from 'react-hook-form'
import moment from 'moment'
import { useSelector, useDispatch } from 'react-redux'
import { changeStartDate, changeEndDate } from '../../redux/reducers/CreateEventSlice'
import CustomTextInput from '../../components/common/forms/TextInput'
import MultiLineInput from '../../components/common/forms/MultiLineInput'
import CustomPicker from '../../components/common/forms/Picker'
import DateTimePicker from '../../components/common/forms/DateTimePicker'
import PrimaryButton from '../../components/common/buttons/PrimarySmall'
import SecondaryButton from '../../components/common/buttons/SecondarySmall'


export default function home (props) {
    const [isLoaded] = useFonts({
        Lato_400Regular,
        Lato_700Bold
    })
    const loaded = isLoaded
    const dispatch = useDispatch()
    
    const [showStartPicker, setShowStartPicker] = useState(false)
    const [showEndPicker, setShowEndPicker] = useState(false)
    const onBackPress = () => {
        props.navigation.goBack()
    }
    const styles = StyleSheet.create ({
        card: {
            borderRadius: 15,
            backgroundColor: 'white',
            marginBottom: 15,
            marginHorizontal: 15,
            shadowColor: 'black',
            shadowOffset: {width: 3, height: 4},
            shadowOpacity: 0.1,
            shadowRadius: 8,
            paddingHorizontal: 20,
            paddingTop: 20,
            paddingBottom: 20,
            marginHorizontal: marginHorizontal,
        },
        pageTitle: {
            fontFamily: 'Lato_400Regular',
            fontSize: 20,
            color: GREY[4],
            marginLeft: marginHorizontal,
            marginBottom: marginHorizontal,
        },
        inputLabel: {
            fontFamily: 'Lato_400Regular'
        },

        
    })
    const CCAs = [
        {label: 'EEE Club', value: 'EEE Club'},
        {label: 'Garage @EEE', value: 'Garage @EEE'},
        {label: 'MLDA @EEE', value: 'MLDA @EEE'}
    ]
    const audience = [
        {label: 'Public', value: 'Public'},
        {label: 'Internal', value: 'Internal'}
    ]
    const startDate = useSelector(state => state.createEventSlice.startDate)
    const endDate = useSelector(state => state.createEventSlice.endDate)

    const defaultValues = {
        eventName: "",
        eventStartDate: startDate,
        eventEndDate: startDate,
        eventDescription: "",
        eventOrganizer: "",
        eventAudience: "",
    }
    const { control, handleSubmit, reset } = useForm({
        defaultValues
    })
    const onSubmit = data => {
        console.log('Data: ',data)
    }
    const resetHandler = ()=> {
        reset(defaultValues)
        console.log('reset')
    }

    return (
        <TouchableWithoutFeedback onPress={() => {Keyboard.dismiss(); setShowStartPicker(false); setShowEndPicker(false)}}>
            <SafeAreaView style={page.main}>
                <SubNavbar title='Create Event' pressed={onBackPress} />
                <ScrollView>
                    <View style={page.main}>
                        <Text style={styles.pageTitle}>Event Details</Text>
                        <View style={styles.card}>
                        <View style={{width: '100%'}}>
                            <Controller
                                control={control}
                                render= {({ onChange, value }) => (
                                    <CustomTextInput
                                        label='Event Name'
                                        onChangeText={text=>{onChange(text)}}
                                        value={value}
                                        maxLength={40}
                                        type='name'
                                    />
                                  )}
                                  name="eventName"
                            />
                            <Controller
                                control={control}
                                render= {() => (
                                    <DateTimePicker
                                        label='Start Date'
                                        mode='datetime'
                                        value={startDate}
                                        onFocus={()=>setShowStartPicker(true)}
                                        showPicker={showStartPicker}
                                        onChangePicker={(event,itemValue) => {
                                            const val = moment(itemValue).format(`${'YYYY-MM-DD'}T${'HH:mm:ss.sssZ'}`)                
                                            dispatch(changeStartDate(val))
                                        }}
                                    />
                                  )}
                                  name="eventStartDate"
                            />
                            <Controller
                                control={control}
                                render= {() => (
                                    <DateTimePicker
                                        label='End Date'
                                        mode='datetime'
                                        value={endDate}
                                        onFocus={()=>setShowEndPicker(true)}
                                        showPicker={showEndPicker}
                                        onChangePicker={(event,itemValue) => {
                                            const val = moment(itemValue).format(`${'YYYY-MM-DD'}T${'HH:mm:ss.sssZ'}`)                
                                            dispatch(changeEndDate(val))
                                        }}
                                    />
                                  )}
                                  name="eventEndDate"
                            />
                            <Controller
                                control={control}
                                render= {({ onChange, value }) => (
                                    <MultiLineInput
                                        label='Content'
                                        onChangeText={text=>{onChange(text)}}
                                        value={value}
                                        multiline={true}
                                        maxLength={500}
                                        type='name'
                                    />
                                  )}
                                  name="eventDescription"
                            />
                            <Controller
                                control={control}
                                render= {({ onChange, value }) => (
                                    <CustomPicker 
                                        items={CCAs} 
                                        label='CCA'
                                        value={value}
                                        onValueChange={item=>{onChange(item)}}
                                    />
                                  )}
                                  name="eventOrganizer"
                            />
                            <Controller
                                control={control}
                                render= {({ onChange, value }) => (
                                    <CustomPicker 
                                        items={audience} 
                                        label='Audience'
                                        value={value} 
                                        onValueChange={item=>{onChange(item)}}
                                    />
                                  )}
                                  name="eventAudience"
                            />
                            <View style={{flexDirection: 'row', width: '100%'}}>
                                <View style={{paddingRight: 10, flex: 1}}>
                                    <SecondaryButton fontSize={16} text="Clear Input" pressHandler={resetHandler}/>
                                </View>
                                <View style={{paddingLeft: 10, flex: 1}}>
                                    <PrimaryButton fontSize={16} text="Submit" pressHandler={handleSubmit(onSubmit)}/>
                                </View>
                            </View>
                        </View>
                            
                        </View>
                    </View>
                </ScrollView>
            </SafeAreaView>
        </TouchableWithoutFeedback>
        
    )
}