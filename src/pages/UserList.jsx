import React, { useState, useEffect } from 'react';
import axios from 'axios';

function UserList() {
  const [users, setUsers] = useState([]);
  const API_URL = 'http://localhost:3000/v1/api/users';

  useEffect(() => {
    axios
      .get(API_URL)
      .then((response) => {
        setUsers(response.data);
      })
      .catch((error) => {
        console.error('Error fetching users:', error);
      });
  }, []);

  return (
    <div>
      <h1>Users</h1>
      <ul>
        {users.map((user) => (
          <div key={user._id}>
            <img src={user.image} alt={user.name} />
            <h2>{user.name}</h2>
            <p>{user.studentNumber}</p>
            <p>{user.email}</p>
            <button>Delete</button>
            <button>Edit</button>
          </div>
        ))}
      </ul>
    </div>
  );
}

export default UserList;
