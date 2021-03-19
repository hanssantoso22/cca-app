import React, { useEffect, useState } from 'react'
import * as LocalAuthentication from 'expo-local-authentication'
import * as SecureStore from 'expo-secure-store'
import { PURPLE, MING } from '../../components/common/styles'
import { useFonts, Lato_400Regular, Lato_700Bold } from '@expo-google-fonts/lato'
import { useForm, Controller } from 'react-hook-form'
import PrimaryButton from '../../components/common/buttons/PrimaryBig'
import TextInput from '../../components/common/forms/TextInputNoLabel'
import AppLogo from '../../assets/common/logo.png'
import { StyleSheet, View, Text, TouchableWithoutFeedback, Keyboard, Image, Animated, Alert, Platform } from 'react-native'
import { useDispatch } from 'react-redux'
import { verifyLogin } from '../../redux/reducers/mainSlice'

import FaceIDIcon from '../../assets/common/icons/faceid.png'
import FingerprintIcon from '../../assets/common/icons/fingerprint.png'

export default function Login (props) {
    const [isLoaded] = useFonts ({
        Lato_400Regular,
        Lato_700Bold,
    })
    const [authenticationMethods, setAuthenticationMethods] = useState([])
    const screenOpacity = useState(new Animated.Value(0))[0]
    const fadeInScreen = () => {
        Animated.timing(screenOpacity, {
            toValue: 1,
            duration: 500,
            useNativeDriver: true
        }).start()
    }
    const dispatch = useDispatch()
    const { control, handleSubmit } = useForm()
    const onSubmit = async data => {
        dispatch(verifyLogin(data.email,data.password))
    }
    const createNewAccountHandler = () => {
        props.navigation.navigate('CreateAccount')
    }
    const forgotPasswordHandler = () => {
        props.navigation.navigate('ForgotPassScreen')
    }
    const biometricsLoginHandler = async () => {
        try {
            const email = await SecureStore.getItemAsync('email')
            const password = await SecureStore.getItemAsync('password')
            if (email == null) {
                props.navigation.navigate('BiometricsRegistrationScreen')
                return
            }
            if (authenticationMethods.length > 0) {
                const auth = await LocalAuthentication.authenticateAsync()
                if (auth.error === "not_enrolled") {
                    Alert.alert("No biometrics registered")
                    if (Platform.OS == 'android') await LocalAuthentication.cancelAuthenticate()
                    return
                }
                dispatch(verifyLogin(email,password))
            }
        } catch (err) {
            Alert.alert("Login failed")
        }
    }
    const styles = StyleSheet.create({
        mainContainer: {
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: PURPLE[5],
            height: '100%',
        },
        wrapper: {
            width: '100%',
            paddingHorizontal: 20,
        },
        buttonFont: {
            textTransform: 'uppercase',
            letterSpacing: 5,
        },
        signUpButton: {
            color: MING[2],
            fontSize: 13,
            fontFamily: 'Lato_700Bold',
            letterSpacing: 0,
            marginTop: 20,
            textAlign: 'center',
        },
        forgotPasswordButton: {
            color: MING[2],
            fontSize: 13,
            fontFamily: 'Lato_700Bold',
            textTransform: 'uppercase',
            letterSpacing: 2,
            marginTop: 20,
            textAlign: 'center',
        },
        icon: {
            width: 25,
            height: 25,
            alignSelf: 'flex-end'
        },
        appLogo: {
            width: 90,
            height: 90,
            marginBottom: 30,
        }
    })
    useEffect (() => {
        fadeInScreen()
        async function loadAuthenticationMethods () {
            try {
                const supportedAuthentication = await LocalAuthentication.supportedAuthenticationTypesAsync()
                setAuthenticationMethods(supportedAuthentication)
            } catch (err) {
                
            }
        }
        loadAuthenticationMethods()
    }, [])
    return (isLoaded &&
        <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
            <Animated.View style={{...styles.mainContainer, opacity: screenOpacity}}>
                <Image source={AppLogo} style={styles.appLogo} />
                <View style={styles.wrapper}>
                    <Controller
                        control={control}
                        render={({ onChange, value }) => (
                            <TextInput
                                onChangeText={text=>{onChange(text)}}
                                value={value}
                                type='text'
                                placeHolder='NTU E-mail Address'
                            />
                        )}
                        name="email"
                        defaultValue=""
                    />
                    <Controller
                        control={control}
                        render={({ onChange, value }) => (
                            <TextInput
                                onChangeText={text=>{onChange(text)}}
                                value={value}
                                type='password'
                                placeHolder='Password'
                            />
                        )}
                        name="password"
                        defaultValue=""
                    />
                    <PrimaryButton pressHandler={handleSubmit(onSubmit)} text="Login" fontSize={16} style={{backgroundColor: MING[1], color: MING[6], ...styles.buttonFont}} />
                    {authenticationMethods.length > 0 &&
                        <TouchableWithoutFeedback onPress={biometricsLoginHandler}>
                            <View style={{flexDirection: 'row', justifyContent: 'center', marginTop: 15}}>
                                <Text style={{...styles.forgotPasswordButton, marginTop: 5}}>Login&nbsp;</Text>
                                {authenticationMethods.includes(1) ? 
                                    <Image style={styles.icon} source={FingerprintIcon}/>
                                : <Image style={styles.icon} source={FaceIDIcon}/>}
                            </View>
                        </TouchableWithoutFeedback>
                    }
                    <TouchableWithoutFeedback onPress={forgotPasswordHandler}>
                        <Text style={styles.forgotPasswordButton}>Forgot Password?</Text>
                    </TouchableWithoutFeedback>
                    <View style={{alignItems: 'center'}}>
                    <Text style={{flexDirection: 'row', marginTop: 15}}>
                        <Text style={styles.signUpButton}>Don't have an account?&nbsp;&nbsp;&nbsp;</Text>
                            <TouchableWithoutFeedback onPress={createNewAccountHandler}>
                                <Text style={{...styles.signUpButton, textDecorationLine: 'underline'}}>Sign Up</Text>
                            </TouchableWithoutFeedback>
                        </Text>
                    </View>
                </View>
            </Animated.View>
        </TouchableWithoutFeedback>
    )
}