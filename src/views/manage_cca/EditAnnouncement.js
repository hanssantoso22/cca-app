import React from 'react';
import SubNavbar from '../../components/common/navigation/navbar/SubNavbar'
import { page, GREY, marginHorizontal } from '../../components/common/styles'
import { SafeAreaView, View, Text, StyleSheet, TouchableWithoutFeedback, Keyboard } from 'react-native'
import { useFonts, Lato_700Bold, Lato_400Regular } from '@expo-google-fonts/lato'
import { Formik } from 'formik'
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
    const audience = [
        {label: 'Public', value: 'Public'},
        {label: 'Internal', value: 'Internal'}
    ]
    const initialValues = {announcementTitle: '', content: '', CCAName: '', audience: ''}

    return (
        <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
            <SafeAreaView style={page.main}>
                <SubNavbar title='Edit Announcement' pressed={onBackPress} />
                <View style={page.main}>
                    <Text style={styles.pageTitle}>Announcement Details</Text>
                    <View style={styles.card}>
                        <Formik
                            initialValues={initialValues}
                            onSubmit = {(values,actions)=>{
                                console.log(values)
                                values.CCAName=""
                                values.announcementTitle=""
                                values.audience=""
                                values.content=""
                                console.log(values)
                            }}
                        >
                            {({ handleChange, handleReset, handleSubmit, values, setFieldValue, resetForm }) => (
                                <View style={{width: '100%'}}>
                                    <CustomTextInput
                                        label='Announcement Title'
                                        onChangeText={handleChange('announcementTitle')}
                                        value={values.announcementTitle}
                                        maxLength={40}
                                        type='name'
                                    />
                                    <MultiLineInput
                                        label='Content'
                                        onChangeText={handleChange('content')}
                                        value={values.content}
                                        multiline={true}
                                        maxLength={500}
                                        type='name'
                                    />
                                    <CustomPicker 
                                        items={CCAs} 
                                        label='CCA'
                                        selectedValue={values.CCAName} 
                                        onValueChange={itemValue => setFieldValue('CCAName', itemValue)}
                                    />
                                    <CustomPicker 
                                        items={audience} 
                                        label='Audience'
                                        selectedValue={values.audience} 
                                        onValueChange={itemValue => setFieldValue('audience', itemValue)}
                                    />
                                    <View style={{flexDirection: 'row', width: '100%'}}>
                                        <View style={{paddingRight: 10, flex: 1}}>
                                            <SecondaryButton 
                                                fontSize={16} 
                                                text="Clear Input" 
                                                pressHandler={()=> {
                                                    resetForm(initialValues)
                                                }}
                                            />
                                        </View>
                                        <View style={{paddingLeft: 10, flex: 1}}>
                                            <PrimaryButton fontSize={16} text="Submit" pressHandler={handleSubmit}/>
                                        </View>
                                    </View>
                                </View>
                            )}
                        </Formik>
                    </View>
                </View>
            </SafeAreaView>
        </TouchableWithoutFeedback>
        
    )
}