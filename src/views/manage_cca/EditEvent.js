import React, { useState, useEffect } from 'react'
import * as ImagePicker from 'expo-image-picker'
import FormData from 'form-data'
import mime from 'mime'
import moment from 'moment'
import SubNavbar from '../../components/common/navigation/navbar/SubNavbar'
import WithLoading from '../../components/hoc/withLoading'
import LoadingOverlay from '../../components/common/LoadingOverlay'
import { page, GREY, MING, RED, marginHorizontal } from '../../components/common/styles'
import { SafeAreaView, View, Text, StyleSheet, TouchableWithoutFeedback, Keyboard, ScrollView, Alert } from 'react-native'
import { useFonts, Lato_700Bold, Lato_400Regular } from '@expo-google-fonts/lato'
import { useForm, Controller } from 'react-hook-form'
import { ErrorMessage } from '@hookform/error-message'
import { useDispatch } from 'react-redux'
import CustomTextInput from '../../components/common/forms/TextInput'
import MultiLineInput from '../../components/common/forms/MultiLineInput'
import CustomPicker from '../../components/common/forms/Picker'
import DatePicker from '../../components/common/forms/DatePicker'
import TimePicker from '../../components/common/forms/TimePicker'
import PrimaryButton from '../../components/common/buttons/PrimarySmall'
import PrimaryBigButton from '../../components/common/buttons/PrimaryBig'
import PrimaryBigDisabledButton from '../../components/common/buttons/PrimaryBigDisabled'
import SecondaryButton from '../../components/common/buttons/SecondarySmall'
import ImageUploader from '../../components/common/forms/ImageUploader'
import ConfirmationModal from './ConfirmationModal'

import axios from 'axios'
import { URL, authenticate } from '../../api/config'
import store from '../../redux/store/store'

