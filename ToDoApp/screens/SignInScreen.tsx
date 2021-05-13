import React, { useEffect, useState } from 'react'
import { TextInput, Pressable, Alert } from 'react-native'
import { View, Text } from '../components/Themed'
import { useNavigation } from '@react-navigation/native'
import { useMutation, gql } from '@apollo/client'
import AsyncStorage from '@react-native-async-storage/async-storage'

const SIGN_IN_MUTATION = gql`
mutation signIn($email: String!, $password: String!){
    signIn(input: { email: $email, password: $password }) {
      token
      user {
        id
        name
        email
      }
    }
  }
`;

const SignInScreen = () => {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const navigation = useNavigation()
    // mutation[0] : A function to trigger the mutation
    // mutation[1] : result object
    //   { data, error, loading }
    const [signIn, { data, loading }] = useMutation(SIGN_IN_MUTATION);

    if (data) {
        AsyncStorage.setItem('token', data.signIn.token)
            .then(() => {
                setEmail('')
                setPassword('')
                navigation.navigate('Home')
            })
    }

    const onSubmit = () => {
        signIn({ variables: { email, password } })
    }

    return (
        <View>
            <TextInput
                placeholder='Email'
                placeholderTextColor='white'
                value={email}
                onChangeText={setEmail}
                style={{
                    color: 'white',
                    fontSize: 18,
                    width: '100%',
                    marginVertical: 25
                }}
            />
            <TextInput
                placeholder='Password'
                placeholderTextColor='white'
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                style={{
                    color: 'white',
                    fontSize: 18,
                    width: '100%',
                    marginVertical: 25
                }}
            />

            <Pressable
                onPress={onSubmit}
                disabled={loading}
                style={{
                    backgroundColor: '#e33062',
                    height: 50,
                    borderRadius: 5,
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginTop: 30
                }}
            >
                <Text style={{ fontSize: 18, fontWeight: 'bold' }}>Sign In</Text>
            </Pressable>
            <Pressable
                onPress={() => navigation.navigate('SignUp')}
                style={{
                    height: 50,
                    borderRadius: 5,
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginTop: 30
                }}
            >
                <Text style={{ fontSize: 18, fontWeight: 'bold', color: '#e33062' }}>New here? Sign Up</Text>
            </Pressable>
        </View>
    )
}

export default SignInScreen
