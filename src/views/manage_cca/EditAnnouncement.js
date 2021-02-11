import React, { useEffect, useState } from 'react'
import * as ImagePicker from 'expo-image-picker'
import FormData from 'form-data'
import mime from 'mime'
import SubNavbar from '../../components/common/navigation/navbar/SubNavbar'
import WithLoading from '../../components/hoc/withLoading'
import { page, GREY, RED, marginHorizontal } from '../../components/common/styles'
import { SafeAreaView, ScrollView, View, Text, StyleSheet, TouchableWithoutFeedback, Keyboard, Alert } from 'react-native'
import { useFonts, Lato_700Bold, Lato_400Regular } from '@expo-google-fonts/lato'
import { useForm, Controller } from 'react-hook-form'
import { ErrorMessage } from '@hookform/error-message'
import CustomTextInput from '../../components/common/forms/TextInput'
import MultiLineInput from '../../components/common/forms/MultiLineInput'
import CustomPicker from '../../components/common/forms/Picker'
import PrimaryButton from '../../components/common/buttons/PrimarySmall'
import PrimaryBigButton from '../../components/common/buttons/PrimaryBig'
import SecondaryButton from '../../components/common/buttons/SecondarySmall'
import ImageUploader from '../../components/common/forms/ImageUploader'
import ConfirmationModal from './ConfirmationModal'

import axios from 'axios'
import { URL, authenticate } from '../../api/config'
import store from '../../redux/store/store'

