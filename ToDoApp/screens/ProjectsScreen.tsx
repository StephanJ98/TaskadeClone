import React, { useEffect, useState } from 'react';
import { StyleSheet, FlatList, Alert } from 'react-native';
import ProjectItem from '../components/Projectitem';
import { View } from '../components/Themed';
import { useQuery, gql } from '@apollo/client'

const MY_PROJECTS = gql`
query myTaskLists {
  myTaskLists {
    id
    title
    createdAt
  }
}
`

export default function ProjectsScreen() {
  const [projects, setProjects] = useState([])

  const { data, error, loading } = useQuery(MY_PROJECTS)

  useEffect(() => {
    if (error) Alert.alert('Error fetching projects:', error.message)
  }, [error])

  useEffect(() => {
    if (data) {
      setProjects(data.myTaskLists)
    }
  }, [data])

  return (
    <View style={styles.container}>
      <FlatList
        data={projects}
        renderItem={({ item }) => (<ProjectItem project={item} />)}
        style={{ width: '100%' }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  }
});
