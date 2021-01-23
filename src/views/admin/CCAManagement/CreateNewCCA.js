import React from 'react'
import { ScrollView, StyleSheet, SafeAreaView, View, TouchableWithoutFeedback, Text, Keyboard } from 'react-native'
import { useFonts, Lato_700Bold, Lato_400Regular } from '@expo-google-fonts/lato'
import { page, GREY, MING, marginHorizontal } from '../../../components/common/styles'
import SubNavbar from '../../../components/common/navigation/navbar/SubNavbar'
import { useDispatch, useSelector } from 'react-redux'
import { editSelectedUsers } from '../../../redux/reducers/AdminSlice'
import { useForm, Controller } from 'react-hook-form'
import CustomTextInput from '../../../components/common/forms/TextInput'
import MultiLineInput from '../../../components/common/forms/MultiLineInput'
import PrimaryButton from '../../../components/common/buttons/PrimarySmall'
import SecondaryButton from '../../../components/common/buttons/SecondarySmall'
import ColoredButton from '../../../components/common/buttons/ColoredButton'
import ColorPalette from '../../../components/common/forms/ColorPalette'

import axios from 'axios'
import {URL, authenticate} from '../../../api/config'
import store from '../../../redux/store/store'

export default function CreateNewCCA (props) {
    const [isLoaded] = useFonts({
        Lato_400Regular,
        Lato_700Bold
    })
    const loaded = isLoaded
    const dispatch = useDispatch()
    const onBackPress = () => {
        props.navigation.goBack()
        dispatch(editSelectedUsers({selectedUsers: [], selectedUserIds: []}))
    }
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
            fontSize: 13,
            fontFamily: 'Lato_400Regular',
            color: GREY[3],
            marginBottom: 10
        },
        hyperlink: {
            fontSize: 13,
            fontFamily: 'Lato_400Regular',
            color: MING[5],
            marginBottom: 10
        },
        selectedItemsContainer: {
            flexDirection: 'row',
            flexWrap: 'wrap',
            marginBottom: 15,
        },
    })
    const selectedUsers = useSelector(state => state.admin.selectedUsers)
    const selectedUserIds = useSelector(state => state.admin.selectedUserIds)
    const selectManagersHandler = () => {
        props.navigation.navigate('SelectManagersScreen')
    }
    const removeItemHandler = (managerName) => {
        let tempArray = [...selectedUsers]
        let tempArray2 = [...selectedUserIds]
        const index = selectedUsers.indexOf(managerName)
        delete tempArray[index]
        delete tempArray2[index]
        tempArray = tempArray.filter((item) => item!=undefined)
        tempArray2 = tempArray2.filter((item) => item!=undefined)
        dispatch(editSelectedUsers({selectedUsers: tempArray, selectedUserIds: tempArray2}))
    }
    const defaultValues = {
        ccaName: '',
        description: '',
        managers: '',  
        color: ''
    }
    const { control, handleSubmit, reset } = useForm({ defaultValues })
    const onSubmit = data => {
        data.managers = store.getState().admin.selectedUserIds
        async function submitData () {
            try {
                const res = await axios.post(`${URL}/CCAs/create`, data, authenticate(store.getState().main.token))
                dispatch(editSelectedUsers({selectedUsers: [], selectedUserIds: []}))
                props.navigation.goBack()
            } catch (err) {
                console.log(err)
            }
        }
        submitData()
    }
    const resetHandler = ()=> {
        reset(defaultValues)
        dispatch(editSelectedUsers({selectedUsers: [], selectedUserIds: []}))
        console.log('reset')
    }

    return (
        <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
            <SafeAreaView style={page.main}>
                <SubNavbar title='Create New CCA' pressed={onBackPress} />
                <ScrollView>
                <View style={page.main}>
                    <Text style={styles.pageTitle}>CCA Details</Text>
                    <View style={styles.card}>
                        <Controller
                            control={control}
                            render= {({ onChange, value }) => (
                                <CustomTextInput
                                    label='CCA Name'
                                    onChangeText={text=>{onChange(text)}}
                                    value={value}
                                    type='name'
                                />
                            )}
                            name="ccaName"
                            defaultValue=""
                        />
                        <Controller
                            control={control}
                            render= {({ onChange, value }) => (
                                <MultiLineInput
                                    label='Description'
                                    onChangeText={text=>{onChange(text)}}
                                    value={value}
                                    multiline={true}
                                    maxLength={500}
                                    type='name'
                                />
                            )}
                            name="description"
                            defaultValue=""
                        />
                        <View style={{flexDirection: 'row'}}>
                            <Text style={styles.inputLabel}>Managers: &nbsp;&nbsp;</Text>
                            <TouchableWithoutFeedback onPress={selectManagersHandler}>
                                <Text style={styles.hyperlink} >Edit Managers</Text>
                            </TouchableWithoutFeedback>
                        </View>
                        <View style={styles.selectedItemsContainer}>
                            {selectedUsers != [] && selectedUsers.map((user,index) => (
                                <ColoredButton key={index} text={user} onPress={removeItemHandler.bind(this,user)} />
                            ))}
                        </View>
                        <Controller
                            control={control}
                            render= {({ onChange, value }) => (
                                <ColorPalette 
                                    onChange={color => onChange(color)}
                                    value={value}
                                />
                            )}
                            name="color"
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
                </ScrollView>
            </SafeAreaView>
        </TouchableWithoutFeedback>
        
    )
}