export default function CreateAnnouncement (props) {
    const [isLoaded] = useFonts({
        Lato_400Regular,
        Lato_700Bold
    })
    const loaded = isLoaded
    const [isLoading, setIsLoading] = useState(true)
    const [isModalVisible, setIsModalVisible] = useState(false)
    const [imageURI, setImageURI] = useState(null)
    const [imageUploaded, setImageUploaded] = useState(false)
    const [imageChanged, setImageChanged] = useState(false)
    const [announcement, setAnnouncement] = useState({})
    const [CCAs, setCCAs] = useState([])
    const { announcementID } = props.route.params
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
        errorMessage: {
            color: RED[5],
            fontSize: 11,
            fontStyle: 'italic',
            marginBottom: 15,
            marginTop: -10
        },
    })
    //CHANGE CCA ID BELOW WITH THE REAL ONE
    const visibility = [
        {label: 'Public', value: 0},
        ...CCAs
    ]
    const { control, handleSubmit, reset, setValue, errors } = useForm({ announcement })
    const onSubmit = async data => {
        try {
            if (data.visibility == 0) {
                delete data.visibility
            }
            const res = await axios.patch(`${URL}/announcement/${announcementID}/edit`, data, authenticate(store.getState().main.token))
            //Upload new image
            if (imageURI!=null && imageChanged == true) {
                const formData = new FormData()
                formData.append('image', {
                    uri: imageURI,
                    type: mime.getType(imageURI),
                    name: imageURI.split('/').pop(),
                })
                const res2 = await axios.patch(`${URL}/announcement/${announcementID}/uploadImage`, formData, {headers: {
                    Authorization: `Bearer ${store.getState().main.token}`,
                    'Content-Type': 'multipart/form-data'
                }})
            }
            // Remove existing image
            if (imageURI == null && imageChanged == true) {
                const res3 = await axios.delete(`${URL}/announcement/${announcementID}/deleteImage`, authenticate(store.getState().main.token))
            }
            props.navigation.reset({
                index: 0,
                routes: [{'name': 'ManageCCAScreen'}]
            })
        }
        catch (err) {
            Alert.alert('Changes not saved')
        }
    }
    const defaultValues = {
        announcementTitle: '', 
        content: '', 
        organizer: '', 
        visibility: ''
    }
    const resetHandler = ()=> {
        reset(defaultValues)
        setValue("organizer","")
        setValue("visibility","")
        setImageURI(null)
        setImageUploaded(false)
        console.log('reset')
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
    //Mark as done handlers
    const markAsDoneHandler = () => {
        setIsModalVisible(true)
    }
    const confirmMarkAsDoneHandler = async (announcementID) => {
        try {
            const res = await axios.patch(`${URL}/announcement/${announcementID}/markDone`, {}, authenticate(store.getState().main.token))
            if (announcement.image!=null) {
                const res2 = await axios.delete(`${URL}/announcement/${announcementID}/deleteImage`, authenticate(store.getState().main.token))
            }
            props.navigation.reset({
                index: 0,
                routes: [{'name': 'ManageCCAScreen'}]
            })
        } catch (err) {
            Alert.alert('Changes not saved')
        }
    }
    const closeModalHandler = () => {
        setIsModalVisible(false)
    }
    useEffect(() => {
        async function loadManagedCCA () {
            try {
                const res = await axios.get(`${URL}/users/managedCCAs`, authenticate(store.getState().main.token))
                const res2 = await axios.get(`${URL}/announcement/${announcementID}/details`, authenticate(store.getState().main.token))
                const ccaArray = res.data.map((CCA) => {
                    return {label: CCA.ccaName, value: CCA._id}
                })
                setCCAs(ccaArray)
                setAnnouncement(res2.data)
                if (!Object.keys(res2.data).includes('image')) {
                    setImageUploaded(true)
                }
                if (res2.data.visibility == null) {
                    res2.data.visibility = 0
                }
                reset(res2.data)
                setIsLoading(false)
            } catch (err) {
                console.log('Retrieve CCA failed', err)
            }
        }
        loadManagedCCA()
    }, [reset])
    return (
        <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
            <SafeAreaView style={page.main}>
                <SubNavbar title='Edit Announcement' pressed={onBackPress} />
                <WithLoading loadingMessage='Loading details...' isLoading={isLoading}>
                <ScrollView>
                <View style={page.main}>
                    <Text style={styles.pageTitle}>Announcement Details</Text>
                    <View style={styles.card}>
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
                                    label='Announcement Title*'
                                    onChangeText={text=>{onChange(text)}}
                                    value={value}
                                    maxLength={40}
                                    type='name'
                                />
                            )}
                            name="announcementTitle"
                            defaultValue={announcement.announcementTitle}
                        />
                        {errors.announcementTitle && <Text style={styles.errorMessage}><ErrorMessage errors={errors} name="announcementTitle" /></Text>}
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
                            defaultValue={announcement.organizer}
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
                                <MultiLineInput
                                    label='Content*'
                                    onChangeText={text=>{onChange(text)}}
                                    value={value}
                                    multiline={true}
                                    maxLength={500}
                                    type='name'
                                />
                            )}
                            name="content"
                            defaultValue={announcement.content}
                        />
                        {errors.content && <Text style={styles.errorMessage}><ErrorMessage errors={errors} name="content" /></Text>}
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
                                    items={visibility} 
                                    label='Visibility*'
                                    value={value} 
                                    onValueChange={item=>{onChange(item)}}
                                />
                            )}
                            name="visibility"
                            defaultValue={announcement.visibility}
                        />
                        {errors.visibility && <Text style={styles.errorMessage}><ErrorMessage errors={errors} name="visibility" /></Text>}
                        <ImageUploader label="Upload Image: " pickImageHandler={pickImageHandler} imageURI={imageURI} removeImageHandler={removeImageHandler} uploaded={imageUploaded}/>
                        <View style={{flexDirection: 'row', width: '100%'}}>
                            <View style={{paddingRight: 10, flex: 1}}>
                                <SecondaryButton fontSize={16} text="Clear Input" pressHandler={resetHandler}/>
                            </View>
                            <View style={{paddingLeft: 10, flex: 1}}>
                                <PrimaryButton fontSize={16} text="Save Changes" pressHandler={handleSubmit(onSubmit)}/>
                            </View>
                        </View>
                    </View>
                </View>
                </ScrollView>
                <View style={styles.bottomBar}>
                    <PrimaryBigButton fontSize={20} text="Mark as Obsolete" pressHandler={markAsDoneHandler.bind(this, announcementID)}/>
                </View>
                </WithLoading>
                <ConfirmationModal isModalVisible={isModalVisible} confirmHandler={confirmMarkAsDoneHandler} closeModal={closeModalHandler} cancelHandler={closeModalHandler} id={announcementID} />
            </SafeAreaView>
        </TouchableWithoutFeedback>
        
    )
}