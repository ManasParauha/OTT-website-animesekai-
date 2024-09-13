// components/Comments.tsx
'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';

interface Comment {
    _id: string;
    content: string;
    userId: string;
    createdAt: string;
}

const Comments = ({ hubId }: { hubId: string }) => {
    const [comments, setComments] = useState<Comment[]>([]);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchComments = async () => {
            try {
                const response = await axios.get(`/api/users/hub/comments/${hubId}`);
                if (Array.isArray(response.data)) {
                    setComments(response.data);
                } else {
                    setComments([]);
                }
            } catch (error) {
                console.error('Error fetching comments:', error);
                setError('Failed to load comments.');
            }
        };

        fetchComments();
    }, [hubId]);

    return (
        <div className="flex gap-2 flex-col ">
            {error && <p className="text-red-500 bg-background text-foreground">{error}</p>}
            <div className="flex flex-col gap-3">
                {comments.map((comment) => (
                    <div key={comment._id} className="flex flex-col bg-background text-foreground">
                        <p className=" font-normal text-base">{comment.content}</p>
                        <p className=" font-thin text-xs">{new Date(comment.createdAt).toLocaleString()}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Comments;
