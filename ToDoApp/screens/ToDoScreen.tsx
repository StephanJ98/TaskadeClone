import React, { useEffect, useState } from 'react'
import { Alert, FlatList, KeyboardAvoidingView, Platform, StyleSheet, TextInput, Text } from 'react-native'
import { MaterialIcons } from '@expo/vector-icons'
import ToDoItem from '../components/ToDoItem'
import { View } from '../components/Themed'
import { useQuery, gql, useMutation } from '@apollo/client'
import { useRoute } from '@react-navigation/native'

const GET_PROJECT = gql`
query getTaskLists($id: ID!) {
  getTaskList(id:$id) {
    id
    title
    createdAt
    todos {
      id
      content
      isCompleted
    }
  }
}
`

const CREATE_TODO = gql`
mutation createToDo($content: String!, $taskListId: ID!) {
  createToDo(content:$content, taskListId:$taskListId){
    id
    content
    isCompleted
    taskList {
      id
      progress
      todos {
        id
        content
        isCompleted
      }
    }
  }
}
`

export default function ToDoScreen() {
  const [_, setTitle] = useState('')
  const [project, setProject] = useState(null)
  const route = useRoute()
  const id = route.params.id

  const { data, error, refetch } = useQuery(GET_PROJECT, { variables: { id } })
  const [createTodo] = useMutation(CREATE_TODO)

  useEffect(() => {
    if (error) Alert.alert('Error fetching projects:', error.message)
  }, [error])

  useEffect(() => {
    if (data) {
      setProject(data.getTaskList)
      setTitle(data.getTaskList.title)
    }
  }, [data])

  const update = async () => {
    await refetch()
  }

  const createNewItem = async () => {
    await createTodo({
      variables: {
        content: '',
        taskListId: id
      }
    })
  }

  if (!project) return null

  function itemList() {
    if (project.todos.length !== 0) {
      return (
        <FlatList
          data={project.todos}
          renderItem={({ item }) => (<ToDoItem todo={item} onSubmit={() => createNewItem()} onDelete={() => update()} />)}
          style={{ width: '100%' }}
        />
      )
    } else {
      return (
        <MaterialIcons name="add-box" size={68} color="white" onPress={() => createNewItem()} />
      )
    }
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS === "ios" ? 130 : 100}
      style={{ flex: 1 }}
    >
      <View style={styles.container}>
        {itemList()}
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    padding: 12,
    justifyContent: 'center'
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
    width: '100%',
    marginBottom: 12
  },
});
