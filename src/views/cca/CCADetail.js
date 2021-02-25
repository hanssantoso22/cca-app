import React, { useState } from 'react'
import { useFocusEffect } from '@react-navigation/native'
import SubNavbar from '../../components/common/navigation/navbar/SubNavbar'
import WithLoading from '../../components/hoc/withLoading'
import { page, GREY, marginHorizontal, font } from '../../components/common/styles'
import { SafeAreaView, View, Text, StyleSheet, ScrollView, Image, Alert } from 'react-native'
import { useFonts, Lato_700Bold, Lato_400Regular, Lato_400Regular_Italic } from '@expo-google-fonts/lato'

import axios from 'axios'
import {URL, authenticate} from '../../api/config'
import store from '../../redux/store/store'

export default function CCADetailPage (props) {
    const [CCA, setCCA] = useState('')
    const [isLoading, setIsLoading] = useState(true)
    const [isLoaded] = useFonts({
        Lato_400Regular,
        Lato_400Regular_Italic,
        Lato_700Bold
    })
    const onBackPress = () => {
        props.navigation.goBack()
    }
    const { ccaID } = props.route.params
    const styles = StyleSheet.create ({
        imageWrapper: {
            marginTop: 5,
            marginBottom: 10,
            marginHorizontal: 30,
            alignItems: 'center',
            height: 'auto',
        },
        pageTitle: {
            fontFamily: 'Lato_700Bold',
            marginHorizontal: 30,
            marginBottom: marginHorizontal,
        },
        smallDetailsWrapper: {
            marginVertical: 5,
            paddingHorizontal: 30,
        },
        image: {
            flex: 1,
            resizeMode: 'contain',
            width: '100%',
            height: 300,
        },
        smallDetailsFont: {
            fontFamily: 'Lato_400Regular_Italic',
            fontSize: 13,
            color: GREY[3]
        },
        ccaBodyWrapper: {
            paddingHorizontal: 30,
        },
        ccaFont: {
            fontFamily: 'Lato_400Regular'
        },
    })
    useFocusEffect (() => {
        async function loadCCA () {
            try {
                const res = await axios.get(`${URL}/CCA/${ccaID}/detail`, authenticate(store.getState().main.token))
                setCCA(res.data)
                setIsLoading(false)
            } catch (err) {
                Alert.alert('Loading details error')
            }
        }
        loadCCA()
    },[])
    return (isLoaded &&
            <SafeAreaView style={page.main}>
                <SubNavbar title={CCA.ccaName} pressed={onBackPress} />
                <WithLoading isLoading={isLoading} loadingMessage='Loading details...'>
                <ScrollView>
                    <View style={page.main}>
                        <Text style={{...font.articleBody,...styles.pageTitle}}>{CCA.ccaName}</Text>
                        {/* <View style={styles.imageWrapper}>
                            <Image style={{...styles.image, height: CCA.image==null ? 0 : 300}} source={{uri: CCA.image}} />
                        </View> */}
                        <View style={styles.ccaBodyWrapper}>
                            <Text style={{...font.articleBody,...styles.ccaFont}}>
                                {CCA.description}
                            </Text>
                        </View>
                    </View>
                </ScrollView>
                </WithLoading>
            </SafeAreaView>
        
    )
}