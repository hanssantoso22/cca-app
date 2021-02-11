import React, { useEffect } from 'react'
import { PURPLE, MING } from '../../components/common/styles'
import { useFonts, Lato_400Regular, Lato_700Bold } from '@expo-google-fonts/lato'
import { useForm, Controller } from 'react-hook-form'
import PrimaryButton from '../../components/common/buttons/PrimaryBig'
import TextInput from '../../components/common/forms/TextInputNoLabel'
import { SafeAreaView, StyleSheet, View, Text, TouchableWithoutFeedback, Keyboard, Alert } from 'react-native'
import { useDispatch } from 'react-redux'
import { verifyLogin, login } from '../../redux/reducers/mainSlice'

export default function Login (props) {
    const [isLoaded] = useFonts ({
        Lato_400Regular,
        Lato_700Bold
    })
    const loaded = isLoaded
    const dispatch = useDispatch()
    const { control, handleSubmit } = useForm()
    const onSubmit = async data => {
        // dispatch(login({
        //     token: 'dummy',
        //     admin: false,
        // }))
        dispatch(verifyLogin(data.email,data.password))
    }
    const createNewAccountHandler = () => {
        props.navigation.navigate('CreateAccount')
    }
    const forgotPasswordHandler = () => {
        props.navigation.navigate('ForgotPassScreen')
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
        }
    })
    return (
        <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
            <SafeAreaView style={styles.mainContainer}>
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
                    <TouchableWithoutFeedback onPress={forgotPasswordHandler}>
                        <Text style={styles.forgotPasswordButton}>Forgot Password?</Text>
                    </TouchableWithoutFeedback>
                        <Text style={{flexDirection: 'row', marginTop: 15}}>
                            <Text style={styles.signUpButton}>Don't have an account?&nbsp;&nbsp;&nbsp;</Text>
                            <TouchableWithoutFeedback onPress={createNewAccountHandler}>
                                <Text style={{...styles.signUpButton, textDecorationLine: 'underline'}}>Sign Up</Text>
                            </TouchableWithoutFeedback>
                        </Text>
                </View>
                <View style={styles.bottomBar}>
                    
                </View>
            </SafeAreaView>
        </TouchableWithoutFeedback>
    )
}