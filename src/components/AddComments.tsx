'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';
import UserProfile from './UserProfile';

interface Comment {
  _id: string;
  content: string;
  userId: string;
  createdAt: string;
}

const AddComments = ({ hubId }: { hubId: string }) => {
  const [comments, setComments] = useState<Comment[]>([]); // Initialize as an empty array
  const [content, setContent] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [userId, setUserId] = useState<string>('');

  // Fetch user details to get user ID
  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const res = await axios.get('/api/users/me');
        setUserId(res.data.data._id);
      } catch (err) {
        console.error('Error fetching user details:', err);
      }
    };
    fetchUserDetails();
  }, []);

  // Fetch comments for the hub
  const fetchComments = async () => {
    try {
      const res = await axios.get(`/api/users/hub/${hubId}/comments`);
      setComments(Array.isArray(res.data.comments) ? res.data.comments : []); // Ensure res.data.comments is an array
    } catch (err) {
      console.error('Error fetching comments:', err);
    }
  };

  // Fetch comments when the component mounts
  useEffect(() => {
    fetchComments();
  }, []);

  // Handle posting a comment
  const handlePostComment = async () => {
    if (!content.trim()) {
      setError('Comment cannot be empty.');
      return;
    }
    try {
      setError(null);
      const response = await axios.post('/api/users/hub/comments', {
        content,
        userId,
        hubId,
      });
      setContent('');

      // Add the new comment to the state without refetching
      const newComment = response.data.comment; // Adjust this based on the actual response structure
      if (newComment) {
        setComments((prevComments) => (Array.isArray(prevComments) ? [...prevComments, newComment] : [newComment]));
      }
    } catch (error) {
      console.error('Error posting comment:', error);
      setError('Failed to post comment.');
    }
  };

  return (
    <div className="w-full flex flex-col gap-4">
      {error && <p className="text-red-500">{error}</p>}
      {/* Display the comments */}
      <div className="">
        {comments.map((comment) => (
          <div key={comment._id} className="flex items-center gap-4 md:gap-8   bg-background text-foreground">
            <UserProfile userId={comment.userId} />
            <div>
              <p className=" font-normal text-[0.5rem] md:text-base">{comment.content}</p>
              <p className=" font-thin text-[0.4rem] md:text-xs">{new Date(comment.createdAt).toLocaleString()}</p>
            </div>

          </div>
        ))}
      </div>
      <input
        type="text"
        value={content}
        onChange={(e) => setContent(e.target.value)}
        className="flex-1 p-2 border rounded-md"
        placeholder="Add a comment..."
      />
      <button
        onClick={handlePostComment}
        className="px-4 py-2 bg-blue-500 text-white rounded-md"
      >
        Post
      </button>

    </div>
  );
};

export default AddComments;
