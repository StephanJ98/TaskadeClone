import { ApolloClient, InMemoryCache, createHttpLink } from '@apollo/client'
import { setContext } from '@apollo/client/link/context'
import AsyncStorage from '@react-native-async-storage/async-storage'

const URI = 'https://todoapp-apollo-api.herokuapp.com/'

const httpLink = createHttpLink({
    uri: URI
})

const cache = new InMemoryCache({
    typePolicies: {
        TaskList: {
            fields: {
                todos: {
                    merge(existing = [], incoming: any[]) {
                        return [...incoming];
                    },
                }
            }
        },
        Query: {
            fields: {
                myTaskLists: {
                    merge(existing = [], incoming: any[]) {
                        return [...incoming];
                    },
                }
            }
        }
    }
})

const authLink = setContext(async (_, { headers }) => {
    const token = await AsyncStorage.getItem('token')
    return {
        headers: {
            ...headers,
            authorization: token || ''
        }
    }
})

export const client = new ApolloClient({
    link: authLink.concat(httpLink),
    cache: cache
})