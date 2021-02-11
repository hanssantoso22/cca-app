import React, { useState, useEffect, useCallback } from 'react'
import { ScrollView, RefreshControl, View, Text, StyleSheet, SafeAreaView, TouchableWithoutFeedback } from 'react-native'
import * as ImagePicker from 'expo-image-picker'
import FormData from 'form-data'
import mime from 'mime'
import { Avatar } from 'react-native-elements'
import { useFonts, Lato_700Bold, Lato_400Regular } from '@expo-google-fonts/lato'
import { page, marginHorizontal, GREY, MING, RED } from '../../components/common/styles'
import SubNavbar from '../../components/common/navigation/navbar/SubNavbar'
import WithLoading from '../../components/hoc/withLoading'
import { useForm, Controller } from 'react-hook-form'
import CustomTextInput from '../../components/common/forms/TextInput'
import CustomPicker from '../../components/common/forms/Picker'
import PrimaryButton from '../../components/common/buttons/PrimarySmall'
import SecondaryButton from '../../components/common/buttons/SecondarySmall'
import RemoveAvatarModal from './RemoveAvatarModal'

import axios from 'axios'
import {URL, authenticate} from '../../api/config'
import { useDispatch } from 'react-redux'
import { logout, navigateToPage } from '../../redux/reducers/mainSlice'
import store from '../../redux/store/store'

