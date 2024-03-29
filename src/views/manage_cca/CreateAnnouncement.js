import React, { useEffect, useState } from 'react'
import * as ImagePicker from 'expo-image-picker'
import FormData from 'form-data'
import mime from 'mime'
import SubNavbar from '../../components/common/navigation/navbar/SubNavbar'
import { page, GREY, marginHorizontal, RED } from '../../components/common/styles'
import { SafeAreaView, ScrollView, View, Text, StyleSheet, TouchableWithoutFeedback, Keyboard, Alert } from 'react-native'
import { useFonts, Lato_700Bold, Lato_400Regular } from '@expo-google-fonts/lato'
import { useForm, Controller } from 'react-hook-form'
import { ErrorMessage } from '@hookform/error-message'
import LoadingOverlay from '../../components/common/LoadingOverlay'
import CustomTextInput from '../../components/common/forms/TextInput'
import MultiLineInput from '../../components/common/forms/MultiLineInput'
import CustomPicker from '../../components/common/forms/Picker'
import PrimaryButton from '../../components/common/buttons/PrimarySmall'
import SecondaryButton from '../../components/common/buttons/SecondarySmall'
import ImageUploader from '../../components/common/forms/ImageUploader'

import axios from 'axios'
import { URL, authenticate } from '../../api/config'
import store from '../../redux/store/store'

export default function CreateAnnouncement (props) {
    const [isLoaded] = useFonts({
        Lato_400Regular,
        Lato_700Bold
    })
    const [imageURI, setImageURI] = useState(null)
    const [CCAs, setCCAs] = useState([])
    const [isSubmitLoading, setIsSubmitLoading] = useState(false)
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
        errorMessage: {
            color: RED[5],
            fontSize: 11,
            fontStyle: 'italic',
            marginBottom: 15,
            marginTop: -10
        },
    })
    const visibility = [
        {label: 'Public', value: 0},
        ...CCAs
    ]
    const defaultValues = {
        announcementTitle: '', 
        content: '', 
        organizer: '', 
        visibility: ''
    }
    const { control, handleSubmit, reset, setValue, errors } = useForm({ defaultValues })
    const onSubmit = async data => {
        try {
            setIsSubmitLoading(true)
            if (data.visibility == 0) {
                delete data.visibility
            }
            const res = await axios.post(`${URL}/announcements/create`, data, authenticate(store.getState().main.token))
            if (imageURI!=null) {
                const formData = new FormData()
                formData.append('image', {
                    uri: imageURI,
                    type: mime.getType(imageURI),
                    name: imageURI.split('/').pop(),
                })
                const announcementID = res.data._id
                const res2 = await axios.patch(`${URL}/announcement/${announcementID}/uploadImage`, formData, {headers: {
                    Authorization: `Bearer ${store.getState().main.token}`,
                    'Content-Type': 'multipart/form-data'
                }})
            }
            setIsSubmitLoading(false)
            props.navigation.reset({
                index: 0,
                routes: [{'name': 'ManageCCAScreen'}]
            })
        }
        catch (err) {
            setIsSubmitLoading(false)
            Alert.alert('Announcement is not created')
        }
    }
    const resetHandler = ()=> {
        reset(defaultValues)
        setValue("organizer","")
        setValue("visibility","")
        setImageURI(null)
    }
    const pickImageHandler = async () => {
        try {
            let result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.All,
            })
            if (result.cancelled==false) {
                setImageURI(result.uri)
            }
        } catch (err) {
            
        }
    }
    useEffect(() => {
        async function loadManagedCCA () {
            try {
                const res = await axios.get(`${URL}/users/managedCCAs`, authenticate(store.getState().main.token))
                const ccaArray = res.data.map((CCA) => {
                    return {label: CCA.ccaName, value: CCA._id}
                })
                setCCAs(ccaArray)
            } catch (err) {
                Alert.alert('Retrieving CCA failed')
            }
        }
        loadManagedCCA()
    }, [])
    return (isLoaded &&
        <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
            <SafeAreaView style={page.main}>
                {isSubmitLoading && <LoadingOverlay />}
                <SubNavbar title='Create Announcement' pressed={onBackPress} />
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
                                    type='name'
                                />
                            )}
                            name="announcementTitle"
                            defaultValue=""
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
                            defaultValue=""
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
                                    type='name'
                                />
                            )}
                            name="content"
                            defaultValue=""
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
                            defaultValue=""
                        />
                        {errors.visibility && <Text style={styles.errorMessage}><ErrorMessage errors={errors} name="visibility" /></Text>}
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
                </ScrollView>
            </SafeAreaView>
        </TouchableWithoutFeedback>
        
    )
}