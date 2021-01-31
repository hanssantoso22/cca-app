import React from 'react';
import { marginHorizontal, PURPLE } from '../../components/common/styles'
import { SafeAreaView, View, Text, StyleSheet, TouchableWithoutFeedback } from 'react-native'
import { useForm, Controller } from 'react-hook-form'
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
    const loaded = isLoaded
    const onBackPress = () => {
        props.navigation.goBack()
    }
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
        }
    })
    const { control, handleSubmit } = useForm()
    const onSubmit = async data => {
        try {
            delete data.confirmPassword
            // const res = await axios.post(`${URL}/users/forget/update`, data)
            props.navigation.navigate('LoginScreen')
        } catch (err) {
            console.log(err)
        }
    }
    const backHandler = async () => {
        try {
            // const res = await axios.post(`${URL}/users/forget/resetToken`, {})
            props.navigation.navigate('LoginScreen')
        } catch (err) {
            console.log(err)
        }
    }
    return (
        <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
            <SafeAreaView style={{height: '100%'}}>
                <View style={styles.mainPage} >
                    <Controller
                        control={control}
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
                    <Controller
                        control={control}
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
                    <Controller
                        control={control}
                        render= {({ onChange, value }) => (
                            <CustomTextInput
                                label='Reset Code (6 digits)'
                                onChangeText={text=>{onChange(text)}}
                                value={value}
                                type='name'
                            />
                            )}
                        name="resetCode"
                        defaultValue=""
                    />
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