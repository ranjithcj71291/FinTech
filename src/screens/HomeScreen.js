import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, VirtualizedList, Alert, Modal, TextInput } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import { logout } from '../store/actions/authActions';
import Loader from '../components/common/Loader';

const HomeScreen = () => {
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);
  const [users, setUsers] = useState([]);
  const [fetching, setFetching] = useState(true);
  const [isEditModalVisible, setEditModalVisible] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');

  const isNewUser = useSelector((state) => state.auth.isNewUser);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await axios.get('https://6691889926c2a69f6e900c11.mockapi.io/fintechUsers/users');
      setUsers(response.data);
    } catch (error) {
      console.error(error);
    } finally {
      setFetching(false);
    }
  };

  const handleLogout = async () => {
    setIsLoading(true);
    await dispatch(logout());
    setIsLoading(false);
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`https://6691889926c2a69f6e900c11.mockapi.io/fintechUsers/users/${id}`);
      setUsers(users.filter(user => user.id !== id));
    } catch (error) {
      console.error(error);
    }
  };

  const handleEdit = (user) => {
    setEditingUser(user);
    setName(user.name);
    setEmail(user.email);
    setEditModalVisible(true);
  };

  const saveEdit = async () => {
    try {
      const updatedUser = { ...editingUser, name };
      await axios.put(`https://6691889926c2a69f6e900c11.mockapi.io/fintechUsers/users/${editingUser.id}`, updatedUser);
      setUsers(users.map(user => (user.id === editingUser.id ? updatedUser : user)));
      setEditModalVisible(false);
      setEditingUser(null);
    } catch (error) {
      console.error(error);
    }
  };

  const renderItem = ({ item }) => (
    <View style={styles.userItem}>
      <Text>{item.name}</Text>
      <Text>{item.email}</Text>
      <View style={styles.userActions}>
        <TouchableOpacity onPress={() => handleEdit(item)} style={styles.editButton}>
          <Text>Edit</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => handleDelete(item.id)} style={styles.deleteButton}>
          <Text>Delete</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const getItem = (data, index) => data[index];
  const getItemCount = (data) => data.length;

  return (
    <View style={styles.container}>
      <View style={{ flexDirection: 'row' }}>
        <Text style={{ marginRight: 5 }}>You are,</Text>
        {isNewUser ? (
          <Text>New User</Text>
        ) : (
          <Text>Existing user</Text>
        )}
      </View>
      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        {isLoading ? <Loader /> : <Text>Logout</Text>}
      </TouchableOpacity>
      {fetching ? (
        <Loader />
      ) : (
        <VirtualizedList
          data={users}
          initialNumToRender={4}
          renderItem={renderItem}
          keyExtractor={item => item.id}
          getItemCount={getItemCount}
          getItem={getItem}
          style={styles.userList}
        />
      )}

      {isEditModalVisible && (
        <Modal
          animationType="slide"
          transparent={true}
          visible={isEditModalVisible}
          onRequestClose={() => {
            setEditModalVisible(!isEditModalVisible);
          }}
        >
          <View style={styles.modalView}>
            <TextInput
              style={styles.input}
              value={name}
              onChangeText={setName}
              placeholder="Name"
            />
            <TextInput
              style={styles.input}
              value={email}
              editable={false}
              placeholder="Email"
            />
            <TouchableOpacity
              style={styles.saveButton}
              onPress={saveEdit}
            >
              <Text style={styles.saveButtonText}>Update</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.cancelButton}
              onPress={() => setEditModalVisible(false)}
            >
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </Modal>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  logoutButton: {
    backgroundColor: 'orange',
    padding: 10,
    borderRadius: 5,
    marginTop: 20,
  },
  userList: {
    marginTop: 20,
    width: '100%',
  },
  userItem: {
    backgroundColor: '#f9f9f9',
    padding: 16,
    marginVertical: 8,
    borderRadius: 5,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  userActions: {
    flexDirection: 'row',
  },
  editButton: {
    backgroundColor: 'blue',
    padding: 5,
    borderRadius: 5,
    marginRight: 10,
  },
  deleteButton: {
    backgroundColor: 'red',
    padding: 5,
    borderRadius: 5,
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
    shadowRadius: 4,
    elevation: 5,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 12,
    width: '100%',
    paddingHorizontal: 10,
    borderRadius: 5,
  },
  saveButton: {
    backgroundColor: 'green',
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
    width: '100%',
  },
  saveButtonText: {
    color: 'white',
    textAlign: 'center',
  },
  cancelButton: {
    backgroundColor: 'gray',
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
    width: '100%',
  },
  cancelButtonText: {
    color: 'white',
    textAlign: 'center',
  },
});

export default HomeScreen;
