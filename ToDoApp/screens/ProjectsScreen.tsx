import React, { useEffect, useState } from 'react'
import { StyleSheet, FlatList, Alert, Modal, Pressable, View as NormalView, TextInput } from 'react-native'
import ProjectItem from '../components/Projectitem'
import { View } from '../components/Themed'
import { useQuery, gql, useMutation } from '@apollo/client'
import { Ionicons, MaterialIcons } from '@expo/vector-icons'

const MY_PROJECTS = gql`
query myTaskLists {
  myTaskLists {
    id
    title
    createdAt
    progress
  }
}
`

const CREATE_TASKLIST = gql`
mutation createTaskList($title: String!){
  createTaskList(title: $title) {
    id
  }
}
`

export default function ProjectsScreen() {
  const [modalVisible, setModalVisible] = useState(false)
  const [projects, setProjects] = useState([])
  const [text, onChangeText] = useState('')

  const { data, error, refetch } = useQuery(MY_PROJECTS)
  const [createTaskList, { data: newData }] = useMutation(CREATE_TASKLIST)
  const func = async () => await refetch()

  useEffect(() => {
    if (error) Alert.alert('Error fetching projects: ', error.message)
  }, [error])

  useEffect(() => {
    if (data) {
      setProjects(data.myTaskLists)
    }
  }, [data])

  useEffect(() => {
    if (newData) {
      func()
    }
  }, [newData])

  return (
    <View style={styles.container}>
      <FlatList
        data={projects}
        renderItem={({ item }) => (<ProjectItem project={item} />)}
        style={{ width: '100%' }}
      />
      <Pressable
        onPress={() => { setModalVisible(true) }}>
        <Ionicons name="add-circle" size={68} color="white" />
      </Pressable>

      <Modal
        style={{ flex: 1 }}
        transparent={true}
        visible={modalVisible}>
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <NormalView style={styles.innerModal}>
              <TextInput
                style={styles.innerTextInput}
                onChangeText={text => onChangeText(text)}
                value={text}
                placeholder={'Name of the new Tasklist'}
                textAlign={'center'}
              />
            </NormalView>

            <NormalView style={styles.innerBtns}>
              <Pressable onPress={() => { setModalVisible(!modalVisible) }}>
                <MaterialIcons name="cancel" size={50} color="black" />
              </Pressable>

              <Pressable onPress={() => {
                createTaskList({ variables: { title: text } })
                setModalVisible(!modalVisible)
              }}>
                <MaterialIcons name="create" size={50} color="black" />
              </Pressable>
            </NormalView>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22,
    width: '100%'
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  innerModal: {
    display: 'flex',
    flexDirection: 'row',
    width: '100%'
  },
  innerBtns: {
    display: 'flex',
    width: '100%',
    height: 50,
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    marginTop: 50
  },
  innerTextInput: {
    display: 'flex',
    width: '100%',
    height: 50,
    flexDirection: 'row',
    borderColor: 'gray',
    borderWidth: 1,
    fontSize: 20
  }
});
