import React from 'react';
import { GREY, page, marginHorizontal, RED } from '../../components/common/styles'
import { SafeAreaView, View, Text, StyleSheet, TouchableWithoutFeedback } from 'react-native'
import { useDispatch } from 'react-redux'
import { signUp } from '../../redux/reducers/mainSlice'
import { useForm, Controller } from 'react-hook-form'
import { ErrorMessage } from '@hookform/error-message'
import { useFonts, Lato_700Bold, Lato_400Regular } from '@expo-google-fonts/lato'
import SubNavbar from '../../components/common/navigation/navbar/SubNavbar'
import CustomTextInput from '../../components/common/forms/TextInput'
import CustomPicker from '../../components/common/forms/Picker'
import PrimaryButton from '../../components/common/buttons/PrimarySmall'
import SecondaryButton from '../../components/common/buttons/SecondarySmall'
import { Keyboard } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';

export default function createNewAccount (props) {
    const [isLoaded] = useFonts({
        Lato_400Regular,
        Lato_700Bold
    })
    const dispatch = useDispatch()
    const onBackPress = () => {
        props.navigation.goBack()
    }
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
        pageTitle: {
            fontFamily: 'Lato_400Regular',
            fontSize: 20,
            color: GREY[4],
            marginLeft: marginHorizontal,
            marginVertical: marginHorizontal,
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
        }
    })
    const years = [
        {label: 'Year 1', value: '1'},
        {label: 'Year 2', value: '2'},
        {label: 'Year 3', value: '3'},
        {label: 'Year 4', value: '4'},
    ]
    const faculties = [
        {label: 'EEE', value: 'EEE'},
        {label: 'IEM', value: 'IEM'},
    ]
    const { control, handleSubmit, reset, setValue, errors, getValues } = useForm({ defaultValues })
    const onSubmit = data => {
        delete data.confirmPassword
        dispatch(signUp(data))
    }
    const defaultValues = {
        fname: '',
        email: '',
        password: '',
        confirmPassword: '',
        year: '',
        faculty: ''
    }
    const resetHandler = ()=> {
        reset(defaultValues)
        setValue("year","")
        setValue("faculty","")
    }
    return (isLoaded &&
        <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
            <SafeAreaView style={page.main}>
                <SubNavbar title='Create New Account' pressed={onBackPress} />
                <ScrollView>
                    <View>
                        <Text style={styles.pageTitle}>Account Details</Text>
                        <View style={styles.card}>
                        <View style={{width: '100%'}}>
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
                                        label='Full Name (as NRIC)*'
                                        onChangeText={text=>{onChange(text)}}
                                        value={value}
                                        maxLength={40}
                                        type='name'
                                        autoCapitalize='words'
                                    />
                                  )}
                                name="fname"
                                defaultValue=""
                            />
                            {errors.fname && <Text style={styles.errorMessage}><ErrorMessage errors={errors} name="fname" /></Text>}
                            <Controller
                                control={control}
                                rules={{
                                    required: {
                                        value: true,
                                        message: 'This is a required field.'
                                    },
                                    pattern: {
                                        value: /@ntu.edu.sg|@e.ntu.edu.sg$/,
                                        message: 'Please use NTU email address.'
                                    }
                                }}
                                render= {({ onChange, value }) => (
                                    <CustomTextInput
                                        label='NTU Email Address*'
                                        onChangeText={text=>{onChange(text)}}
                                        value={value}
                                        type='name'
                                    />
                                  )}
                                name="email"
                                defaultValue=""
                            />
                            {errors.email && <Text style={styles.errorMessage}><ErrorMessage errors={errors} name="email" /></Text>}
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
                                        label='New Password*'
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
                                        label='Re-type New Password*'
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
                                    }
                                }}
                                render= {({ onChange, value }) => (
                                    <CustomPicker 
                                        items={years} 
                                        label='Academic Year*'
                                        onValueChange={item=>{onChange(item)}}
                                        value={value}
                                    />
                                  )}
                                name="year"
                                defaultValue=""
                            />
                            {errors.year && <Text style={styles.errorMessage}><ErrorMessage errors={errors} name="year" /></Text>}
                            <Controller
                                control={control}
                                rules={{
                                    required: {
                                        value: true,
                                        message: 'This is a required field.'
                                    }
                                }}
                                render= {({ onChange, value }) => (
                                    <CustomPicker 
                                        items={faculties} 
                                        label='Faculty*'
                                        onValueChange={item=>{onChange(item)}}
                                        value={value}
                                    />
                                  )}
                                name="faculty"
                                defaultValue=""
                            />
                            {errors.faculty && <Text style={styles.errorMessage}><ErrorMessage errors={errors} name="faculty" /></Text>}
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
                    </View>
                </ScrollView>
            </SafeAreaView>
        </TouchableWithoutFeedback>
    )
}