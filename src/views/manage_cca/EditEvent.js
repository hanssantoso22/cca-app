import React, { useState, useEffect } from 'react'
import * as ImagePicker from 'expo-image-picker'
import FormData from 'form-data'
import mime from 'mime'
import moment from 'moment'
import SubNavbar from '../../components/common/navigation/navbar/SubNavbar'
import { page, GREY, marginHorizontal } from '../../components/common/styles'
import { SafeAreaView, View, Text, StyleSheet, TouchableWithoutFeedback, Keyboard, ScrollView } from 'react-native'
import { useFonts, Lato_700Bold, Lato_400Regular } from '@expo-google-fonts/lato'
import { useForm, Controller } from 'react-hook-form'
import { useSelector, useDispatch } from 'react-redux'
import { changeStartDate, changeEndDate } from '../../redux/reducers/CreateEventSlice'
import CustomTextInput from '../../components/common/forms/TextInput'
import MultiLineInput from '../../components/common/forms/MultiLineInput'
import CustomPicker from '../../components/common/forms/Picker'
import DateTimePicker from '../../components/common/forms/DateTimePicker'
import PrimaryButton from '../../components/common/buttons/PrimarySmall'
import SecondaryButton from '../../components/common/buttons/SecondarySmall'
import ImageUploader from '../../components/common/forms/ImageUploader'

import axios from 'axios'
import { URL, authenticate } from '../../api/config'
import store from '../../redux/store/store'

export default function home (props) {
    const [isLoaded] = useFonts({
        Lato_400Regular,
        Lato_700Bold
    })
    const loaded = isLoaded
    const dispatch = useDispatch()
    const [CCAs, setCCAs] = useState([])
    const [event, setEvent] = useState({})
    const [imageURI, setImageURI] = useState(null)
    const [imageUploaded, setImageUploaded] = useState(false)
    const [imageChanged, setImageChanged] = useState(false)
    const [showStartPicker, setShowStartPicker] = useState(false)
    const [showEndPicker, setShowEndPicker] = useState(false)
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

        
    })
    // REPLACE CCA ID WITH THE REAL ONE
    const audience = [
        {label: 'Public', value: []},
        ...CCAs
    ]
    const allowedParticipants = [
        {label: 'Public', value: []},
        ...CCAs
    ]
    const startDate = useSelector(state => state.createEventSlice.startDate)
    const endDate = useSelector(state => state.createEventSlice.endDate)
    const onSubmit = async data => {
        try {
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
            dispatch(changeStartDate(moment().format(`${'YYYY-MM-DD'}T${'HH:mm:ss.sssZ'}`)))
            dispatch(changeEndDate(moment().format(`${'YYYY-MM-DD'}T${'HH:mm:ss.sssZ'}`)))
            // Remove existing image
            if (imageURI == null && imageChanged == true) {
                const res3 = await axios.delete(`${URL}/event/${eventID}/deleteImage`, authenticate(store.getState().main.token))
            }
            props.navigation.reset({
                index: 0,
                routes: [{'name': 'ManageCCAScreen'}]
            })
        }
        catch (err) {
            console.log(err)
        }
    }
    const defaultValues = {
        eventName: "",
        startTime: startDate,
        endTime: startDate,
        venue: "",
        link: "",
        description: "",
        organizer: "",
        visibility: "",
        allowedParticipants: "",
    }
    const { control, handleSubmit, reset, setValue } = useForm({
        defaultValues
    })
    const resetHandler = ()=> {
        reset(defaultValues)
        setValue("allowedParticipants","")
        setValue("organizer","")
        setValue("visibility","")
        setValue("allowedParticipants","")
        setImageURI(null)
        dispatch(changeStartDate(moment().format(`${'YYYY-MM-DD'}T${'HH:mm:ss.sssZ'}`)))
        dispatch(changeEndDate(moment().format(`${'YYYY-MM-DD'}T${'HH:mm:ss.sssZ'}`)))
    }
    const pickImageHandler = async () => {
        try {
            let result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.All,
                allowsEditing: true,
                maxWidth: 1000,
                maxHeight: 1000,
            })
            if (result.cancelled==false) {
                setImageURI(result.uri)
                setImageChanged(true)
            }
        } catch (err) {
            console.log(err)
        }
    }
    const removeImageHandler = () => {
        setImageURI(null)
        setImageChanged(true)
        setImageUploaded(false)
    }
    useEffect(() => {
        async function loadManagedCCA () {
            try {
                const res = await axios.get(`${URL}/users/managedCCAs`, authenticate(store.getState().main.token))
                const res2 = await axios.get(`${URL}/event/${eventID}/details`, authenticate(store.getState().main.token))
                const ccaArray = res.data.map((CCA) => {
                    return {label: CCA.ccaName, value: [CCA._id]}
                })
                setCCAs(ccaArray)
                setEvent(res2.data)
                dispatch(changeStartDate(res2.data.startTime))
                dispatch(changeEndDate(res2.data.endTime))
                if (!Object.keys(res2.data).includes('image')) {
                    setImageUploaded(true)
                }
                reset(res2.data)
            } catch (err) {
                console.log('Retrieve CCA failed', err)
            }
        }
        loadManagedCCA()
    }, [reset])
    return (
        <TouchableWithoutFeedback onPress={() => {Keyboard.dismiss(); setShowStartPicker(false); setShowEndPicker(false)}}>
            <SafeAreaView style={page.main}>
                <SubNavbar title='Edit Event' pressed={onBackPress} />
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
                                  defaultValue={event.eventName}
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
                                  name="startTime"
                                  defaultValue={event.startTime}
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
                                  name="endTime"
                                  defaultValue={event.endTime}
                            />
                            <Controller
                                control={control}
                                render= {({ onChange, value }) => (
                                    <CustomTextInput
                                        label='Venue'
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
                                  name="description"
                                  defaultValue={event.description}
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
                                  name="organizer"
                                  defaultValue={event.organizer}
                            />
                            <Controller
                                control={control}
                                render= {({ onChange, value }) => (
                                    <CustomPicker 
                                        items={audience} 
                                        label='Visibility'
                                        value={value} 
                                        onValueChange={item=>{onChange(item)}}
                                    />
                                  )}
                                  name="visibility"
                                  defaultValue={event.visibility}
                            />
                            <Controller
                                control={control}
                                render= {({ onChange, value }) => (
                                    <CustomPicker 
                                        items={allowedParticipants} 
                                        label='Allowed Participants'
                                        value={value} 
                                        onValueChange={item=>{onChange(item)}}
                                    />
                                  )}
                                  name="allowedParticipants"
                                  defaultValue={event.allowedParticipants}
                            />
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
            </SafeAreaView>
        </TouchableWithoutFeedback>
        
    )
}