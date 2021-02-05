import React, { useState, useEffect } from 'react'
import { ScrollView, View, Text, StyleSheet, SafeAreaView } from 'react-native'
import { useFonts, Lato_700Bold, Lato_400Regular } from '@expo-google-fonts/lato'
import { page, marginHorizontal, GREY } from '../../../components/common/styles'
import SubNavbar from '../../../components/common/navigation/navbar/SubNavbar'
import WithLoading from '../../../components/hoc/withLoading'
import DangerButton from '../../../components/common/buttons/DangerBig'
import DeleteUserModal from './DeleteUserModal'

import axios from 'axios'
import {URL, authenticate} from '../../../api/config'
import store from '../../../redux/store/store'

export default function UserList (props) {
    const [isLoaded] = useFonts({Lato_700Bold, Lato_400Regular})
    const loaded = isLoaded
    const { _id } = props.route.params
    const [isLoading, setIsLoading] = useState(true)
    const [user, setUser] = useState({})
    const [showModal, setShowModal] = useState(false)
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
        rowContainer: {
            flexDirection: 'row',
            marginBottom: 10,
        },
        fieldNameContainer: {
            flex: 1,
        },
        fieldName: {
            fontFamily: 'Lato_400Regular',
            fontSize: 14,
            color: GREY[3],
            lineHeight: 20,
        },
        value: {
            fontFamily: 'Lato_400Regular',
            fontSize: 14,
            color: GREY[6],
            lineHeight: 20,
        },
        valueContainer: {
            flex: 2,
            paddingLeft: 15,
        },
    })
    const onBackPress = () => {
        props.navigation.goBack()
    }
    const onDeleteHandler = () => {
        setShowModal(true)
    }
    const closeModalHandler = () => {
        setShowModal(false)
    }
    const confirmDeleteHandler = async (userID) => {
        try {
            const deletedUser = await axios.delete(`${URL}/user/${userID}/delete`, authenticate(store.getState().main.token))
            setShowModal(false)
            props.navigation.goBack()
        } catch (err) {
            console.log(err)
        }
    }
    useEffect(()=>{
        async function loadUser () {
            try {
                const res = await axios.get(`${URL}/user/${_id}`, authenticate(store.getState().main.token))
                setUser(res.data)
                setIsLoading(false)
            } catch (err) {
                console.log(err)
            }
        }
        loadUser() 
    },[])
    return (
        <SafeAreaView style={page.main}>
            <SubNavbar title={user.fname} pressed={onBackPress} />
            <WithLoading isLoading={isLoading} loadingMessage='Loading details...'>
            <ScrollView>
                <View style={page.main}>
                    <Text style={styles.pageTitle}>User Details</Text>
                    <View style={styles.card}>
                    <View style={{width: '100%'}}>
                        <View style={styles.rowContainer}>
                            <View style={styles.fieldNameContainer}>
                                <Text style={styles.fieldName}>Full Name:</Text>
                            </View>
                            <View style={styles.valueContainer}>
                                <Text style={styles.value}>{user.fname}</Text>
                            </View>
                        </View>
                        <View style={styles.rowContainer}>
                            <View style={styles.fieldNameContainer}>
                                <Text style={styles.fieldName}>Email address:</Text>
                            </View>
                            <View style={styles.valueContainer}>
                                <Text style={styles.value}>{user.email}</Text>
                            </View>
                        </View>
                        <View style={styles.rowContainer}>
                            <View style={styles.fieldNameContainer}>
                                <Text style={styles.fieldName}>Faculty:</Text>
                            </View>
                            <View style={styles.valueContainer}>
                                <Text style={styles.value}>{user.faculty}</Text>
                            </View>
                        </View>
                        <View style={styles.rowContainer}>
                            <View style={styles.fieldNameContainer}>
                                <Text style={styles.fieldName}>Year:</Text>
                            </View>
                            <View style={styles.valueContainer}>
                                <Text style={styles.value}>{user.year}</Text>
                            </View>
                        </View>
                        {user.joinedCCAs && user.joinedCCAs.length > 0 && (
                            <View style={styles.rowContainer}>
                                <View style={styles.fieldNameContainer}>
                                    <Text style={styles.fieldName}>Joined CCAs:</Text>
                                </View>
                                <View style={styles.valueContainer}>
                                    <Text style={styles.value}>{user.joinedCCAs.join(', ')}</Text>
                                </View>
                            </View>
                            )
                        }
                        {user.managedCCAs && user.managedCCAs.length > 0 && (
                            <View style={styles.rowContainer}>
                                <View style={styles.fieldNameContainer}>
                                    <Text style={styles.fieldName}>Managed CCAs:</Text>
                                </View>
                                <View style={styles.valueContainer}>
                                    <Text style={styles.value}>{user.managedCCAs.join(', ')}</Text>
                                </View>
                            </View>
                            )
                        }
                    </View>
                    </View>
                </View>
            </ScrollView>
            <View style={styles.bottomContainer}>
                <DangerButton text="Delete User" fontSize={20} pressHandler={onDeleteHandler} />
            </View>
            </WithLoading>
            <DeleteUserModal isModalVisible={showModal} closeModal={closeModalHandler} cancelHandler={closeModalHandler} confirmHandler={confirmDeleteHandler} userID={_id} />
        </SafeAreaView>
    )
}
