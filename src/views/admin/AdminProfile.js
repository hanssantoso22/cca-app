import React, { useState, useEffect, useCallback } from 'react'
import { ScrollView, View, Text, StyleSheet, SafeAreaView, Alert } from 'react-native'
import * as SecureStore from 'expo-secure-store'
import { Avatar } from 'react-native-elements'
import { useFonts, Lato_700Bold, Lato_400Regular } from '@expo-google-fonts/lato'
import { page, marginHorizontal, GREY, MING, RED } from '../../components/common/styles'
import SubNavbar from '../../components/common/navigation/navbar/SubNavbar'
import WithLoading from '../../components/hoc/withLoading'
import { useForm, Controller } from 'react-hook-form'
import { ErrorMessage } from '@hookform/error-message'
import CustomTextInput from '../../components/common/forms/TextInput'
import PrimaryButton from '../../components/common/buttons/PrimarySmall'
import SecondaryButton from '../../components/common/buttons/SecondarySmall'
import RemoveBiometricsModal from './RemoveBiometricsModal'
import LogoutAllDevicesModal from './LogoutAllDevicesModal'

import axios from 'axios'
import {URL, authenticate} from '../../api/config'
import { useDispatch } from 'react-redux'
import { logout } from '../../redux/reducers/mainSlice'
import store from '../../redux/store/store'

export default function ProfilePage (props) {
    const [isLoaded] = useFonts({Lato_700Bold, Lato_400Regular})
    const dispatch = useDispatch()
    const [isLoading, setIsLoading] = useState(true)
    const [isChangingPassword, setIsChangingPassword] = useState(false)
    const [showRemoveBiometricsModal, setShowRemoveBiometricsModal] = useState(false)
    const [showLogoutAllModal, setShowLogoutAllModal] = useState(false)
    const [user, setUser] = useState('')

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
        errorMessage: {
            color: RED[5],
            fontSize: 11,
            fontStyle: 'italic',
            marginBottom: 15,
            marginTop: -10
        }
    })
    const navigateToScreen  = (navScreen) => {
        if (navScreen=='LogoutScreen') {
            dispatch (logout(store.getState().main.token))
            return 0
        }
        props.navigation.navigate(navScreen)
    }
    const onBackPress = () => {
        navigateToScreen('AdminManageUserScreen')
    }
    const { control, handleSubmit, reset, errors, getValues } = useForm()
    //Remove biometrics authentication handlers
    const removeBiometricsHandler = () => {
        setShowRemoveBiometricsModal(true)
    }
    const closeRemoveBiometricsModal = () => {
        setShowRemoveBiometricsModal(false)
    }
    const confirmRemoveBiometricsHandler = async () => {
        try {
            const email = await SecureStore.getItemAsync('email')
            if (email !== null) {
                await SecureStore.deleteItemAsync('email')
                await SecureStore.deleteItemAsync('password')
            }
            setShowRemoveBiometricsModal(false)
        } catch (err) {
            Alert.alert('Removing biometrics authentication failed')
        }
    }
    //Remove biometrics authentication handlers
    const logoutAllHandler = () => {
        setShowLogoutAllModal(true)
    }
    const closeLogoutAllModal = () => {
        setShowLogoutAllModal(false)
    }
    const confirmLogoutAllHandler = async () => {
        try {
            const token = store.getState().main.token
            const res = await axios.post(`${URL}/users/logout/all`, {}, authenticate(token))
            dispatch (logout(store.getState().main.token))
        } catch (err) {
            
        }
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
                    //Update password in keychain
                    const storedEmail = await SecureStore.getItemAsync('email')
                    if (storedEmail != null) await SecureStore.setItemAsync('password', data.password)
                } else {
                    navigateToScreen('AdminManageUserScreen')
                }
            } catch (err) {
                Alert.alert('Updating profile failed')
            }
        }
        submitData()
    }
    useEffect(()=>{
        async function loadUser () {
            try {
                const res = await axios.get(`${URL}/users/profile`, authenticate(store.getState().main.token))
                delete res.data.password
                setUser(res.data)
                setIsLoading(false)
            } catch (err) {
                Alert.alert('Loading user failed')
            }
        }
        loadUser()
    },[reset])
    return (isLoaded &&
        <SafeAreaView style={page.main}>
            <SubNavbar title={user.fname} pressed={onBackPress} />
            <WithLoading loadingMessage='Loading details...' isLoading={isLoading}>
            <ScrollView>
                <View style={page.main}>
                    <View style={styles.nameContainer}>
                        <Avatar 
                            rounded 
                            size={110} 
                            containerStyle={{marginBottom: 20}} 
                            icon={{name: 'user-circle-o', type:'font-awesome', color: GREY[2], size: 90}}
                        >
                        </Avatar>
                        <Text style={styles.userName}>{user.fname}</Text>
                        <Text style={styles.email}>{user.email}</Text>
                    </View>
                    <View style={styles.card}>
                    <View style={{width: '100%'}}>
                        <Text onPress={()=>setIsChangingPassword(!isChangingPassword)} style={styles.hyperlink}>Change Password</Text>
                        {isChangingPassword && (
                            <>
                            <Controller
                                control={control}
                                rules = {{
                                    pattern: {
                                        value: /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/,
                                        message: 'Password must contain at least 8 characters, a number, and a unique character.'
                                    },
                                    required: {
                                        value: true,
                                        message: 'This is a required field.'
                                    }
                                }}
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
                            {errors.password && <Text style={styles.errorMessage}><ErrorMessage errors={errors} name="password" /></Text>}
                            <Controller
                                control={control}
                                rules={{
                                    required: {
                                        value: true,
                                        message: 'This is a required field.'
                                    },
                                    validate: (value) => value === getValues('password') || 'Password doesn\'t match.',
                                }}
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
                            {errors.confirmPassword && <Text style={styles.errorMessage}><ErrorMessage errors={errors} name="confirmPassword" /></Text>}
                            </>
                        )}
                        <Text onPress={removeBiometricsHandler} style={styles.redHyperlink}>Remove biometrics authentication</Text>
                        <Text onPress={logoutAllHandler} style={styles.hyperlink}>Logout all devices</Text>
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
            <RemoveBiometricsModal isModalVisible={showRemoveBiometricsModal} closeModal={closeRemoveBiometricsModal} confirmHandler={confirmRemoveBiometricsHandler} cancelHandler={closeRemoveBiometricsModal} />
            <LogoutAllDevicesModal isModalVisible={showLogoutAllModal} closeModal={closeLogoutAllModal} confirmHandler={confirmLogoutAllHandler} cancelHandler={closeLogoutAllModal} />
        </SafeAreaView>
    )
}