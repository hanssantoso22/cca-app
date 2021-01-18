import React, { useState } from 'react'
import { ScrollView, View, Text, StyleSheet, SafeAreaView } from 'react-native'
import { Avatar } from 'react-native-elements'
import { useFonts, Lato_700Bold, Lato_400Regular } from '@expo-google-fonts/lato'
import { page, marginHorizontal, GREY, MING } from '../../components/common/styles'
import SubNavbar from '../../components/common/navigation/navbar/SubNavbar'
import { useForm, Controller } from 'react-hook-form'
import CustomTextInput from '../../components/common/forms/TextInput'
import MultiLineInput from '../../components/common/forms/MultiLineInput'
import CustomPicker from '../../components/common/forms/Picker'
import PrimaryButton from '../../components/common/buttons/PrimarySmall'
import SecondaryButton from '../../components/common/buttons/SecondarySmall'

export default function ProfilePage (props) {
    const [isLoaded] = useFonts({Lato_700Bold, Lato_400Regular})
    const loaded = isLoaded
    const [isChangingPassword, setIsChangingPassword] = useState(false)
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
        nameContainer: {
            alignItems: 'center',
            marginVertical: 15,
        },
        userName: {
            fontFamily: 'Lato_700Bold',
            fontSize: 20,
            color: GREY[5],
            textAlign: 'center',
            lineHeight: 30,
        },
        email: {
            fontFamily: 'Lato_400Regular',
            fontSize: 16,
            color: GREY[3],
            textAlign: 'center',
            lineHeight: 30,
        },
        hyperlink: {
            fontSize: 13,
            fontFamily: 'Lato_400Regular',
            color: MING[5],
            marginBottom: 15
        },
        bottomContainer: {
            flexDirection: 'column-reverse',
            paddingHorizontal: 15,
        },
        fieldName: {
            fontFamily: 'Lato_400Regular',
            fontSize: 13,
            color: GREY[3],
            lineHeight: 20,
        },
        value: {
            fontFamily: 'Lato_400Regular',
            fontSize: 16,
            color: GREY[5],
            marginTop: 5,
            marginBottom: 15,
        },
    })
    const onBackPress = () => {
        props.navigation.goBack()
    }
    const user = {id: 0, fname: 'Laurensius Hans Santoso 1', year:'4', faculty: 'EEE', email: 'dummy1@e.ntu.edu.sg', role: 'student', managedCCAs: ['EEE Club','MLDA @EEE'], joinedCCAs: []}
    const years = [
        {label: 'Year 1', value: '1'},
        {label: 'Year 2', value: '2'},
        {label: 'Year 3', value: '3'},
        {label: 'Year 4', value: '4'}
    ]
    const { control, handleSubmit, reset, setValue } = useForm()
    const onSubmit = data => {
        console.log('Data: ',data)
    }
    return (
        <SafeAreaView style={page.main}>
            <SubNavbar title={user.fname} pressed={onBackPress} />
            <ScrollView>
                <View style={page.main}>
                    <View style={styles.nameContainer}>
                        <Avatar rounded size="large" title='LH'/>
                        <Text style={styles.userName}>{user.fname}</Text>
                        <Text style={styles.email}>{user.email}</Text>
                        <Text style={styles.email}>{user.faculty}</Text>
                    </View>
                    <View style={styles.card}>
                    <View style={{width: '100%'}}>
                        <Controller
                            control={control}
                            render= {({ onChange, value }) => (
                                <CustomPicker 
                                    items={years} 
                                    label='Academic Year'
                                    value={value}
                                    onValueChange={item=>{onChange(item)}}
                                />
                                )}
                            name="year"
                            defaultValue=""
                        />
                        {user.joinedCCAs && user.joinedCCAs.length > 0 && (
                            <>
                            <Text style={styles.fieldName}>Joined CCAs: </Text>
                            <Text style={styles.value}>{user.joinedCCAs.join(', ')}</Text>
                            </>
                        )}
                        {user.managedCCAs && user.managedCCAs.length > 0 && (
                            <> 
                            <Text style={styles.fieldName}>Managed CCAs: </Text>
                            <Text style={styles.value}>{user.managedCCAs.join(', ')}</Text>
                            </>
                        )}
                        <Text onPress={()=>setIsChangingPassword(!isChangingPassword)} style={styles.hyperlink}>Change Password</Text>
                        {isChangingPassword && (
                            <>
                            <Controller
                                control={control}
                                render= {({ onChange, value }) => (
                                    <CustomTextInput
                                        label='New Password'
                                        onChangeText={text=>{onChange(text)}}
                                        value={value}
                                        maxLength={40}
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
                                        maxLength={40}
                                        type='password'
                                    />
                                )}
                                name="confirmPassword"
                                defaultValue=""
                            />
                            </>
                        )}
                        <View style={{flexDirection: 'row', width: '100%'}}>
                            <View style={{paddingRight: 10, flex: 1}}>
                                <SecondaryButton fontSize={13} text="Discard" pressHandler={onBackPress}/>
                            </View>
                            <View style={{paddingLeft: 10, flex: 1}}>
                                <PrimaryButton fontSize={13} text="Save Changes" pressHandler={handleSubmit(onSubmit)}/>
                            </View>
                        </View>
                    </View>
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    )
}