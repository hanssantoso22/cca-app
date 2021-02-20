import React, { useState } from 'react'
import { Text, StyleSheet, View } from 'react-native'
import Picker from 'react-native-picker-select'
import { GREY, MING } from '../styles'
import { useFonts, Lato_400Regular} from '@expo-google-fonts/lato'
import DropdownIcon from '../RNPicker/RNPickerIcon'
import { useLinkProps } from '@react-navigation/native'

export default function PickerInput ( { label, onValueChange, items, value } ) {
    const [isLoaded] = useFonts ({
        Lato_400Regular
    })
    const pickerSelectStyles = StyleSheet.create({
        inputIOS: {
            fontSize: 16,
            fontFamily: 'Lato_400Regular',
            color: GREY[5],
            paddingVertical: 13,
            paddingHorizontal: 10,
            borderRadius: 10,
            borderWidth: 1,
            marginBottom: 15,
            borderColor: GREY[2],
        }
    })
    const styles = StyleSheet.create({
        inputLabel: {
            fontSize: 13,
            fontFamily: 'Lato_400Regular',
            color: GREY[3],
            marginBottom: 5
        },
    })
    return (isLoaded &&
        <View>
            <Text style={styles.inputLabel}>{label}</Text>
            <Picker
                style={pickerSelectStyles}
                onValueChange={onValueChange}
                value={value}
                items={items}
                Icon={DropdownIcon}
            />
        </View>
    )
}