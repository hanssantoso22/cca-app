import React, { useState } from 'react';
import SubNavbar from '../../components/common/navigation/navbar/SubNavbar'
import { page, GREY, marginHorizontal } from '../../components/common/styles'
import { SafeAreaView, View, Text, StyleSheet, TouchableWithoutFeedback, Keyboard, ScrollView } from 'react-native'
import { useFonts, Lato_700Bold, Lato_400Regular } from '@expo-google-fonts/lato'
import { Formik } from 'formik'
import moment from 'moment'
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
    const [showPicker, setShowPicker] = useState(false)
    const [date, setDate] = useState(moment().format(`${'YYYY-MM-DD'}T${'HH:mm:ss.sssZ'}`))
    const { eventID } = props.route.params 
    const onBackPress = () => {
        props.navigation.goBack()
    }
    const displayPickerHandler = () => {
        setShowPicker(true)
    }
    const normalDateFormatParser = (dateObject) => {
        const dateString = dateObject.toString()
        const normalDate = moment(dateString).format('DD MMMM YYYY')
        return normalDate
    }
    const normalTimeFormatParser = (dateObject) => {
        const dateString = dateObject.toString()
        const normalDate = moment(dateString).format('HH:mm')
        return normalDate
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
    const initialValues = {
        eventName: '', 
        date: date, 
        time: '', 
        venue: '', 
        meetingLink: '', 
        decription: '', 
        CCAName: '', 
        audience: ''
    }

    return (
        <TouchableWithoutFeedback onPress={() => {Keyboard.dismiss(); setShowPicker(false)}}>
            <SafeAreaView style={page.main}>
                <SubNavbar title='Edit Event' pressed={onBackPress} />
                <ScrollView>
                    <View style={page.main}>
                        <Text style={styles.pageTitle}>Event Details</Text>
                        <View style={styles.card}>
                            <Formik
                                initialValues={initialValues}
                                onSubmit = {(values,actions)=>{
                                    console.log(values)
                                }}
                            >
                                {({ handleChange, handleReset, handleSubmit, values, setFieldValue }) => (
                                    <View style={{width: '100%'}}>
                                        <CustomTextInput
                                            label='Event Name'
                                            onChangeText={handleChange('eventName')}
                                            value={values.eventName}
                                            maxLength={40}
                                            type='name'
                                        />
                                        <DateTimePicker
                                            label='Date'
                                            onChangePicker={itemValue=>{
                                                const val = moment(itemValue).format(`${'YYYY-MM-DD'}T${'HH:mm:ss.sssZ'}`)                
                                                setFieldValue('date',val)
                                                console.log(values.date)
                                            }}
                                            onChangeText={handleChange('date')}
                                            value={values.date}
                                            mode='date'
                                            onFocus={displayPickerHandler}
                                            showPicker={showPicker}
                                        />
                                        <MultiLineInput
                                            label='Content'
                                            onChangeText={handleChange('content')}
                                            value={values.content}
                                            multiline={true}
                                            maxLength={500}
                                            type='name'
                                        />
                                        <CustomPicker 
                                            items={CCAs} 
                                            label='CCA'
                                            selectedValue={values.CCAName} 
                                            onValueChange={itemValue => setFieldValue('CCAName', itemValue)}
                                        />
                                        <CustomPicker 
                                            items={audience} 
                                            label='Audience'
                                            selectedValue={values.audience} 
                                            onValueChange={itemValue => setFieldValue('audience', itemValue)}
                                        />
                                        <View style={{flexDirection: 'row', width: '100%'}}>
                                            <View style={{paddingRight: 10, flex: 1}}>
                                                <SecondaryButton fontSize={16} text="Clear Input" pressHandler={()=>reset()}/>
                                            </View>
                                            <View style={{paddingLeft: 10, flex: 1}}>
                                                <PrimaryButton fontSize={16} text="Submit" pressHandler={handleSubmit}/>
                                            </View>
                                        </View>
                                    </View>
                                )}
                            </Formik>
                        </View>
                    </View>
                </ScrollView>
            </SafeAreaView>
        </TouchableWithoutFeedback>
        
    )
}