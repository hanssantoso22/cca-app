import React, { useState } from 'react'
import { View, SafeAreaView, ScrollView, Text, StyleSheet, TouchableWithoutFeedback, Keyboard } from 'react-native'
import { useFonts, Lato_700Bold } from '@expo-google-fonts/lato'
import { page, RED, MING, GREY, marginHorizontal } from '../../../components/common/styles'
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
import DeleteCCAModal from './DeleteCCAModal'
import ResetManagerModal from './ResetManagerModal'

export default function CCADetails (props) {
    const [isLoaded] = useFonts({Lato_700Bold})
    const [resetManager, setResetManager] = useState(false)
    const [showResetModal, setShowResetModal] = useState(false)
    const [showDeleteModal, setShowDeleteModal] = useState(false)
    const loaded = isLoaded
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
    })
    const onBackPress = () => {
        props.navigation.goBack()
    }
    const selectedUsers = useSelector(state => state.admin.selectedUsers)
    const selectManagersHandler = () => {
        props.navigation.navigate('SelectManagersScreen')
    }
    const removeItemHandler = (managerName) => {
        let tempArray = [...selectedUsers]
        const index = selectedUsers.indexOf(managerName)
        delete tempArray[index]
        tempArray = tempArray.filter((item) => item!=undefined)
        dispatch(editSelectedUsers({selectedUsers: tempArray}))
    }
    const onSubmit = (data) => {
        props.navigation.navigate('CCAListScreen')
    }
    //Reset manager handlers
    const resetManagerHandler = () => {
        setShowResetModal(true)
    }
    const closeResetModal = () => {
        setShowResetModal(false)
    }
    const confirmResetManagerHandler = (ccaID) => {
        setShowResetModal(false)
        setResetManager(true)
    }
    //Delete CCA handlers
    const deleteHandler = () => {
        setShowDeleteModal(true)
    }
    const closeDeleteModal = () => {
        setShowDeleteModal(false)
    }
    const confirmDeleteHandler = ccaID => {
        setShowDeleteModal(false)
        props.navigation.navigate('CCAListScreen')
    }
    const { id } = props.route.params
    const CCAs = [
        {id: 0, label: 'EEE Club', value: 'EEE Club'},
        {id: 1, label: 'Garage @EEE', value: 'Garage @EEE'},
        {id: 2, label: 'MLDA @EEE', value: 'MLDA @EEE'}
    ]
    const CCA = CCAs.find((item) => item.id == id)
    const { control, handleSubmit } = useForm()
    return (
        <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
        <SafeAreaView style={page.main}>
            <SubNavbar title={CCA.label} pressed={onBackPress} />
            <ScrollView>
            <View style={{marginTop: marginHorizontal}}>
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
                            <SecondaryButton fontSize={16} text="Delete CCA" pressHandler={deleteHandler}/>
                        </View>
                        <View style={{paddingRight: 10, flex: 1}}>
                            <PrimaryButton fontSize={16} text="Save Changes" pressHandler={handleSubmit(onSubmit)}/>
                        </View>
                    </View>
                </View>
            </View>
            </ScrollView>
            <ResetManagerModal isModalVisible={showResetModal} closeModal={closeResetModal} confirmHandler={confirmResetManagerHandler} cancelHandler={closeResetModal} ccaID={id} />
            <DeleteCCAModal isModalVisible={showDeleteModal} closeModal={closeDeleteModal} confirmHandler={confirmDeleteHandler} cancelHandler={closeDeleteModal} ccaID={id} />
        </SafeAreaView>
        </TouchableWithoutFeedback>
    )
}
