import React from 'react'
import styles from './styles'
import { Text, View } from '../Themed';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Pressable } from 'react-native';
import { useNavigation } from '@react-navigation/native'

interface ProjectItemProps {
    project: {
        id: string,
        title: string,
        createdAt: string,
        progress: number
    }
}

const time = (createdAt) => {
    let millis = (Date.now() - Date.parse(createdAt))
    if (millis >= 86400000) {
        return `${(millis / 86400000).toFixed(0)} days`
    } else if ((millis < 86400000) && (millis >= 3600000)) {
        return `${(millis / 3600000).toFixed(0)} hours`
    } else {
        return `${(millis / 60000).toFixed(0)} mins`
    }
}

const ProjectItem = ({ project }: ProjectItemProps) => {
    const navigation = useNavigation()
    const onPress = () => {
        navigation.navigate('ToDoScreen', { id: project.id })
    }

    return (
        <Pressable onPress={onPress}>
            <View style={styles.root}>
                <View style={styles.iconContainer}>
                    <MaterialCommunityIcons name="file-outline" size={24} color="grey" />
                </View>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <Text style={styles.title}>{project.title}</Text>
                    <Text style={styles.time}>{time(project.createdAt)}</Text>
                    <View style={{
                        width: `${project.progress}%`,
                        borderColor: 'limegreen',
                        borderWidth: 1,
                        position: 'absolute',
                        top: '90%'
                    }}></View>
                </View>
            </View>
        </Pressable>
    )
}

export default ProjectItem
