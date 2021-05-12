import React, { useState } from 'react'
import { TextInput, Pressable, ActivityIndicator, Alert } from 'react-native'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { View, Text } from '../components/Themed'
import { useNavigation } from '@react-navigation/native'
import { useMutation, gql } from '@apollo/client'

const SIGN_UP_MUTATION = gql`
mutation signUp($email: String!, $password: String!, $name: String!) {
  signUp(input: {email: $email, password: $password, name: $name}){
    token
    user {
      id
      name
      email
    }
  }
}
`;

const SignUpScreen = () => {
    const [email, setEmail] = useState('')
    const [name, setName] = useState('')
    const [password, setPassword] = useState('')
    const navigation = useNavigation()
    // mutation[0] : A function to trigger the mutation
    // mutation[1] : result object
    //   { data, error, loading }
    const [signUp, { data, error, loading }] = useMutation(SIGN_UP_MUTATION);

    if (error) {
        Alert.alert('Error signing up, try again')
    }

    if (data) {
        AsyncStorage.setItem('token', data.signUp.token)
            .then(() => {
                navigation.navigate('Home')
            })
    }

    const onSubmit = () => {
        signUp({ variables: { name, email, password } })
    }

    return (
        <View>
            <TextInput
                placeholder='Name'
                placeholderTextColor='white'
                value={name}
                onChangeText={setName}
                style={{
                    color: 'white',
                    fontSize: 18,
                    width: '100%',
                    marginVertical: 25
                }}
            />
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
                style={{
                    backgroundColor: '#e33062',
                    height: 50,
                    borderRadius: 5,
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexDirection: 'row',
                    marginTop: 30
                }}
            >
                {loading && <ActivityIndicator color='#999999' />}
                <Text style={{ fontSize: 18, fontWeight: 'bold' }}>Sign Up</Text>
            </Pressable>
            <Pressable
                disabled={loading}
                onPress={() => navigation.navigate('SignIn')}
                style={{
                    height: 50,
                    borderRadius: 5,
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginTop: 30
                }}
            >
                <Text style={{ fontSize: 18, fontWeight: 'bold', color: '#e33062' }}>Already have an account? Sign In</Text>
            </Pressable>
        </View>
    )
}

export default SignUpScreen
