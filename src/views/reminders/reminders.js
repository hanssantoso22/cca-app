import React from 'react';
import Navbar from '../../components/common/navigation/navbar/navbar'
import { page, PURPLE, MING, marginHorizontal } from '../../components/common/styles'
import { SafeAreaView, View, StyleSheet, Text } from 'react-native'
import { Calendar, Agenda } from 'react-native-calendars'
import moment from 'moment'
import { TouchableWithoutFeedback } from 'react-native-gesture-handler';

export default function reminders (props) {
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
            backgroundColor: 'white',
            flex: 1,
            borderRadius: 5,
            padding: 10,
            marginRight: 10,
            marginTop: 17
        },
        emptyDate: {
            height: 15,
            flex:1,
            paddingTop: 30
        }
      });
    const today = moment().format('YYYY-MM-DD')
    const importantDates = {
        '2020-11-06': [{id: 0,name: 'Test', height: 80, time: '09:00'},{id:1, name: 'Test3', height: 80, time: '09:00'}],
        '2020-11-08': [{id: 2,name: 'Test2', height: 80, time: '09:00'}],
    }
    const timeToString = (time) => {
        const date = new Date(time)
        return date.toISOString().split('T')[0]
    }
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
            style={[styles.item, {height: item.height}]} 
            onPress={() => props.navigation.navigate('ReminderDetails',{eventID: item.id})}
            >
                <Text>{item.name}</Text>
            </TouchableWithoutFeedback>
        );
    }

    return (
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