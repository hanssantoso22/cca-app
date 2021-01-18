import React, { useState } from 'react'
import { ScrollView, View, Text, StyleSheet, SafeAreaView } from 'react-native'
import { useFonts, Lato_700Bold, Lato_400Regular } from '@expo-google-fonts/lato'
import { page, marginHorizontal, GREY } from '../../../components/common/styles'
import SubNavbar from '../../../components/common/navigation/navbar/SubNavbar'
import DangerButton from '../../../components/common/buttons/DangerBig'
import DeleteUserModal from './DeleteUserModal'

export default function UserList (props) {
    const [isLoaded] = useFonts({Lato_700Bold, Lato_400Regular})
    const loaded = isLoaded
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
        },
        valueContainer: {
            flex: 2,
            paddingLeft: 15,
        },
    })
    const userList = [
        {id: 0, fname: 'Laurensius Hans Santoso 1', year:'4', faculty: 'EEE', email: 'dummy1@e.ntu.edu.sg', role: 'student', managedCCAs: ['EEE Club','MLDA @EEE'], joinedCCAs: []},
        {id: 1, fname: 'Hans', year:'4', faculty: 'EEE', email: 'dummy1@e.ntu.edu.sg', role: 'student'},
        {id: 2, fname: 'Laurensius Hans Santoso 3', year:'4', faculty: 'EEE', email: 'dummy1@e.ntu.edu.sg', role: 'student'},
        {id: 3, fname: 'Laurensius Hans Santoso 4', year:'4', faculty: 'EEE', email: 'dummy1@e.ntu.edu.sg', role: 'student'}
    ]
    const { id } = props.route.params
    let user = userList.filter((user) => user.id == id)
    user = user[0]
    const onBackPress = () => {
        props.navigation.goBack()
    }
    const onDeleteHandler = () => {
        setShowModal(true)
    }
    const closeModalHandler = () => {
        setShowModal(false)
    }
    const confirmDeleteHandler = (userID) => {
        setShowModal(false)
        props.navigation.goBack()
    }
    return (
        <SafeAreaView style={page.main}>
            <SubNavbar title={user.fname} pressed={onBackPress} />
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
                                    <Text>{user.joinedCCAs.join(', ')}</Text>
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
            <DeleteUserModal isModalVisible={showModal} closeModal={closeModalHandler} cancelHandler={closeModalHandler} confirmHandler={confirmDeleteHandler} userID={id} />
        </SafeAreaView>
    )
}
