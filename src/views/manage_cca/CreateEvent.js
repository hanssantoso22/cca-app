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
    const [imageURI, setImageURI] = useState(null)
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
    const audience = [
        {label: 'Public', value: 0},
        ...CCAs
    ]
    const allowedParticipants = [
        {label: 'Public', value: 0},
        ...CCAs
    ]

    const defaultValues = {
        eventName: "",
        startTime: moment().format(`${'YYYY-MM-DD'}T${'HH:mm:ss.sssZ'}`),
        endTime: moment().format(`${'YYYY-MM-DD'}T${'HH:mm:ss.sssZ'}`),
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
    const onSubmit = async data => {
        try {
            if (data.visibility == 0) {
                delete data.visibility
            }
            if (data.allowedParticipants == 0) {
                delete data.allowedParticipants
            }
            data.startTime = store.getState().createEvent.startDate
            data.endTime = store.getState().createEvent.endDate
            const res = await axios.post(`${URL}/events/create`, data, authenticate(store.getState().main.token))
            if (imageURI!=null) {
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
            props.navigation.reset({
                index: 0,
                routes: [{'name': 'ManageCCAScreen'}]
            })
        }
        catch (err) {
            console.log(err)
        }
    }
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
            }
        } catch (err) {
            console.log(err)
        }
    }
    useEffect(() => {
        async function loadManagedCCA () {
            try {
                dispatch(changeStartDate(moment().format(`${'YYYY-MM-DD'}T${'HH:mm:ss.sssZ'}`)))
                dispatch(changeEndDate(moment().format(`${'YYYY-MM-DD'}T${'HH:mm:ss.sssZ'}`)))
                const res = await axios.get(`${URL}/users/managedCCAs`, authenticate(store.getState().main.token))
                const ccaArray = res.data.map((CCA) => {
                    return {label: CCA.ccaName, value: CCA._id}
                })
                setCCAs(ccaArray)
            } catch (err) {
                console.log('Retrieve CCA failed', err)
            }
        }
        loadManagedCCA()
    }, [])
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
                                  defaultValue=""
                            />
                            <Controller
                                control={control}
                                render= {() => (
                                    <DateTimePicker
                                        label='Start Time'
                                        mode='datetime'
                                        value={store.getState().createEvent.startDate}
                                        onFocus={()=>setShowStartPicker(true)}
                                        showPicker={showStartPicker}
                                        onChangePicker={(event,itemValue) => {
                                            const val = moment(itemValue).format(`${'YYYY-MM-DD'}T${'HH:mm:ss.sssZ'}`)                
                                            dispatch(changeStartDate(val))
                                            dispatch(changeEndDate(val))
                                        }}
                                    />
                                  )}
                                  name="startTime"
                                  defaultValue={store.getState().createEvent.startDate}
                            />
                            <Controller
                                control={control}
                                render= {() => (
                                    <DateTimePicker
                                        label='End Time'
                                        mode='datetime'
                                        minimumDate={store.getState().createEvent.startDate}
                                        maximumDate={moment(store.getState().createEvent.startDate, 'YYYY-MM-DD').add(1,'day').format(`${'YYYY-MM-DD'}T${'HH:mm:ss.sssZ'}`)}
                                        value={store.getState().createEvent.endDate}
                                        onFocus={()=>setShowEndPicker(true)}
                                        showPicker={showEndPicker}
                                        onChangePicker={(event,itemValue) => {
                                            const val = moment(itemValue).format(`${'YYYY-MM-DD'}T${'HH:mm:ss.sssZ'}`)                
                                            dispatch(changeEndDate(val))
                                        }}
                                    />
                                  )}
                                  name="endTime"
                                  defaultValue={store.getState().createEvent.startDate}
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
                                defaultValue=""
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
                                defaultValue=""
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
                                  defaultValue=""
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
                                  defaultValue=""
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
                                  defaultValue=""
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
                                  defaultValue=""
                            />
                            <ImageUploader label="Upload Image: " pickImageHandler={pickImageHandler} imageURI={imageURI} removeImageHandler={()=>setImageURI(null)} />
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