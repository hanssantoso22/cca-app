import { StyleSheet } from 'react-native'

export const PURPLE = ['#E5CAFE','#CB95FD','#B061FB','#962CFA','#7C05EB','#6004B6','#440381']
export const MING = ['#D6EFF2','#ADDFE6','#84CFD9','#5CC0CC','#39AAB9','#2D8590','#205F67']
export const RED = ['#F8DADD','#F2B5BB','#EB9099','#E46A76','#DE4554','#D12637','#AC1F2D']
export const GREEN = ['#D4FFEE','#88FECC','#4CFDB3','#11FC9A','#02CE79','#029356','#015733']
export const GREY = ['#F2F2F2','#D6D5D5','#AEAEAE','#929292','#777777','#5C5C5C','#414141']


export const page = StyleSheet.create ({
    main: {
        backgroundColor: '#F2F2F2',
        paddingTop: 15,
        paddingBottom: 15,
        paddingLeft: 10,
        paddingRight: 10,
        height: '100%'
    },
    modal: {
        backgroundColor: 'white',
        margin: '20px 10px', 
    }
})

export const card = StyleSheet.create ({
    basic: {
        backgroundColor: 'white',
        borderRadius: 15,
        padding: '10px',
        marginBottom: '15px'
    },
})

export const font = StyleSheet.create ({
    articleTitle: {
        fontSize: 24,
        lineHeight: 30,
        color: GREY[6]
    },
    articleBody: {
        fontSize: 16,
        lineHeight: 25,
        color: GREY[6],
        letterSpacing: 2
    },
})

// export const shadow = StyleSheet.create ({
//     big: {

//     },
//     medium: {

//     },
//     small: {

//     }
// })


export const button = StyleSheet.create ({
    primary: {
        borderRadius: 10,
        padding: '10px 15px',
        backgroundColor: PURPLE[5],
        color: 'white'
    },
    secondary: {
        borderRadius: 10,
        padding: '10 15',
        backgroundColor: 'transparent',
        borderWidth: 1, 
        borderColor: '#6004B6',
        color: PURPLE[5]
    },
    dangerPrimary: {
        borderRadius: 10,
        padding: '10px 15px',
        backgroundColor: RED[6],
        color: 'white'
    },
    dangerSecondary: {
        borderRadius: 10,
        padding: '10px 15px',
        backgroundColor: 'transparent',
        borderWidth: 1,
        borderColor: '#AC1F2D',
        color: RED[6]
    }
})

export const checkboxCard = StyleSheet.create ({
    inactive: {
        backgroundColor: 'white',
        borderWidth: 1,
        borderRadius: 15,
        borderColor: GREY[2],
        color: GREY[5],
        padding: '10px',
        marginBottom: '10px'
    },
    active: {
        backgroundColor: MING[1],
        borderWidth: 1,
        borderRadius: 15,
        borderColor: MING[4],
        color: MING[6],
        padding: '10px',
        marginBottom: '10px',
        shadowColor: 'black',
        shadowOpacity: 0.08,
        shadowOffset: {width: 3, height: 4},
        shadowRadius: 10,
        elevation: 2,
    }
})