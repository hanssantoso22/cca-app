import React from 'react';
import { GREY, page, marginHorizontal } from '../../components/common/styles'
import { SafeAreaView, View, Text, StyleSheet, TouchableWithoutFeedback } from 'react-native'
import { useDispatch } from 'react-redux'
import { signUp } from '../../redux/reducers/mainSlice'
import { useForm, Controller } from 'react-hook-form'
import { login } from '../../redux/reducers/mainSlice'
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
    const loaded = isLoaded
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
    const { control, handleSubmit, reset, setValue } = useForm({ defaultValues })
    const onSubmit = data => {
        console.log(data)
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
        console.log('reset')
    }
    return (
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
                                render= {({ onChange, value }) => (
                                    <CustomTextInput
                                        label='Full Name (as NRIC)'
                                        onChangeText={text=>{onChange(text)}}
                                        value={value}
                                        maxLength={40}
                                        type='name'
                                    />
                                  )}
                                name="fname"
                                defaultValue=""
                            />
                            <Controller
                                control={control}
                                render= {({ onChange, value }) => (
                                    <CustomTextInput
                                        label='NTU Email Address'
                                        onChangeText={text=>{onChange(text)}}
                                        value={value}
                                        type='name'
                                    />
                                  )}
                                name="email"
                                defaultValue=""
                            />
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
                                        label='Re-type New Password'
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
                                    <CustomPicker 
                                        items={years} 
                                        label='Academic Year'
                                        onValueChange={item=>{onChange(item)}}
                                        value={value}
                                    />
                                  )}
                                name="year"
                                defaultValue=""
                            />
                            <Controller
                                control={control}
                                render= {({ onChange, value }) => (
                                    <CustomPicker 
                                        items={faculties} 
                                        label='Faculty'
                                        onValueChange={item=>{onChange(item)}}
                                        value={value}
                                    />
                                  )}
                                name="faculty"
                                defaultValue=""
                            />
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