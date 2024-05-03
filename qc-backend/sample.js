const users = [
    { username: 'john_doe', password: 'password123' },
    { username: 'jane_smith', password: 'securepassword' },
    { username: 'alice_johnson', password: '12345678' },
    { username: 'bob_brown', password: 'password' },
  ];
  
  const messages = [
    { sender: 'john_doe', receiver: 'jane_smith', body: 'Hello Jane!', timestamp: new Date('2024-05-01T08:00:00') },
    { sender: 'jane_smith', receiver: 'john_doe', body: 'Hi John! How are you?', timestamp: new Date('2024-05-01T08:05:00') },
    { sender: 'john_doe', receiver: 'jane_smith', body: 'I\'m good, thanks! How about you?', timestamp: new Date('2024-05-01T08:10:00') },
    { sender: 'jane_smith', receiver: 'john_doe', body: 'I\'m doing well too. Just busy with work.', timestamp: new Date('2024-05-01T08:15:00') },
  ];
  
  export default { users, messages };
  