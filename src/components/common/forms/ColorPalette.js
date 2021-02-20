import React, { useState } from 'react'
import ColorPalette from 'react-native-color-palette'
import { Text, StyleSheet, TextInput, View } from 'react-native'
import { GREY, MING } from '../styles'
import { useFonts, Lato_400Regular} from '@expo-google-fonts/lato'

export default function ({ onChange, value }) {
    const [isLoaded] = useFonts ({
        Lato_400Regular,
        'MaterialIcons-Regular': require('../../../assets/fonts/MaterialIcons-Regular.ttf')
    })
    const [showPicker, setShowPicker] = useState(false)
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
        container:{
            marginBottom: 15
        },
        hyperlink: {
            fontSize: 13,
            fontFamily: 'Lato_400Regular',
            color: MING[5],
            marginBottom: 5
        },
    })
    const colors = ['#039be5','#7986cb','#33b679','#8e24aa','#e67c73','#f6c026','#f5511d','#616161','#3f51b5','#0b8043','#d60000']
    return (isLoaded &&
        <View style={styles.container}>
            <View style={{flexDirection: 'row'}}>
                <Text style={styles.inputLabel}>Color (for calendar view):&nbsp;&nbsp;</Text>
                <Text style={styles.hyperlink} onPress={() => setShowPicker(!showPicker)}>{!showPicker ? 'Show color picker' : 'Hide color picker'}</Text>
            </View>
            {showPicker && (
                <ColorPalette
                    onChange={onChange}
                    value={value}
                    colors={colors}
                />
            )}
        </View>   
    )
}