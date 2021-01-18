import React from 'react';
import SubNavbar from '../../components/common/navigation/navbar/SubNavbar'
import { page, GREY, marginHorizontal } from '../../components/common/styles'
import { SafeAreaView, View, Text, StyleSheet, TouchableWithoutFeedback, Keyboard } from 'react-native'
import { useFonts, Lato_700Bold, Lato_400Regular } from '@expo-google-fonts/lato'
import { useForm, Controller } from 'react-hook-form'
import CustomTextInput from '../../components/common/forms/TextInput'
import MultiLineInput from '../../components/common/forms/MultiLineInput'
import CustomPicker from '../../components/common/forms/Picker'
import PrimaryButton from '../../components/common/buttons/PrimarySmall'
import SecondaryButton from '../../components/common/buttons/SecondarySmall'

export default function home (props) {
    const [isLoaded] = useFonts({
        Lato_400Regular,
        Lato_700Bold
    })
    const loaded = isLoaded
    const onBackPress = () => {
        props.navigation.goBack()
    }
    const { announcementID } = props.route.params
    const styles = StyleSheet.create ({
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
            marginBottom: marginHorizontal,
        },
        inputLabel: {
            fontFamily: 'Lato_400Regular'
        }
    })
    const CCAs = [
        {label: 'EEE Club', value: 'EEE Club'},
        {label: 'Garage @EEE', value: 'Garage @EEE'},
        {label: 'MLDA @EEE', value: 'MLDA @EEE'}
    ]
    //CHANGE CCA ID BELOW WITH THE REAL ONE
    const visibility = [
        {label: 'Public', value: 'Public'},
        {label: 'Member Only', value: 'INSERT CCA ID'}
    ]
    const defaultValues = {
        announcementTitle: '', 
        content: '', 
        organizer: '', 
        visibility: ''
    }
    const { control, handleSubmit, reset, setValue } = useForm({ defaultValues })
    const onSubmit = data => {
        console.log('Data: ',data)
    }
    const resetHandler = ()=> {
        reset(defaultValues)
        setValue("organizer","")
        setValue("visibility","")
        console.log('reset')
    }

    return (
        <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
            <SafeAreaView style={page.main}>
                <SubNavbar title='Edit Announcement' pressed={onBackPress} />
                <View style={page.main}>
                <Text style={styles.pageTitle}>Announcement Details</Text>
                    <View style={styles.card}>
                        <Controller
                            control={control}
                            render= {({ onChange, value }) => (
                                <CustomTextInput
                                    label='Announcement Title'
                                    onChangeText={text=>{onChange(text)}}
                                    value={value}
                                    maxLength={40}
                                    type='name'
                                />
                            )}
                            name="announcementTitle"
                            defaultValue=""
                        />
                        <Controller
                            control={control}
                            render= {({ onChange, value }) => (
                                <CustomPicker 
                                    items={CCAs} 
                                    label='CCA'
                                    value={value}
                                    onValueChange={item=>{onChange(item)}}
                                />
                            )}
                            name="organizer"
                            defaultValue=""
                        />
                        <Controller
                            control={control}
                            render= {({ onChange, value }) => (
                                <MultiLineInput
                                    label='Content'
                                    onChangeText={text=>{onChange(text)}}
                                    value={value}
                                    multiline={true}
                                    maxLength={500}
                                    type='name'
                                />
                            )}
                            name="content"
                            defaultValue=""
                        />
                        <Controller
                            control={control}
                            render= {({ onChange, value }) => (
                                <CustomPicker 
                                    items={visibility} 
                                    label='Visibility'
                                    value={value} 
                                    onValueChange={item=>{onChange(item)}}
                                />
                            )}
                            name="visibility"
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
            </SafeAreaView>
        </TouchableWithoutFeedback>
        
    )
}