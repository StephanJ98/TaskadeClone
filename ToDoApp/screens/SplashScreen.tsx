import React, { useEffect } from 'react'
import { View, Text, ActivityIndicator } from 'react-native'
import { useNavigation } from '@react-navigation/native'
import AsyncStorage from '@react-native-async-storage/async-storage'

const SplashScreen = () => {
    const navigation = useNavigation()

    useEffect(() => {
        const checkUser = async () => {
            if (await isAuthenticared()) {
                navigation.navigate('Home')
            } else {
                navigation.navigate('SignIn')
            }
        }

        checkUser()
    }, [])

    const isAuthenticared = async () => {
        //await AsyncStorage.removeItem('token')
        const token = await AsyncStorage.getItem('token')
        return !!token
    }

    return (
        <View style={{
            flex: 1,
            justifyContent: 'center'
        }}>
            <ActivityIndicator size="large" color='#999999' />
        </View>
    )
}

export default SplashScreen
