import React from 'react';
import { page } from '../../components/common/styles'
import { SafeAreaView, StyleSheet, Button } from 'react-native'
import { useDispatch } from 'react-redux';
import { login } from '../../redux/reducers/mainSlice'

export default function Login (props) {
    const dispatch = useDispatch()
    const pressLogin = () => {
        dispatch(login())
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