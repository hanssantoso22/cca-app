import React, { useState, useEffect } from 'react'
import { View, SafeAreaView, ScrollView, Text, StyleSheet, TouchableWithoutFeedback, Keyboard, Alert } from 'react-native'
import { useFonts, Lato_700Bold } from '@expo-google-fonts/lato'
import { page, RED, MING, GREY, marginHorizontal } from '../../../components/common/styles'
import SubNavbar from '../../../components/common/navigation/navbar/SubNavbar'
import WithLoading from '../../../components/hoc/withLoading'
import { useDispatch, useSelector } from 'react-redux'
import { editSelectedUsers } from '../../../redux/reducers/AdminSlice'
import { useForm, Controller } from 'react-hook-form'
import { ErrorMessage } from '@hookform/error-message'
import CustomTextInput from '../../../components/common/forms/TextInput'
import MultiLineInput from '../../../components/common/forms/MultiLineInput'
import PrimaryButton from '../../../components/common/buttons/PrimarySmall'
import SecondaryButton from '../../../components/common/buttons/SecondarySmall'
import ColoredButton from '../../../components/common/buttons/ColoredButton'
import ColorPalette from '../../../components/common/forms/ColorPalette'
import DeleteCCAModal from './DeleteCCAModal'
import ResetManagerModal from './ResetManagerModal'
import ResetMemberModal from './ResetMemberModal'

import axios from 'axios'
import {URL, authenticate} from '../../../api/config'
import store from '../../../redux/store/store'

