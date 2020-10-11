import React from 'react';
import { page } from '../../components/common/styles'
import { SafeAreaView, StyleSheet, Button } from 'react-native'
import { useDispatch, useSelector } from 'react-redux';
import { login } from '../../redux/reducers/mainSlice'
import store from '../../redux/store/store'

export default function Login (props) {
    const dispatch = useDispatch()
    const pressLogin = () => {
        dispatch(login())
        console.log(store.getState().main.isLoggedIn)
    }
    const createNewAccountHandler = () => {
        props.navigation.push('CreateAccount')
    }
    const styles = StyleSheet.create({
        mainContainer: {
            alignItems: 'center',
            justifyContent: 'center'
        }
    })
    return (
        <SafeAreaView style={styles.mainContainer}>
            <Button onPress={pressLogin} title="Login" />
            <Button onPress={createNewAccountHandler} title="Sign Up" />
        </SafeAreaView>
    )
}