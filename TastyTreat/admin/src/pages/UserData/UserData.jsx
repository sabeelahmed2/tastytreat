import { useEffect, useState } from 'react';

const UserData = ({ url }) => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch(url + '/api/user');
        if (!response.ok) {
          throw new Error('Failed to fetch users');
        }
        const data = await response.json();
        setUsers(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [url]);

  if (loading) return <p style={{ textAlign: 'center', padding: '2rem' }}>Loading user data...</p>;
  if (error) return <p style={{ textAlign: 'center', color: 'red', padding: '2rem' }}>Error: {error}</p>;

  return (
    <div style={{ padding: '40px', fontFamily: 'Segoe UI, sans-serif' }}>
      <h2 style={{ marginBottom: '20px', textAlign: 'center', fontSize: '2rem', color: '#333' }}>Registered Users</h2>
      <div style={{ overflowX: 'auto' }}>
        <table
          style={{
            width: '100%',
            borderCollapse: 'collapse',
            boxShadow: '0 0 10px rgba(0,0,0,0.1)',
            borderRadius: '8px',
            overflow: 'hidden'
          }}
        >
          <thead style={{ backgroundColor: '#FFE8E4', color: 'black' }}>
            <tr>
              <th style={{ padding: '12px' }}>Name</th>
              <th style={{ padding: '12px' }}>Email</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user, index) => (
              <tr
                key={user._id}
                style={{
                  backgroundColor: index % 2 === 0 ? '#f9f9f9' : '#fff',
                  transition: 'background 0.3s ease',
                  cursor: 'pointer'
                }}
                onMouseEnter={e => (e.currentTarget.style.backgroundColor = '#e0f7fa')}
                onMouseLeave={e =>
                  (e.currentTarget.style.backgroundColor = index % 2 === 0 ? '#f9f9f9' : '#fff')
                }
              >
                <td style={{ padding: '12px', textAlign: 'center' }}>{user.name}</td>
                <td style={{ padding: '12px', textAlign: 'center' }}>{user.email}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default UserData;