export default function CCADetails (props) {
    const [isLoaded] = useFonts({Lato_700Bold})
    const [isLoading, setIsLoading] = useState(true)
    const [CCA, setCCA] = useState({})
    const [resetManager, setResetManager] = useState(false)
    const [showResetModal, setShowResetModal] = useState(false) //reset managers
    const [showResetMemberModal, setShowResetMemberModal] = useState(false) //reset members
    const [showDeleteModal, setShowDeleteModal] = useState(false)
    const { _id } = props.route.params
    const dispatch = useDispatch()
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
            marginBottom: marginHorizontal,
        },
        bottomContainer: {
            flexDirection: 'column-reverse',
            paddingHorizontal: 15,
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
        errorMessage: {
            color: RED[5],
            fontSize: 11,
            fontStyle: 'italic',
            marginBottom: 15,
            marginTop: -10
        },
        redHyperlink: {
            fontSize: 13,
            fontFamily: 'Lato_400Regular',
            color: RED[5],
            marginBottom: 10
        },
        selectedItemsContainer: {
            flexDirection: 'row',
            flexWrap: 'wrap',
            marginBottom: 15,
        },
        manager: {
            fontSize: 16,
            fontFamily: 'Lato_400Regular',
            color: GREY[4],
            marginBottom: 5
        }
    })
    const onBackPress = () => {
        props.navigation.goBack()
        dispatch(editSelectedUsers({selectedUsers: [], selectedUserIds: []}))
    }
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
    const onSubmit = (data) => {
        data.managers = store.getState().admin.selectedUserIds
        console.log(data)
        async function submitData () {
            try {
                const res = await axios.patch(`${URL}/CCA/${_id}/edit`, data, authenticate(store.getState().main.token))
                dispatch(editSelectedUsers({selectedUsers: [], selectedUserIds: []}))
                props.navigation.goBack()
            } catch (err) {
                Alert.alert('Editing not saved')
            }
        }
        submitData()
    }
    //Reset manager handlers
    const resetManagerHandler = () => {
        setShowResetModal(true)
    }
    const closeResetModal = () => {
        setShowResetModal(false)
    }
    const confirmResetManagerHandler = (ccaID) => {
        async function confirmResetManager () {
            try {
                const res = await axios.patch(`${URL}/CCA/${ccaID}/resetManager`, {}, authenticate(store.getState().main.token))
                setShowResetModal(false)
                setResetManager(true)
                props.navigation.goBack()
            } catch (err) {
                Alert.alert('Resetting member failed')
            }
        }
        confirmResetManager()
    }
    //Reset member handlers
    const resetMemberHandler = () => {
        setShowResetMemberModal(true)
    }
    const closeResetMemberModal = () => {
        setShowResetMemberModal(false)
    }
    const confirmResetMemberHandler = (ccaID) => {
        async function confirmResetMember () {
            try {
                const res = await axios.patch(`${URL}/CCA/${ccaID}/resetMember`, {}, authenticate(store.getState().main.token))
                setShowResetMemberModal(false)
                props.navigation.goBack()
            } catch (err) {
                Alert.alert('Resetting member failed')
            }
        }
        confirmResetMember()
    }
    //Delete CCA handlers
    const deleteHandler = () => {
        setShowDeleteModal(true)
    }
    const closeDeleteModal = () => {
        setShowDeleteModal(false)
    }
    const confirmDeleteHandler = ccaID => {
        async function deleteCCA () {
            try {
                const res = await axios.delete(`${URL}/CCA/${ccaID}/delete`, authenticate(store.getState().main.token))
                setShowDeleteModal(false)
                props.navigation.goBack()
            } catch (err) {
                console.log(err)
            }
        }
        deleteCCA()
    }
    const defaultValues = {
        ccaName: '',
        description: '',
        managers: '',
        color: '',
    }
    const { control, handleSubmit, reset, errors } = useForm({ defaultValues })
    useEffect (() => {
        async function loadCCA() {
            try {
                const res = await axios.get(`${URL}/CCA/${_id}`, authenticate(store.getState().main.token))
                setCCA(res.data)
                reset(res.data)
                if (res.data.managers.length == 0) setResetManager(true)
                setIsLoading(false)
            } catch (err) {
                console.log('Error',err)
            }
        }
        loadCCA()
    }, [reset])
    return (isLoaded &&
        <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
        <SafeAreaView style={page.main}>
            <SubNavbar title={CCA.ccaName} pressed={onBackPress} />
            <WithLoading isLoading={isLoading} loadingMessage='Loading details...'>
            <ScrollView>
            <View style={{marginTop: marginHorizontal}}>
                <Text style={styles.pageTitle}>CCA Details</Text>
                <View style={styles.card}>
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
                                label='CCA Name*'
                                onChangeText={text=>{onChange(text)}}
                                value={value}
                                type='name'
                            />
                        )}
                        name="ccaName"
                        defaultValue={CCA.ccaName}
                    />
                    {errors.ccaName && <Text style={styles.errorMessage}><ErrorMessage errors={errors} name="ccaName" /></Text>}
                    <Controller
                        control={control}
                        rules={{
                            required: {
                                value: true,
                                message: 'This is a required field.'
                            },
                        }}
                        render= {({ onChange, value }) => (
                            <MultiLineInput
                                label='Description*'
                                onChangeText={text=>{onChange(text)}}
                                value={value}
                                multiline={true}
                                maxLength={500}
                                type='name'
                            />
                        )}
                        name="description"
                        defaultValue={CCA.description}
                    />
                    {errors.description && <Text style={styles.errorMessage}><ErrorMessage errors={errors} name="description" /></Text>}
                    <View style={{flexDirection: 'row'}}>
                        <Text style={styles.inputLabel}>Managers: &nbsp;&nbsp;</Text>
                        {resetManager ? 
                            (<TouchableWithoutFeedback onPress={selectManagersHandler}>
                                <Text style={styles.hyperlink} >Edit Managers</Text>
                            </TouchableWithoutFeedback>) : 
                            (<TouchableWithoutFeedback onPress={resetManagerHandler}>
                                <Text style={styles.redHyperlink} >Reset Managers</Text>
                            </TouchableWithoutFeedback>)
                        }
                    </View>
                    {CCA.managers && CCA.managers.length > 0 && CCA.managers.map((managerDetails, index) => {
                        return (
                            <Text key={index} style={styles.manager}>{`${index+1}. ${managerDetails.fname} / ${managerDetails.year}`}</Text>
                        )
                    })}
                    <View style={styles.selectedItemsContainer}>
                        {selectedUsers != [] && selectedUsers.map((user,index) => (
                            <ColoredButton key={index} text={user} onPress={removeItemHandler.bind(this,user)} />
                        ))}
                    </View>
                    {CCA.members && CCA.members.length > 0 &&
                        <> 
                        <View style={{flexDirection: 'row'}}>
                            <Text style={styles.inputLabel}>Members: &nbsp;&nbsp;</Text>
                            <TouchableWithoutFeedback onPress={resetMemberHandler}>
                                <Text style={styles.redHyperlink} >Reset Members</Text>
                            </TouchableWithoutFeedback>  
                        </View>
                        <View>
                            {CCA.members.map((memberDetails, index) => {
                                return (
                                    <Text key={index} style={styles.manager}>{`${index+1}. ${memberDetails.fname} / ${memberDetails.year}`}</Text>
                                )
                            })}
                        </View>
                        </>
                    }
                    <Controller
                        control={control}
                        rules={{
                            required: {
                                value: true,
                                message: 'This is a required field.'
                            },
                        }}
                        render= {({ onChange, value }) => (
                            <ColorPalette 
                                onChange={color => onChange(color)}
                                value={value}
                            />
                        )}
                        name="color"
                        defaultValue={CCA.color}
                    />
                    {errors.color && <Text style={styles.errorMessage}><ErrorMessage errors={errors} name="color" /></Text>}
                    <View style={{flexDirection: 'row', width: '100%'}}>
                        <View style={{paddingRight: 10, flex: 1}}>
                            <SecondaryButton fontSize={16} text="Delete CCA" pressHandler={deleteHandler}/>
                        </View>
                        <View style={{paddingRight: 10, flex: 1}}>
                            <PrimaryButton fontSize={16} text="Save Changes" pressHandler={handleSubmit(onSubmit)}/>
                        </View>
                    </View>
                </View>
            </View>
            </ScrollView>
            </WithLoading>
            <ResetManagerModal isModalVisible={showResetModal} closeModal={closeResetModal} confirmHandler={confirmResetManagerHandler} cancelHandler={closeResetModal} ccaID={_id} />
            <ResetMemberModal isModalVisible={showResetMemberModal} closeModal={closeResetMemberModal} confirmHandler={confirmResetMemberHandler} cancelHandler={closeResetMemberModal} ccaID={_id} />
            <DeleteCCAModal isModalVisible={showDeleteModal} closeModal={closeDeleteModal} confirmHandler={confirmDeleteHandler} cancelHandler={closeDeleteModal} ccaID={_id} />
        </SafeAreaView>
        </TouchableWithoutFeedback>
    )
}
