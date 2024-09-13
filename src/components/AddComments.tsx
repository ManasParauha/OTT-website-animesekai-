// components/Comments.tsx
'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';

interface Comment {
  _id: string;
  content: string;
  userId: string ;
  createdAt: string;
}

const AddComments = ({ hubId }: { hubId: string }) => {
  const [comments, setComments] = useState<Comment[]>([]); // Ensure the initial state is an array
  const [content, setContent] = useState('');
  const [error, setError] = useState<string | null>(null); // For error handling

  


  const [data, setData] = useState<string>("");
  useEffect(() => {
    const userDetails = async () => {
        const res = await axios.get('/api/users/me');
        console.log(res.data);
        setData(res.data.data._id)
    }

    userDetails()

    
  }, []);


  const handlePostComment = async () => {
    try {
      setError(null); // Reset error state
      const userId = data; // Replace with actual user ID
      const response = await axios.post('/api/users/hub/comments', { content, userId, hubId });
      setContent('');

      // Optionally update comments state without refetching
      setComments((prev) => [...prev, response.data]);
    } catch (error) {
      console.error('Error posting comment:', error);
      setError('Failed to post comment.');
    }
  };

  return (
    <div className="mt-4 w-full flex flex-col gap-2">
    
      
        <input
          type="text"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="flex-1 p-2 border rounded-md"
          placeholder="Add a comment..."
        />
        <button
          onClick={handlePostComment}
          className=" px-4 py-2 bg-blue-500 text-white rounded-md"
        >
          Post
        </button>
      </div>
  
  );
};

export default AddComments;
