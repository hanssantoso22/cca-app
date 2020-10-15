import React from 'react';
import { page, PURPLE, MING } from '../../components/common/styles'
import { View, StyleSheet, Text } from 'react-native'
import { Agenda } from 'react-native-calendars'
import moment from 'moment'
import { TouchableWithoutFeedback } from 'react-native-gesture-handler';

export default function reminders (props) {
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
        '2020-10-11': [{name: 'Test', height: 80, time: '09:00'},{name: 'Test3', height: 80, time: '09:00'}],
        '2020-10-15': [{name: 'Test2', height: 80, time: '09:00'}],
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
            onPress={() => Alert.alert(item.name)}
            >
                <Text>{item.name}</Text>
            </TouchableWithoutFeedback>
        );
    }

    return (
        <View style={page.main}>
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
    )
}