const getISOTime = (date, time) => {
    const dateOnly = moment(date).format('YYYY-MM-DD')
    const timeOnly = moment(time).format('HH:mm:ss.sssZ')
    return `${dateOnly}T${timeOnly}`
}
export default function home (props) {
    const [isLoaded] = useFonts({
        Lato_400Regular,
        Lato_700Bold
    })
    const dispatch = useDispatch()
    const [isLoading, setIsLoading] = useState(true)
    const [isSubmitLoading, setIsSubmitLoading] = useState(false)
    const [CCAs, setCCAs] = useState([])
    const [event, setEvent] = useState({})
    const [isModalVisible, setIsModalVisible] = useState(false)
    const [hasLapsed, setHasLapsed] = useState(false)
    const [imageURI, setImageURI] = useState(null)
    const [imageUploaded, setImageUploaded] = useState(false)
    const [imageChanged, setImageChanged] = useState(false)
    const [date, setDate] = useState(moment().format(`${'YYYY-MM-DD'}T${'HH:mm:ss.sssZ'}`))
    const [startTime, setStartTime] = useState(moment().format(`${'YYYY-MM-DD'}T${'HH:mm:ss.sssZ'}`))
    const [endTime, setEndTime] = useState(moment().format(`${'YYYY-MM-DD'}T${'HH:mm:ss.sssZ'}`))
    const [showDatePicker, setShowDatePicker] = useState(false)
    const [showStartTimePicker, setShowStartTimePicker] = useState(false)
    const [showEndTimePicker, setShowEndTimePicker] = useState(false)
    const { eventID } = props.route.params
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
        bottomBar: {
            flexDirection: 'column-reverse',
            padding: marginHorizontal
        },
        hyperlink: {
            fontSize: 13,
            fontFamily: 'Lato_400Regular',
            color: MING[5],
            marginBottom: 15
        },
        errorMessage: {
            color: RED[5],
            fontSize: 11,
            fontStyle: 'italic',
            marginBottom: 15,
            marginTop: -10
        },
        
    })
    // REPLACE CCA ID WITH THE REAL ONE
    const audience = [
        {label: 'Public', value: 0},
        ...CCAs
    ]
    const allowedParticipants = [
        {label: 'Public', value: 0},
        ...CCAs
    ]
    const onSubmit = async data => {
        try {
            setIsSubmitLoading(true)
            if (data.visibility == 0) {
                delete data.visibility
            }
            if (data.allowedParticipants == 0) {
                delete data.allowedParticipants
            }
            data.startTime = getISOTime(date, startTime)
            data.endTime = getISOTime(date, endTime)
            delete data.date
            const res = await axios.patch(`${URL}/event/${eventID}/edit`, data, authenticate(store.getState().main.token))
            if (imageURI!=null && imageChanged == true) {
                const formData = new FormData()
                formData.append('image', {
                    uri: imageURI,
                    type: mime.getType(imageURI),
                    name: imageURI.split('/').pop(),
                })
                const eventID = res.data._id
                const res2 = await axios.patch(`${URL}/event/${eventID}/uploadImage`, formData, {headers: {
                    Authorization: `Bearer ${store.getState().main.token}`,
                    'Content-Type': 'multipart/form-data'
                }})
            }
            // Remove existing image
            if (imageURI == null && imageChanged == true) {
                const res3 = await axios.delete(`${URL}/event/${eventID}/deleteImage`, authenticate(store.getState().main.token))
            }
            setIsSubmitLoading(false)
            props.navigation.reset({
                index: 0,
                routes: [{'name': 'ManageCCAScreen'}]
            })
        }
        catch (err) {
            setIsSubmitLoading(false)
            Alert.alert('Changes not saved')
        }
    }
    const defaultValues = {
        eventName: "",
        date: moment().format(`${'YYYY-MM-DD'}T${'HH:mm:ss.sssZ'}`),
        startTime: moment().format(`${'YYYY-MM-DD'}T${'HH:mm:ss.sssZ'}`),
        endTime: moment().format(`${'YYYY-MM-DD'}T${'HH:mm:ss.sssZ'}`),
        venue: "",
        link: "",
        description: "",
        organizer: "",
        visibility: "",
        allowedParticipants: "",
    }
    const { control, handleSubmit, reset, setValue, errors } = useForm({
        defaultValues
    })
    const resetHandler = ()=> {
        reset(defaultValues)
        setValue("allowedParticipants","")
        setValue("organizer","")
        setValue("visibility","")
        setValue("allowedParticipants","")
        setImageURI(null)
        setDate(moment().format(`${'YYYY-MM-DD'}T${'HH:mm:ss.sssZ'}`))
        setStartTime(moment().format(`${'YYYY-MM-DD'}T${'HH:mm:ss.sssZ'}`))
        setEndTime(moment().format(`${'YYYY-MM-DD'}T${'HH:mm:ss.sssZ'}`))
    }
    const pickImageHandler = async () => {
        try {
            let result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.All,
            })
            if (result.cancelled==false) {
                setImageURI(result.uri)
                setImageChanged(true)
            }
        } catch (err) {
            
        }
    }
    const removeImageHandler = () => {
        setImageURI(null)
        setImageChanged(true)
        setImageUploaded(false)
    }
    const viewParticipantHandler = (eventID) => {
        props.navigation.navigate('ViewParticipantScreen', {eventID})
    }
    //Mark as done handlers
    const markAsDoneHandler = () => {
        setIsModalVisible(true)
    }
    const confirmMarkAsDoneHandler = async (eventID) => {
        try {
            const res = await axios.patch(`${URL}/event/${eventID}/markDone`, {}, authenticate(store.getState().main.token))
            if (event.image!=null) {
                const res2 = await axios.delete(`${URL}/event/${eventID}/deleteImage`, authenticate(store.getState().main.token))
            }
            props.navigation.reset({
                index: 0,
                routes: [{'name': 'ManageCCAScreen'}]
            })
        } catch (err) {
            
        }
    }
    const closeModalHandler = () => {
        setIsModalVisible(false)
    }
    useEffect(() => {
        async function loadManagedCCA () {
            try {
                const res = await axios.get(`${URL}/users/managedCCAs`, authenticate(store.getState().main.token))
                const res2 = await axios.get(`${URL}/event/${eventID}/details`, authenticate(store.getState().main.token))
                const ccaArray = res.data.map((CCA) => {
                    return {label: CCA.ccaName, value: CCA._id}
                })
                setCCAs(ccaArray)
                setEvent(res2.data)
                if (res2.data.startTime < moment().format(`${'YYYY-MM-DD'}T${'HH:mm:ss.sssZ'}`)) {
                    setHasLapsed(true)
                }
                setDate(res2.data.startTime)
                setStartTime(res2.data.startTime)
                setEndTime(res2.data.endTime)
                if (!Object.keys(res2.data).includes('image')) {
                    setImageUploaded(true)
                }
                if (res2.data.visibility == null) {
                    res2.data.visibility = 0
                }
                if (res2.data.allowedParticipants == null) {
                    res2.data.allowedParticipants = 0
                }
                reset(res2.data)
                setIsLoading(false)
            } catch (err) {
                Alert.alert('Retrieve CCA failed')
            }
        }
        loadManagedCCA()
    }, [reset])
    return (isLoaded &&
        <TouchableWithoutFeedback onPress={() => {Keyboard.dismiss(); setShowDatePicker(false); setShowStartTimePicker(false); setShowEndTimePicker(false)}}>
            <SafeAreaView style={page.main}>
                {isSubmitLoading && <LoadingOverlay />}
                <SubNavbar title='Edit Event' pressed={onBackPress} />
                <WithLoading loadingMessage='Loading details...' isLoading={isLoading}>
                <ScrollView>
                    <View style={page.main}>
                        <Text style={styles.pageTitle}>Event Details</Text>
                        <View style={styles.card}>
                        <View style={{width: '100%'}}>
                            <Controller
                                control={control}
                                rules={{
                                    required: {
                                        value: true,
                                        message: 'This is a required field.'
                                    },
                                }}
                                render= {({ onChange, value }) => (
                                    <CustomTextInput
                                        label='Event Name*'
                                        onChangeText={text=>{onChange(text)}}
                                        value={value}
                                        type='name'
                                    />
                                  )}
                                  name="eventName"
                                  defaultValue={event.eventName}
                            />
                            {errors.eventName && <Text style={styles.errorMessage}><ErrorMessage errors={errors} name="eventName" /></Text>}
                            <Controller
                                control={control}
                                render= {() => (
                                    <DatePicker
                                        label='Date*'
                                        mode='date'
                                        value={date}
                                        minimumDate={Date.parse(moment().format(`${'YYYY-MM-DD'}T${'HH:mm:ss.sssZ'}`))}
                                        onFocus={()=>setShowDatePicker(true)}
                                        showPicker={showDatePicker}
                                        onChangePicker={(event,itemValue) => {
                                            if (Platform.OS == "android"){ 
                                                setShowDatePicker(!showDatePicker)
                                                Keyboard.dismiss()
                                            }
                                            const val = moment(itemValue).format(`${'YYYY-MM-DD'}T${'HH:mm:ss.sssZ'}`)
                                            console.log(val)           
                                            setDate(val)
                                        }}
                                    />
                                  )}
                                  name="date"
                                  defaultValue={date}
                            />
                            <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
                            <Controller
                                control={control}
                                render= {() => (
                                    <TimePicker
                                        label='Start Time*'
                                        mode='time'
                                        value={startTime}
                                        onFocus={()=>setShowStartTimePicker(true)}
                                        showPicker={showStartTimePicker}
                                        onChangePicker={(event,itemValue) => {
                                            if (Platform.OS == "android"){ 
                                                setShowStartTimePicker(!showStartTimePicker)
                                                Keyboard.dismiss()
                                            }
                                            const val = moment(itemValue).format(`${'YYYY-MM-DD'}T${'HH:mm:ss.sssZ'}`)
                                            console.log(val)
                                            setStartTime(val)
                                            setEndTime(val)           
                                        }}
                                        style={{width: '47%'}}
                                    />
                                  )}
                                  name="startTime"
                                  defaultValue={startTime}
                            />
                        
                            <Controller
                                control={control}
                                rules={{
                                    validate: (value) => {
                                            if (startTime < endTime) return true
                                            return 'Time setting is invalid'
                                    }
                                }}
                                render= {() => (
                                    <TimePicker
                                        label='End Time*'
                                        mode='time'
                                        minimumDate={startTime}
                                        maximumDate={moment(startTime, 'YYYY-MM-DD').add(1,'day').format(`${'YYYY-MM-DD'}T${'HH:mm:ss.sssZ'}`)}
                                        value={endTime}
                                        onFocus={()=>setShowEndTimePicker(true)}
                                        showPicker={showEndTimePicker}
                                        onChangePicker={(event,itemValue) => {
                                            if (Platform.OS == "android"){ 
                                                setShowEndTimePicker(!showEndTimePicker)
                                                Keyboard.dismiss()
                                            }
                                            const val = moment(itemValue).format(`${'YYYY-MM-DD'}T${'HH:mm:ss.sssZ'}`)                
                                            setEndTime(val)
                                        }}
                                        style={{width: '47%'}}
                                    />
                                  )}
                                  name="endTime"
                                  defaultValue={startTime}
                            />
                            </View>
                            {errors.endTime && <Text style={styles.errorMessage}><ErrorMessage errors={errors} name="endTime" /></Text>}
                            <Controller
                                control={control}
                                render= {({ onChange, value }) => (
                                    <CustomTextInput
                                        label='Venue (leave blank if online)'
                                        onChangeText={text=>{onChange(text)}}
                                        value={value}
                                        type='name'
                                    />
                                  )}
                                name="venue"
                                defaultValue={event.venue}
                            />
                            <Controller
                                control={control}
                                render= {({ onChange, value }) => (
                                    <CustomTextInput
                                        label='Link'
                                        onChangeText={text=>{onChange(text)}}
                                        value={value}
                                        type='name'
                                    />
                                  )}
                                name="link"
                                defaultValue={event.link}
                            />
                            <Controller
                                control={control}
                                rules={{
                                    required: {
                                        value: true,
                                        message: 'This is a required field.'
                                    },
                                }}
                                render= {({ onChange, value }) => (
                                    <MultiLineInput
                                        label='Content*'
                                        onChangeText={text=>{onChange(text)}}
                                        value={value}
                                        multiline={true}        
                                        type='name'
                                    />
                                  )}
                                  name="description"
                                  defaultValue={event.description}
                            />
                            {errors.description && <Text style={styles.errorMessage}><ErrorMessage errors={errors} name="description" /></Text>}
                            <Controller
                                control={control}
                                rules={{
                                    required: {
                                        value: true,
                                        message: 'This is a required field.'
                                    },
                                }}
                                render= {({ onChange, value }) => (
                                    <CustomPicker 
                                        items={CCAs} 
                                        label='CCA*'
                                        value={value}
                                        onValueChange={item=>{onChange(item)}}
                                    />
                                  )}
                                  name="organizer"
                                  defaultValue={event.organizer}
                            />
                            {errors.organizer && <Text style={styles.errorMessage}><ErrorMessage errors={errors} name="organizer" /></Text>}
                            <Controller
                                control={control}
                                rules={{
                                    required: {
                                        value: true,
                                        message: 'This is a required field.'
                                    },
                                }}
                                render= {({ onChange, value }) => (
                                    <CustomPicker 
                                        items={audience} 
                                        label='Visibility*'
                                        value={value} 
                                        onValueChange={item=>{onChange(item)}}
                                    />
                                  )}
                                  name="visibility"
                                  defaultValue={event.visibility}
                            />
                            {errors.visibility && <Text style={styles.errorMessage}><ErrorMessage errors={errors} name="visibility" /></Text>}
                            <Controller
                                control={control}
                                rules={{
                                    required: {
                                        value: true,
                                        message: 'This is a required field.'
                                    },
                                }}
                                render= {({ onChange, value }) => (
                                    <CustomPicker 
                                        items={allowedParticipants} 
                                        label='Allowed Participants*'
                                        value={value} 
                                        onValueChange={item=>{onChange(item)}}
                                    />
                                  )}
                                  name="allowedParticipants"
                                  defaultValue={event.allowedParticipants}
                            />
                            {errors.allowedParticipants && <Text style={styles.errorMessage}><ErrorMessage errors={errors} name="allowedParticipants" /></Text>}
                            <TouchableWithoutFeedback onPress={viewParticipantHandler.bind(this, eventID)} >
                                <Text style={styles.hyperlink}>View Participants</Text>
                            </TouchableWithoutFeedback>
                            <ImageUploader label="Upload Image: " pickImageHandler={pickImageHandler} imageURI={imageURI} removeImageHandler={removeImageHandler} uploaded={imageUploaded} />
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
                <View style={styles.bottomBar}>
                    {hasLapsed ? <PrimaryBigButton fontSize={20} text="Mark as Done" pressHandler={markAsDoneHandler.bind(this, eventID)}/>
                    : <PrimaryBigDisabledButton fontSize={20} text="Mark as Done" /> }
                </View>
                </WithLoading>
                <ConfirmationModal isModalVisible={isModalVisible} confirmHandler={confirmMarkAsDoneHandler} closeModal={closeModalHandler} cancelHandler={closeModalHandler} id={eventID} />
            </SafeAreaView>
        </TouchableWithoutFeedback>
        
    )
}