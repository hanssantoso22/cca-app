import { StyleSheet } from 'react-native'

export const PURPLE = ['#E5CAFE','#CB95FD','#B061FB','#962CFA','#7C05EB','#6004B6','#440381']
export const MING = ['#D6EFF2','#ADDFE6','#84CFD9','#5CC0CC','#39AAB9','#2D8590','#205F67']
export const RED = ['#F8DADD','#F2B5BB','#EB9099','#E46A76','#DE4554','#D12637','#AC1F2D']
export const GREEN = ['#D4FFEE','#88FECC','#4CFDB3','#11FC9A','#02CE79','#029356','#015733']
export const GREY = ['#F2F2F2','#D6D5D5','#AEAEAE','#929292','#777777','#5C5C5C','#414141']

export const marginHorizontal = 15
export const marginHorizontalText = 30

export const page = StyleSheet.create ({
    main: {
        backgroundColor: '#F2F2F2',
        paddingVertical: 20,
        height: '100%',
    },
    modal: {
        backgroundColor: 'white',
        paddingVertical: 20,
        paddingHorizontal: 20,
        borderRadius: 10,
    }
})

export const font = StyleSheet.create ({
    articleTitle: {
        fontSize: 20,
        lineHeight: 30,
        color: GREY[6]
    },
    articleBody: {
        fontSize: 16,
        lineHeight: 25,
        color: GREY[6],
        letterSpacing: 1
    },
    link: {
        color: MING[5]
    }
})

export const button = StyleSheet.create ({
    primaryBig: {
        borderRadius: 8,
        paddingVertical: 12,
        width: '100%',
        backgroundColor: PURPLE[5],
        justifyContent: 'center',
        alignItems: 'center'
    },
    primaryBigDisabled: {
        borderRadius: 8,
        paddingVertical: 12,
        width: '100%',
        backgroundColor: GREY[1],
        justifyContent: 'center',
        alignItems: 'center'
    },
    primarySmall: {
        borderRadius: 5,
        paddingVertical: 8,
        width: '100%',
        backgroundColor: PURPLE[5],
        justifyContent: 'center',
        alignItems: 'center'
    },
    secondarySmall: {
        borderRadius: 5,
        paddingVertical: 8,
        width: '100%',
        backgroundColor: 'transparent',
        borderWidth: 1, 
        borderColor: PURPLE[5],
        justifyContent: 'center',
        alignItems: 'center'
    },
    dangerPrimaryBig: {
        borderRadius: 8,
        paddingVertical: 12,
        width: '100%',
        backgroundColor: RED[6],
        justifyContent: 'center',
        alignItems: 'center'
    },
    dangerSecondary: {
        borderRadius: 10,
        paddingVertical: 10,
        paddingHorizontal: 15,
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
        paddingHorizontal: 10,
        paddingVertical: 20,
        marginBottom: 10,
        flexDirection: 'row',
        minHeight: 50,
        marginBottom: 15,
    },
    active: {
        backgroundColor: MING[1],
        borderWidth: 1,
        borderRadius: 15,
        borderColor: MING[4],
        color: MING[6],
        paddingHorizontal: 10,
        paddingVertical: 20,
        marginBottom: 10,
        shadowColor: 'black',
        shadowOpacity: 0.08,
        shadowOffset: {width: 3, height: 4},
        shadowRadius: 10,
        elevation: 2,
        flexDirection: 'row',
        minHeight: 50,
        marginBottom: 15,
    }
})
export const RNPicker = StyleSheet.create({
    inputIOS: {
        borderRadius: 4,
        borderWidth: 1,
        borderColor: GREY[2],
        color: GREY[5],
        fontSize: 16,
        paddingHorizontal: 12,
        paddingVertical: 16,
        marginBottom: 20,
    },
})