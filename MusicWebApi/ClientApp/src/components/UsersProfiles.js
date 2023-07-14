import React, { useEffect, useState } from 'react';
import Header from '../components/Header';

function UsersProfiles() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await fetch('https://localhost:7104/api/user');
      if (!response.ok) {
        throw new Error('Failed to fetch users');
      }
      const data = await response.json();
      const Files = data.$values.map(item => item);
      setUsers(Files);
      console.log(Files)
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  return (
    <div>
    <Header />
    <div className="users-container">
      <h1>Users</h1>
      <div className="users-list">
        {users.map((user) => (
          <div key={user.id} className="user-item">
            <a href={`/profiles/${user.id}`} className="user-link">{user.name}</a>
          </div>
        ))}
      </div>
    </div>
  </div>
  );
}

export default UsersProfiles;
