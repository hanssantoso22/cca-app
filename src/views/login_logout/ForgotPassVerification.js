import React from 'react';
import { GREY, marginHorizontal, PURPLE, RED } from '../../components/common/styles'
import { SafeAreaView, View, Text, StyleSheet, TouchableWithoutFeedback, Alert } from 'react-native'
import { useForm, Controller } from 'react-hook-form'
import { ErrorMessage } from '@hookform/error-message'
import { useFonts, Lato_700Bold, Lato_400Regular } from '@expo-google-fonts/lato'
import CustomTextInput from '../../components/common/forms/TextInput'
import PrimaryButton from '../../components/common/buttons/PrimaryBig'
import { Keyboard } from 'react-native'

import axios from 'axios'
import { URL } from '../../api/config'

export default function ForgotPassVerification (props) {
    const [isLoaded] = useFonts({
        Lato_400Regular,
        Lato_700Bold
    })
    const { email } = props.route.params
    const styles = StyleSheet.create({
        mainPage: {
            marginHorizontal: marginHorizontal,
            justifyContent: 'center',
            height: '100%'
        },
        backButton: {
            marginTop: 15,
            fontFamily: 'Lato_700Bold',
            color: PURPLE[5],
            fontSize: 13,
            textAlign: 'center'
        },
        errorMessage: {
            color: RED[5],
            fontSize: 11,
            fontStyle: 'italic',
            marginBottom: 15,
            marginTop: -10
        },
        notice: {
            color: GREY[3],
            fontSize: 13,
            marginBottom: 15,
            fontStyle: 'italic'
        }
    })
    const { control, handleSubmit, getValues, errors } = useForm()
    const onSubmit = async data => {
        try {
            delete data.confirmPassword
            const res = await axios.post(`${URL}/users/forget/update`, {...data, email })
            props.navigation.navigate('LoginScreen')
        } catch (err) {
            Alert.alert('Changing password failed')
        }
    }
    const backHandler = async () => {
        try {
            const res = await axios.patch(`${URL}/users/forget/resetToken`, {email})
            console.log(res.data)
            props.navigation.navigate('LoginScreen')
        } catch (err) {
            console.log(err)
        }
    }
    return (isLoaded &&
        <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
            <SafeAreaView style={{height: '100%'}}>
                <View style={styles.mainPage} >
                    <Text style={styles.notice}>Reset token has been sent to your email. Please check the spam folder.</Text>
                    <Controller
                        control={control}
                        rules={{
                            required: {
                                value: true,
                                message: 'This is a required field.'
                            },
                            pattern: {
                                value: /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/,
                                message: 'Password must contain at least 8 characters, a number, and a unique character.'
                            },
                        }}
                        render= {({ onChange, value }) => (
                            <CustomTextInput
                                label='New Password'
                                onChangeText={text=>{onChange(text)}}
                                value={value}
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
                                type='password'
                            />
                            )}
                        name="confirmPassword"
                        defaultValue=""
                    />
                    {errors.confirmPassword && <Text style={styles.errorMessage}><ErrorMessage errors={errors} name="confirmPassword" /></Text>}
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
                                label='Reset Token'
                                onChangeText={text=>{onChange(text)}}
                                value={value}
                                type='name'
                            />
                            )}
                        name="resetToken"
                        defaultValue=""
                    />
                    {errors.resetToken && <Text style={styles.errorMessage}><ErrorMessage errors={errors} name="resetToken" /></Text>}
                    <View style={{flexDirection: 'row', width: '100%'}}>
                        <View style={{flex: 1}}>
                            <PrimaryButton fontSize={16} text="Reset Password" pressHandler={handleSubmit(onSubmit)}/>
                            <TouchableWithoutFeedback onPress={backHandler}>
                                <Text style={styles.backButton}>Back to Login Page</Text>
                            </TouchableWithoutFeedback>
                        </View>
                    </View>
                </View>
            </SafeAreaView>
        </TouchableWithoutFeedback>
    )
}