import React, {useEffect, useState} from 'react'
import { useFocusEffect } from '@react-navigation/native'
import Navbar from '../../components/common/navigation/navbar/navbar'
import { page, PURPLE, marginHorizontal } from '../../components/common/styles'
import { SafeAreaView, View, StyleSheet, Text, Alert } from 'react-native'
import { Agenda } from 'react-native-calendars'
import { useFonts, Lato_400Regular, Lato_700Bold, Lato_400Regular_Italic } from '@expo-google-fonts/lato'
import moment from 'moment'
import { TouchableWithoutFeedback } from 'react-native-gesture-handler'

import axios from 'axios'
import {URL, authenticate} from '../../api/config'
import store from '../../redux/store/store'

export default function reminders (props) {
    const [importantDates, setImportantDates] = useState({})
    const [isLoaded] = useFonts({Lato_400Regular, Lato_700Bold, Lato_400Regular_Italic})
    const onMenuPress = () => {
        props.navigation.openDrawer()
    }
    const styles = StyleSheet.create({
        calendar: {
          marginBottom: 10,
        },
        text: {
          textAlign: 'center',
          padding: 10,
          backgroundColor: 'lightgrey',
          fontSize: 16,
        },
        item: {
            flex: 1,
            borderRadius: 5,
            padding: 10,
            marginRight: 10,
            marginTop: 17
        },
        eventName: {
            fontFamily: 'Lato_700Bold',
            fontSize: 15,
            marginBottom: 1,
        },
        organizer: {
            fontFamily: 'Lato_400Regular_Italic',
            fontSize: 12, 
            marginBottom: 7
        },
        eventTime: {
            fontFamily: 'Lato_400Regular',
            fontSize: 13, 
        },
        emptyDate: {
            height: 15,
            flex:1,
            paddingTop: 30
        }
      });
    const today = moment().format('YYYY-MM-DD')
    const timeToString = (time) => {
        const date = new Date(time)
        return date.toISOString().split('T')[0]
    }
    const getContrast = (hexcolor) => {

        // If a leading # is provided, remove it
        if (hexcolor.slice(0, 1) === '#') {
            hexcolor = hexcolor.slice(1);
        }
    
        // Convert to RGB value
        var r = parseInt(hexcolor.substr(0,2),16);
        var g = parseInt(hexcolor.substr(2,2),16);
        var b = parseInt(hexcolor.substr(4,2),16);
    
        // Get YIQ ratio
        var yiq = ((r * 299) + (g * 587) + (b * 114)) / 1000;
    
        // Check contrast
        return (yiq >= 128) ? 'black' : 'white';
    
    };
    const loadItems = () => {
        for (let i = -15; i < 85; i++) {
            const time = Date.now() + i * 24 * 60 * 60 * 1000;
            const strTime = timeToString(time);
            if (!importantDates[strTime]) {
                importantDates[strTime] = [];
            }
        }
    }
    loadItems()
    
    const renderItem = (item) => {
        return (
            <TouchableWithoutFeedback
            style={[styles.item, {height: item.height}, {backgroundColor: item.color}]} 
            onPress={() => props.navigation.navigate('ReminderDetails',{eventID: item.id})}
            >
                <Text ellipsizeMode='tail' numberOfLines={1} style={{...styles.eventName, color: getContrast(item.color)}}>{item.name}</Text>
                <Text ellipsizeMode='tail' numberOfLines={1} style={{...styles.organizer, color: getContrast(item.color)}}>by {item.organizer}</Text>
                <Text ellipsizeMode='tail' numberOfLines={1} style={{...styles.eventTime, color: getContrast(item.color)}}>{`${item.startTime} - ${item.endTime}`}</Text>
            </TouchableWithoutFeedback>
        );
    }
    useFocusEffect (() => {
        async function loadReminders () {
            try {
                const res = await axios.get(`${URL}/users/reminders`, authenticate(store.getState().main.token))
                setImportantDates(res.data)
            } catch (err) {
                Alert.alert('Loading reminders failed')
            }
        }
        loadReminders()
    },[])
    return (isLoaded &&
        <SafeAreaView style={page.main}>
            <Navbar title="Reminders" pressed={onMenuPress}/>
            <View style={{...page.main, paddingHorizontal: marginHorizontal}}>
                <Agenda
                        style={styles.calendar}
                        hideExtraDays
                        enableSwipeMonths={true}
                        minDate={today}
                        items={importantDates}
                        renderItem={renderItem}
                        theme={{
                            agendaTodayColor: PURPLE[5],
                        }}
                />
            </View>
        </SafeAreaView>
    )
}