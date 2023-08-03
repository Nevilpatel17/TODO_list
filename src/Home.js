import React, {useEffect, useState} from 'react';
import {
  StyleSheet,
  SafeAreaView,
  View,
  TextInput,
  Text,
  FlatList,
  TouchableOpacity,
  Alert,
  Image,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
const COLORS = {primary: '#A8A196', white: '#fff'};

const Home = () => {
  const [todos, setTodos] = useState([]);
  const [textInput, setTextInput] = useState('');
  const [editIndex, setEditIndex] = useState(0);
  const [id, setID] = useState(1);

  useEffect(() => {
    getData();
  }, []);

  useEffect(() => {
    saveData(todos);
  }, [todos]);

  // List and Update value function

  const addTodo = () => {
    if (textInput == '') {
      Alert.alert('Error', 'Please input todo');
    } else if (editIndex == 1) {
      setTextInput('');
      setEditIndex(0);
      setTodos(
        todos.map(item => {
          if (item.id == id) {
            return {...item, task: textInput};
          }
          return item;
        }),
      );
    } else {
      const newTodo = {
        id: Math.random(),
        task: textInput,
        completed: false,
      };
      setTodos([...todos, newTodo]);
      setTextInput('');
    }
  };

  // Data save in Async storage using setItem

  const saveData = async todos => {
    try {
      const stringifyTodos = JSON.stringify(todos);
      await AsyncStorage.setItem('todos', stringifyTodos);
    } catch (error) {
      console.log(error);
    }
  };

  // Data get from Async storage and using getItem method

  const getData = async () => {
    try {
      const todos = await AsyncStorage.getItem('todos');
      if (todos != null) {
        setTodos(JSON.parse(todos));
      }
    } catch (error) {
      console.log(error);
    }
  };

  // Todo List Complete when click on done button

  const doneTodo = todoId => {
    const newTodosItem = todos.map(item => {
      if (item.id == todoId) {
        return {...item, completed: true};
      }
      return item;
    });

    setTodos(newTodosItem);
  };

  // Delete the TODO from List

  const deleteTodo = todoId => {
    const newTodosItem = todos.filter(item => item.id != todoId);
    setTodos(newTodosItem);
  };

  // set the value in textinput

  const handleEdit = async e => {
    const stringifyTodos = JSON.stringify(e?.id);
    await AsyncStorage.setItem('Edit_Id', stringifyTodos);

    let new_data = todos.find(item => {
      return item.id === e.id;
    });
    setTextInput(new_data.task);
    setEditIndex(1);
    setID(e?.id);
  };

  // List_item is one container to show the list of todo

  const ListItem = ({todo}) => {
    return (
      <View style={styles.listItem}>
        {/* Display list from todo  */}

        <View style={{flex: 1}}>
          <Text
            style={{
              fontWeight: 'bold',
              fontSize: 15,
              color: COLORS.primary,
              textDecorationLine: todo?.completed ? 'line-through' : 'none',
            }}>
            {todo?.task}
          </Text>
        </View>

        {/* Done, edit, delete button  */}

        {!todo?.completed && (
          <TouchableOpacity onPress={() => doneTodo(todo.id)}>
            <View style={[styles.actionIcon, {backgroundColor: 'green'}]}>
              <Text
                style={{color: 'white', alignItems: 'center', fontSize: 10}}>
                Done
              </Text>
            </View>
          </TouchableOpacity>
        )}

        <TouchableOpacity onPress={() => handleEdit(todo)}>
          <View style={[styles.actionIcon, {backgroundColor: 'orange'}]}>
            <Text style={{color: 'white', fontSize: 10, alignItems: 'center'}}>
              Edit
            </Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => deleteTodo(todo.id)}>
          <View style={styles.actionIcon}>
            <Text style={{color: 'white', fontSize: 10, alignItems: 'center'}}>
              Delete
            </Text>
          </View>
        </TouchableOpacity>
      </View>
    );
  };
  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: 'white',
      }}>

      {/* Header code */}


      <View style={styles.header}>
        <Text
          style={{
            fontWeight: 'bold',
            fontSize: 25,
            color: 'green',
          }}>
          TODO APP
        </Text>
        <Image
          style={{height: 50, width: 50, borderRadius: 50}}
          source={{
            uri: 'https://cdn.octopix.in/uploads/company-logo/2019/08/05/shiv-technolabs-pvt-ltd-h30FXdtGV9E48JujbUeA0BLxuxM722XaMKmNXXr8fubFEQx9GEn84LuuAmtWQrV9baY2etALUeGncZFS-350x350.jpg',
          }}
        />
      </View>
      <View
        style={{
          width: '95%',
          height: 1,
          backgroundColor: 'black',
          alignSelf: 'center',
        }}
      />


        {/* Show List from Todos */}


      <FlatList
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{padding: 20, paddingBottom: 100}}
        data={todos}
        renderItem={({item}) => <ListItem todo={item} />}
      />


      {/* footer */}

      <View style={styles.footer}>
        <View style={styles.inputContainer}>
          <TextInput
            value={textInput}
            style={{color: 'black'}}
            placeholder="Add Todo"
            onChangeText={text => setTextInput(text)}
            editable={true}
          />
        </View>
        <TouchableOpacity onPress={addTodo}>
          <View style={styles.iconContainer}>
            {editIndex == 0 ? (
              <Text style={{alignSelf: 'center', color: 'white', fontSize: 12}}>
                ADD
              </Text>
            ) : (
              <Text style={{alignSelf: 'center', color: 'white', fontSize: 12}}>
                UPDATE
              </Text>
            )}
          </View>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  footer: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    backgroundColor: COLORS.white,
  },
  inputContainer: {
    height: 50,
    paddingHorizontal: 20,
    elevation: 40,
    backgroundColor: COLORS.white,
    flex: 1,
    marginVertical: 20,
    marginRight: 20,
    borderRadius: 30,
    borderWidth: 1,
    borderColor: 'gray',
  },
  iconContainer: {
    height: 50,
    width: 60,
    backgroundColor: COLORS.primary,
    elevation: 40,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
  },

  listItem: {
    padding: 20,
    backgroundColor: COLORS.white,
    flexDirection: 'row',
    elevation: 12,
    borderRadius: 7,
    marginVertical: 10,
  },
  actionIcon: {
    height: 25,
    width: 35,
    backgroundColor: COLORS.white,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'red',
    marginLeft: 5,
    borderRadius: 3,
  },
  header: {
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
});

export default Home;
