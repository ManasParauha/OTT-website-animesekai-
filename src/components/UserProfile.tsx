'use client';

import Image from 'next/image';
import { useEffect, useState } from 'react';


interface User {
    _id: string;
    username:string,
    photo:string
}

export default function UserProfile({ userId } : { userId: string }) {
  const [user, setUser] = useState<User | null>(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Fetch user details from the API
    const fetchUserDetails = async () => {
      try {
        const response = await fetch(`/api/users/me/${userId}`);
        if (!response.ok) {
          throw new Error('Failed to fetch user details');
        }
        const data = await response.json();
        setUser(data); // Set the fetched user data
      } catch (err:any) {
        setError(err.message); // Set the error message
      }
    };

    fetchUserDetails();
  }, [userId]);

  if (error) return <p>{error}</p>;
  if (!user) return <p>Loading...</p>;

  return (
    <div className='flex flex-col gap-2 items-center'>
      <Image src={user.photo} alt={user.username} width={30} height={30} className='rounded-full' />
      <h1 className=' text-sm font-light'>{user.username}</h1>
      {/* Display other user details as needed */}
    </div>
  );
}
