import {Platform} from 'react-native'
// export const URL = Platform.OS === 'ios' ? 'http://localhost:5000': 'http://10.0.2.2:5000'
export const URL = 'http://54.179.18.138:5000'
export const gapiURL = 'https://www.googleapis.com'
export const gapiKey = 'AIzaSyCy8obSs2LdvaWPzSlTlUnKyLEsXTwo284'
export const authenticate = token => ({headers: {Authorization: `Bearer ${token}`}})
export const googleConfig = {
    iosClientId: '856797183267-cn0u1ii7dfgfgd5ct4e750mh9egfpjbs.apps.googleusercontent.com',
    androidClientId: '856797183267-lm7gol3iob0h2698mun4igll6fcdj5hl.apps.googleusercontent.com',
    scopes: [`${gapiURL}/auth/calendar`,`${gapiURL}/auth/calendar.readonly`,`${gapiURL}/auth/calendar.events`]
}