export default function ProfilePage (props) {
    const [isLoaded] = useFonts({Lato_700Bold, Lato_400Regular})
    const loaded = isLoaded
    const dispatch = useDispatch()
    const [isLoading, setIsLoading] = useState(true)
    const [isChangingPassword, setIsChangingPassword] = useState(false)
    const [showRemoveAvatarModal, setShowRemoveAvatarModal] = useState(false)
    const [isPhotoChanged, setIsPhotoChanged] = useState(false)
    const [user, setUser] = useState('')
    const [refreshing, setRefreshing] = useState(false);

    const styles = StyleSheet.create({
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
        nameContainer: {
            alignItems: 'center',
            marginBottom: 15,
        },
        userName: {
            fontFamily: 'Lato_700Bold',
            fontSize: 20,
            color: GREY[5],
            textAlign: 'center',
            lineHeight: 30,
        },
        email: {
            fontFamily: 'Lato_400Regular',
            fontSize: 16,
            color: GREY[3],
            textAlign: 'center',
            lineHeight: 30,
        },
        hyperlink: {
            fontSize: 13,
            fontFamily: 'Lato_400Regular',
            color: MING[5],
            marginBottom: 15
        },
        redHyperlink: {
            fontSize: 13,
            fontFamily: 'Lato_400Regular',
            color: RED[5],
            marginBottom: 15
        },
        bottomContainer: {
            flexDirection: 'column-reverse',
            paddingHorizontal: 15,
        },
        fieldName: {
            fontFamily: 'Lato_400Regular',
            fontSize: 13,
            color: GREY[3],
            lineHeight: 20,
        },
        value: {
            fontFamily: 'Lato_400Regular',
            fontSize: 16,
            color: GREY[5],
            marginTop: 5,
            marginBottom: 15,
            lineHeight: 25,
        },
    })
    const wait = (timeout) => {
        return new Promise(resolve => {
          setTimeout(resolve, timeout);
        });
    }
    const navigateToScreen  = (navScreen) => {
        if (navScreen=='LogoutScreen') {
            dispatch (logout())
            return 0
        }
        props.navigation.navigate(navScreen)
        if (navScreen != 'ProfileScreen') {
            dispatch (navigateToPage(navScreen))
        }
        
    }
    const onBackPress = () => {
        navigateToScreen('HomeScreen')
    }
    // const user = {id: 0, fname: 'Laurensius Hans Santoso 1', year:'4', faculty: 'EEE', email: 'dummy1@e.ntu.edu.sg', role: 'student', managedCCAs: ['EEE Club','MLDA @EEE'], joinedCCAs: []}
    const years = [
        {label: 'Year 1', value: '1'},
        {label: 'Year 2', value: '2'},
        {label: 'Year 3', value: '3'},
        {label: 'Year 4', value: '4'}
    ]
    const { control, handleSubmit, reset } = useForm({ defaultValues: {
        year: '',
    }})
    //Remove Avatar Handler
    const removePhotoHandler = () => {
        setShowRemoveAvatarModal(true)
    }
    const closeRemoveAvatarModal = () => {
        setShowRemoveAvatarModal(false)
    }
    const confirmRemoveAvatarHandler = () => {
        async function removePhoto () {
            try {
                const res = await axios.patch(`${URL}/users/profile/removeAvatar`, {}, authenticate(store.getState().main.token))
            } catch (err) {
                console.log(err)
            }
        }
        removePhoto()
        setIsPhotoChanged(!isPhotoChanged)
        setShowRemoveAvatarModal(false)
    }
    const pickImageHandler = () => {
        async function pickImage () {
            try {
                const formData = new FormData()
                let result = await ImagePicker.launchImageLibraryAsync({
                    mediaTypes: ImagePicker.MediaTypeOptions.All,
                    allowsEditing: true,
                    aspect: [1, 1],
                    quality: 0.3,
                })
                if (result.cancelled==false) {
                    formData.append('avatar', {
                        uri: result.uri,
                        type: mime.getType(result.uri),
                        name: result.uri.split('/').pop()
                    })
                    const res = await axios.patch(`${URL}/users/profile/changeAvatar`, formData, {headers: {
                        Authorization: `Bearer ${store.getState().main.token}`,
                        'Content-Type': 'multipart/form-data'
                    }})
                    setIsPhotoChanged(!isPhotoChanged)
                }
            } catch (err) {
                console.log(err)
            }
        }
        pickImage()
    }
    const onSubmit = data => {
        async function submitData () {
            try {
                //NEED TO VALIDATE PASSWORD AND CONFIRM PASSWORD ARE THE SAME
                if (data.password == '' ) {
                    delete data.password
                    delete data.confirmPassword
                }
                if (data.password && data.password!='') delete data.confirmPassword
                const res = await axios.patch(`${URL}/users/profile/edit`, data, authenticate(store.getState().main.token))
                if (data.password && data.password!='') {
                    navigateToScreen('LogoutScreen')
                } else {
                    navigateToScreen('HomeScreen')
                }
            } catch (err) {
                console.log(err)
            }
        }
        submitData()
    }
    const onRefresh = useCallback(async () => {
        try {
            const res = await axios.get(`${URL}/users/profile`, authenticate(store.getState().main.token))
            delete res.data.password
            setUser(res.data)
            reset(res.data)
        } catch (err) {
            console.log(err)
        }
        setRefreshing(true);
        wait(500).then(() => setRefreshing(false));
      }, [refreshing])
    useEffect(()=>{
        async function loadUser () {
            try {
                const res = await axios.get(`${URL}/users/profile`, authenticate(store.getState().main.token))
                delete res.data.password
                setUser(res.data)
                reset(res.data)
                setIsLoading(false)
            } catch (err) {
                console.log(err)
            }
        }
        loadUser()
        setIsPhotoChanged(false)
    },[reset, isPhotoChanged])
    return (
        <SafeAreaView style={page.main}>
            <SubNavbar title={user.fname} pressed={onBackPress} />
            <WithLoading loadingMessage='Loading details...' isLoading={isLoading}>
            <ScrollView refreshControl={
                <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                }
            >
                <View style={page.main}>
                    <View style={styles.nameContainer}>
                        <Avatar 
                            rounded 
                            size={110} 
                            containerStyle={{marginBottom: 20}} 
                            icon={user.avatar == null ? {name: 'user-circle-o', type:'font-awesome', color: GREY[2], size: 90} : null}
                            source={user.avatar != null ? {
                                uri: user.avatar
                            } : null}
                        >
                            <TouchableWithoutFeedback onPress={pickImageHandler}>
                                <Avatar.Accessory size={20} icon={{name: 'edit', type:'material-icons', color: GREY[2]}} />
                            </TouchableWithoutFeedback>
                        </Avatar>
                        {user.avatar!=null && 
                        <TouchableWithoutFeedback onPress={removePhotoHandler}>
                            <Text style={styles.redHyperlink}>Remove Photo</Text>
                        </TouchableWithoutFeedback>
                        }
                        <Text style={styles.userName}>{user.fname}</Text>
                        <Text style={styles.email}>{user.email}</Text>
                        <Text style={styles.email}>{user.faculty}</Text>
                    </View>
                    <View style={styles.card}>
                    <View style={{width: '100%'}}>
                        <Controller
                            control={control}
                            render= {({ onChange, value }) => (
                                <CustomPicker 
                                    items={years} 
                                    label='Academic Year'
                                    value={value}
                                    onValueChange={item=>{onChange(item)}}
                                />
                                )}
                            name="year"
                            defaultValue={user.year}
                        />
                        {user.joinedCCAs && user.joinedCCAs.length > 0 && (
                            <>
                            <Text style={styles.fieldName}>Joined CCAs: </Text>
                            <Text style={styles.value}>{user.joinedCCAs.join(', ')}</Text>
                            </>
                        )}
                        {user.managedCCAs && user.managedCCAs.length > 0 && (
                            <> 
                            <Text style={styles.fieldName}>Managed CCAs: </Text>
                            <Text style={styles.value}>{user.managedCCAs.join(', ')}</Text>
                            </>
                        )}
                        <Text onPress={()=>setIsChangingPassword(!isChangingPassword)} style={styles.hyperlink}>Change Password</Text>
                        {isChangingPassword && (
                            <>
                            <Controller
                                control={control}
                                render= {({ onChange, value }) => (
                                    <CustomTextInput
                                        label='New Password'
                                        onChangeText={text=>{onChange(text)}}
                                        value={value}
                                        maxLength={40}
                                        type='password'
                                    />
                                )}
                                name="password"
                                defaultValue=""
                            />
                            <Controller
                                control={control}
                                render= {({ onChange, value }) => (
                                    <CustomTextInput
                                        label='Confirm New Password'
                                        onChangeText={text=>{onChange(text)}}
                                        value={value}
                                        maxLength={40}
                                        type='password'
                                    />
                                )}
                                name="confirmPassword"
                                defaultValue=""
                            />
                            </>
                        )}
                        <View style={{flexDirection: 'row', width: '100%'}}>
                            <View style={{paddingRight: 10, flex: 1}}>
                                <SecondaryButton fontSize={13} text="Discard" pressHandler={onBackPress}/>
                            </View>
                            <View style={{paddingLeft: 10, flex: 1}}>
                                <PrimaryButton fontSize={13} text="Save Changes" pressHandler={handleSubmit(onSubmit)}/>
                            </View>
                        </View>
                    </View>
                    </View>
                </View>
            </ScrollView>
            </WithLoading>
            <RemoveAvatarModal isModalVisible={showRemoveAvatarModal} closeModal={closeRemoveAvatarModal} confirmHandler={confirmRemoveAvatarHandler} cancelHandler={closeRemoveAvatarModal} />
        </SafeAreaView>
    )
}