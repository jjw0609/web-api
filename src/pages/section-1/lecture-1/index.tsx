import { useEffect, useState } from 'react';
import { z } from 'zod';

// User schema and type declaration
const UserSchema = z.object({
  id: z.number(),
  name: z.string(),
});
type User = z.infer<typeof UserSchema>;

export default function WhyShouldWeLearnWebApi() {
  /** setInterval */
  const [count, setCount] = useState(0);
  const [intervalId, setIntervalId] = useState<
    number | null
  >(null);

  useEffect(() => {
    const intervalId = setInterval(() => {
      console.log('Count increases by 1 every second!');
      setCount((prevCount) => prevCount + 1);
    }, 1000);

    setIntervalId(intervalId);

    return () => {
      clearInterval(intervalId);
    };
  }, []);

  /** fetch */
  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    (async () => {
      const response = await fetch(
        'https://jsonplaceholder.typicode.com/users',
      );
      const data = await response.json();
      const parsed = z.array(UserSchema).safeParse(data);
      if (parsed.success) {
        setUsers(parsed.data);
      }
    })();
  }, []);

  return (
    <div>
      <h1>Web API Example</h1>

      <h2>setInterval</h2>
      <p>Count increasing every second: {count}</p>
      <p>setInterval ID: {intervalId}</p>

      <h2>fetch</h2>
      <ul>
        {users.map((user) => (
          <li key={user.id}>{user.name}</li>
        ))}
      </ul>
    </div>
  );
}
