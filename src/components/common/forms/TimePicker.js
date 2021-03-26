import React, { useState } from 'react'
import { Text, StyleSheet, TextInput, View, Dimensions } from 'react-native'
import { GREY } from '../styles'
import { useFonts, Lato_400Regular} from '@expo-google-fonts/lato'
import DateTimePicker from '@react-native-community/datetimepicker'
import moment from 'moment'

export default function DateTimePickerInput ( { label, onChangeText, onChangePicker, mode, onFocus, showPicker, value, style } ) {
    const [isLoaded] = useFonts ({
        Lato_400Regular
    })
    const screenWidth = Dimensions.get('window').width
    const [containerBorderColor, setContainerBorderColor] = useState(GREY[2])
    const styles = StyleSheet.create({
        inputLabel: {
            fontSize: 13,
            fontFamily: 'Lato_400Regular',
            color: GREY[3],
            marginBottom: 5
        },
        inputContent: {
            fontSize: 16,
            fontFamily: 'Lato_400Regular',
            color: GREY[5],
        },
        textInputContainer:{
            paddingVertical: 13,
            paddingHorizontal: 10,
            borderRadius: 10,
            borderWidth: 1,
            marginBottom: 15,
        },
    })
    const timeParser = (dateObject) => {
        const dateString = dateObject.toString()
        const normalDate = moment(dateString).format('hh:mm A')
        return normalDate
    }
    return (isLoaded &&
        <View style={{...style}}>
            <Text style={styles.inputLabel}>{label}</Text>
                <TextInput 
                    style={{...styles.textInputContainer, ...styles.inputContent, borderColor: containerBorderColor}}
                    value={timeParser(value)}
                    onChangeText={onChangeText}
                    type='name'
                    onFocus={onFocus}
                />
                {showPicker && (
                    <DateTimePicker
                        testID="dateTimePicker"
                        value={new Date(value)}
                        mode={mode}
                        is24Hour={true}
                        display="default"
                        onChange={onChangePicker}
                        minuteInterval={15}
                    />
                )}
        </View>
    )
}