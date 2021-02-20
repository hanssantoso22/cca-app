import React from 'react';
import { marginHorizontal, PURPLE } from '../../components/common/styles'
import { SafeAreaView, View, Text, StyleSheet, TouchableWithoutFeedback, Alert } from 'react-native'
import { useForm, Controller } from 'react-hook-form'
import { useFonts, Lato_700Bold, Lato_400Regular } from '@expo-google-fonts/lato'
import CustomTextInput from '../../components/common/forms/TextInput'
import PrimaryButton from '../../components/common/buttons/PrimaryBig'
import { Keyboard } from 'react-native'

import axios from 'axios'
import { URL } from '../../api/config'

export default function ForgotPass (props) {
    const [isLoaded] = useFonts({
        Lato_400Regular,
        Lato_700Bold
    })
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
            const res = await axios.post(`${URL}/users/forget`, data)
            props.navigation.navigate('ForgotPassVerificationScreen', {email: data.email})
        } catch (err) {
            Alert.alert('Email not found')
        }
    }
    const backHandler = () => {
        props.navigation.goBack()
    }
    return (isLoaded &&
        <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
            <SafeAreaView style={{height: '100%'}}>
                <View style={styles.mainPage} >
                    <Controller
                        control={control}
                        render= {({ onChange, value }) => (
                            <CustomTextInput
                                label='Email'
                                onChangeText={text=>{onChange(text)}}
                                value={value}
                                type='email'
                            />
                            )}
                        name="email"
                        defaultValue=""
                    />
                    <View style={{flexDirection: 'row', width: '100%'}}>
                        <View style={{flex: 1}}>
                            <PrimaryButton fontSize={16} text="Get Reset Code" pressHandler={handleSubmit(onSubmit)}/>
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