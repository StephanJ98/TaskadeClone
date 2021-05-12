import React, { useState, useEffect, useRef } from 'react'
import { View, TextInput } from 'react-native'
import Checkbox from '../Checkbox';
import { MaterialIcons } from '@expo/vector-icons'
import { gql, useMutation } from '@apollo/client'

const UPDATE_TODO = gql`
mutation updateToDo($id: ID!,$content: String, $isCompleted: Boolean) {
  updateToDo(id:$id ,content:$content, isCompleted:$isCompleted){
    id
    content
    isCompleted
    
    taskList {
      title
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

const DELETE_TODO = gql`
mutation deleteToDo ($id: ID!){
  deleteToDo(id:$id)
}
`

interface ToDoItemProps {
  todo: {
    id: string;
    content: string;
    isCompleted: boolean;
  },
  onSubmit: () => void,
  onDelete: () => void
}

const ToDoItem = ({ todo, onSubmit, onDelete }: ToDoItemProps) => {
  const [isChecked, setIsChecked] = useState(false)
  const [content, setContent] = useState('')
  const input = useRef<any>(null)

  const [updateItem] = useMutation(UPDATE_TODO)
  const [deleteItem] = useMutation(DELETE_TODO, { onCompleted: () => onDelete()})

  useEffect(() => {
    if (!todo) { return }

    setIsChecked(todo.isCompleted);
    setContent(todo.content);
  }, [todo])

  useEffect(() => {
    if (input.current) {
      input?.current?.focus();
    }
  }, [input])

  const onKeyPress = async () => {
    await deleteItem({
      variables: {
        id: todo.id
      }
    })
  }

  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', marginVertical: 3 }}>
      {/* Checkbox */}
      <Checkbox
        isChecked={isChecked}
        onPress={async () => {
          await updateItem({
            variables: {
              id: todo.id,
              content,
              isCompleted: !isChecked
            }
          })
        }}
      />

      {/* Text Input */}
      <TextInput
        ref={input}
        value={content}
        onChangeText={setContent}
        style={{
          flex: 1,
          fontSize: 18,
          color: 'white',
          marginLeft: 12,
        }}
        onEndEditing={async () => {
          await updateItem({
            variables: {
              id: todo.id,
              content,
              isCompleted: isChecked
            }
          })
        }}
        multiline
        onSubmitEditing={onSubmit}
        blurOnSubmit
      />

      {/* Delete Button */}
      <MaterialIcons name="delete" size={24} color="white" onPress={() => onKeyPress()} />
    </View>
  )
}

export default ToDoItem
