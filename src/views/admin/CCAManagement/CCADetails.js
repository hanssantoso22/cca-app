import React, { useState, useEffect } from 'react'
import { View, SafeAreaView, ScrollView, Text, StyleSheet, TouchableWithoutFeedback, Keyboard, Alert } from 'react-native'
import { useFonts, Lato_700Bold } from '@expo-google-fonts/lato'
import { page, RED, MING, GREY, marginHorizontal } from '../../../components/common/styles'
import SubNavbar from '../../../components/common/navigation/navbar/SubNavbar'
import WithLoading from '../../../components/hoc/withLoading'
import { useDispatch, useSelector } from 'react-redux'
import { editSelectedUsers, editExcos, editMaincomms } from '../../../redux/reducers/AdminSlice'
import { useForm, Controller } from 'react-hook-form'
import { ErrorMessage } from '@hookform/error-message'
import CustomTextInput from '../../../components/common/forms/TextInput'
import MultiLineInput from '../../../components/common/forms/MultiLineInput'
import PrimaryButton from '../../../components/common/buttons/PrimarySmall'
import PrimaryBig from '../../../components/common/buttons/PrimaryBig'
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
    const [resetMaincomm, setResetMaincomm] = useState(false)
    const [resetExco, setResetExco] = useState(false)
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
        },
        bottomBar: {
            flexDirection: 'column-reverse',
            paddingHorizontal: 30,
            paddingVertical: 15,
        },
    })
    const onBackPress = () => {
        props.navigation.goBack()
        dispatch(editSelectedUsers({selectedUsers: [], selectedUserIds: []}))
        dispatch(editExcos({selectedExcos: [], selectedExcoIds: []}))
        dispatch(editMaincomms({selectedMaincomms: [], selectedMaincommIds: []}))
    }
    const selectedUsers = useSelector(state => state.admin.selectedUsers)
    const selectedUserIds = useSelector(state => state.admin.selectedUserIds)
    const selectedExcos = useSelector(state => state.admin.selectedExcos)
    const selectedExcoIds = useSelector(state => state.admin.selectedExcoIds)
    const selectedMaincomms = useSelector(state => state.admin.selectedMaincomms)
    const selectedMaincommIds = useSelector(state => state.admin.selectedMaincommIds)
    const selectManagersHandler = () => {
        props.navigation.navigate('SelectManagersScreen')
    }
    const selectExcosHandler = () => {
        props.navigation.navigate('SelectExcosScreen')
    }
    const selectMaincommsHandler = () => {
        props.navigation.navigate('SelectMaincommsScreen')
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
    const removeExcoHandler = (excoName) => {
        let tempArray = [...selectedExcos]
        let tempArray2 = [...selectedExcoIds]
        const index = selectedExcos.indexOf(excoName)
        delete tempArray[index]
        delete tempArray2[index]
        tempArray = tempArray.filter((item) => item!=undefined)
        tempArray2 = tempArray2.filter((item) => item!=undefined)
        dispatch(editExcos({selectedExcos: tempArray, selectedExcoIds: tempArray2}))
    }
    const removeMaincommHandler = (maincommName) => {
        let tempArray = [...selectedMaincomms]
        let tempArray2 = [...selectedMaincommIds]
        const index = selectedMaincomms.indexOf(maincommName)
        delete tempArray[index]
        delete tempArray2[index]
        tempArray = tempArray.filter((item) => item!=undefined)
        tempArray2 = tempArray2.filter((item) => item!=undefined)
        dispatch(editMaincomms({selectedMaincomms: tempArray, selectedMaincommIds: tempArray2}))
    }
    const onSubmit = (data) => {
        data.managers = store.getState().admin.selectedUserIds
        data.executives = store.getState().admin.selectedExcoIds
        data.maincomms = store.getState().admin.selectedMaincommIds 
        async function submitData () {
            try {
                const res = await axios.patch(`${URL}/CCA/${_id}/edit`, data, authenticate(store.getState().main.token))
                dispatch(editSelectedUsers({selectedUsers: [], selectedUserIds: []}))
                dispatch(editExcos({selectedExcos: [], selectedExcoIds: []}))
                dispatch(editMaincomms({selectedMaincomms: [], selectedMaincommIds: []}))
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
            } catch (err) {
                Alert.alert('Resetting member failed')
            }
        }
        confirmResetManager()
    }
    //Reset exco handler
    const resetExcoHandler = async (ccaID) => {
        try {
            const res = await axios.patch(`${URL}/CCA/${ccaID}/resetExco`, {}, authenticate(store.getState().main.token))
            setResetExco(true)
        } catch (err) {
            Alert.alert('Resetting exco failed')
        }
    }
    //Reset maincomm handler
    const resetMaincommHandler = async (ccaID) => {
        try {
            const res = await axios.patch(`${URL}/CCA/${ccaID}/resetMaincomm`, {}, authenticate(store.getState().main.token))
            setResetMaincomm(true)
        } catch (err) {
            Alert.alert('Resetting maincomm failed')
        }
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
                Alert.alert('Deleting CCA failed')
            }
        }
        deleteCCA()
    }
    //End current committee handlers
    const endCommitteHandler = () => {
        props.navigation.navigate('EndCurrentCommitteeScreen',{ccaID: _id})
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
                if (res.data.executives.length == 0) setResetExco(true)
                if (res.data.maincomms.length == 0) setResetMaincomm(true)
                if (res.data.managers != undefined) {
                    const managers = res.data.managers.map(manager => manager.fname)
                    const managerids = res.data.managers.map(manager => manager._id)
                    dispatch(editSelectedUsers({selectedUsers: managers, selectedUserIds: managerids}))
                }
                if (res.data.executives != undefined) {
                    const excos = res.data.executives.map(exco => exco.fname)
                    const excoids = res.data.executives.map(exco => exco._id)
                    dispatch(editExcos({selectedExcos: excos, selectedExcoIds: excoids}))
                }
                if (res.data.maincomms != undefined) {
                    const maincomms = res.data.maincomms.map(maincomm => maincomm.fname)
                    const maincommids = res.data.maincomms.map(maincomm => maincomm._id)
                    dispatch(editMaincomms({selectedMaincomms: maincomms, selectedMaincommIds: maincommids}))
                }
                setIsLoading(false)
            } catch (err) {
                Alert.alert('Loading CCA error')
            }
        }
        loadCCA()
    }, [reset, resetManager, resetExco, resetMaincomm])
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
                                type='name'
                            />
                        )}
                        name="description"
                        defaultValue={CCA.description}
                    />
                    {errors.description && <Text style={styles.errorMessage}><ErrorMessage errors={errors} name="description" /></Text>}
                    {/* SELECT MANAGERS */}
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
                    <View style={styles.selectedItemsContainer}>
                        {selectedUsers != [] && selectedUsers.map((user,index) => (
                            <ColoredButton key={index} text={user} onPress={removeItemHandler.bind(this,user)} />
                        ))}
                    </View>
                    {/* SELECT EXCOS */}
                    <View style={{flexDirection: 'row'}}>
                        <Text style={styles.inputLabel}>Executive committee: &nbsp;&nbsp;</Text>
                        {resetExco ? 
                            (<TouchableWithoutFeedback onPress={selectExcosHandler}>
                                <Text style={styles.hyperlink} >Edit Executive Committee</Text>
                            </TouchableWithoutFeedback>) : 
                            (<TouchableWithoutFeedback onPress={resetExcoHandler.bind(this, _id)}>
                                <Text style={styles.redHyperlink} >Reset Executive Committee</Text>
                            </TouchableWithoutFeedback>)
                        }
                    </View>
                    <View style={styles.selectedItemsContainer}>
                        {selectedExcos != [] && selectedExcos.map((user,index) => (
                            <ColoredButton key={index} text={user} onPress={removeExcoHandler.bind(this,user)} />
                        ))}
                    </View>
                    {/* SELECT MAINCOMMS */}
                    <View style={{flexDirection: 'row'}}>
                        <Text style={styles.inputLabel}>Main committee: &nbsp;&nbsp;</Text>
                        {resetMaincomm ? 
                            (<TouchableWithoutFeedback onPress={selectMaincommsHandler}>
                                <Text style={styles.hyperlink} >Edit Maincomms</Text>
                            </TouchableWithoutFeedback>) : 
                            (<TouchableWithoutFeedback onPress={resetMaincommHandler.bind(this, _id)}>
                                <Text style={styles.redHyperlink} >Reset Maincomms</Text>
                            </TouchableWithoutFeedback>)
                        }
                    </View>
                    <View style={styles.selectedItemsContainer}>
                        {selectedMaincomms != [] && selectedMaincomms.map((user,index) => (
                            <ColoredButton key={index} text={user} onPress={removeMaincommHandler.bind(this,user)} />
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
            <View style={styles.bottomBar} >
                <PrimaryBig fontSize={20} pressHandler={endCommitteHandler} text={'End Current Committee'} />
            </View>
            </WithLoading>
            <ResetManagerModal isModalVisible={showResetModal} closeModal={closeResetModal} confirmHandler={confirmResetManagerHandler} cancelHandler={closeResetModal} ccaID={_id} />
            <ResetMemberModal isModalVisible={showResetMemberModal} closeModal={closeResetMemberModal} confirmHandler={confirmResetMemberHandler} cancelHandler={closeResetMemberModal} ccaID={_id} />
            <DeleteCCAModal isModalVisible={showDeleteModal} closeModal={closeDeleteModal} confirmHandler={confirmDeleteHandler} cancelHandler={closeDeleteModal} ccaID={_id} />
        </SafeAreaView>
        </TouchableWithoutFeedback>
    )
}
