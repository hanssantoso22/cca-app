import React from 'react';
import { marginHorizontal, PURPLE, GREY } from '../../components/common/styles'
import { SafeAreaView, View, Text, StyleSheet, TouchableWithoutFeedback } from 'react-native'
import { useForm, Controller } from 'react-hook-form'
import { useFonts, Lato_700Bold, Lato_400Regular } from '@expo-google-fonts/lato'
import CustomTextInput from '../../components/common/forms/TextInput'
import PrimaryButton from '../../components/common/buttons/PrimaryBig'
import { Keyboard } from 'react-native'

import { useDispatch } from 'react-redux'
import { registerCredentials } from '../../redux/reducers/mainSlice'

export default function ForgotPass (props) {
    const [isLoaded] = useFonts({
        Lato_400Regular,
        Lato_700Bold
    })
    const dispatch = useDispatch()
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
        notice: {
            color: GREY[4],
            fontSize: 13,
            marginBottom: 15,
            fontStyle: 'italic'
        }
    })
    const { control, handleSubmit } = useForm()
    const onSubmit = async data => {
        dispatch(registerCredentials(data.email,data.password))
    }
    const backHandler = () => {
        props.navigation.goBack()
    }
    return (isLoaded &&
        <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
            <SafeAreaView style={{height: '100%'}}>
                <View style={styles.mainPage} >
                    <Text style={styles.notice}>Credentials below will be stored on the local storage for biometrics authentication in the future.</Text>
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
                    <Controller
                        control={control}
                        render= {({ onChange, value }) => (
                            <CustomTextInput
                                label='Password'
                                onChangeText={text=>{onChange(text)}}
                                value={value}
                                type='password'
                            />
                            )}
                        name="password"
                        defaultValue=""
                    />
                    <View style={{flexDirection: 'row', width: '100%'}}>
                        <View style={{flex: 1}}>
                            <PrimaryButton fontSize={16} text="Setup Credentials" pressHandler={handleSubmit(onSubmit)}/>
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