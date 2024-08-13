import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';

function Comments({ filename }) {
    const { token, userData } = useAuth();
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState('');
    const [newReply, setNewReply] = useState('');
    const [replyingToCommentId, setReplyingToCommentId] = useState(null);
    const [editingCommentId, setEditingCommentId] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!filename) {
            setError('Filename is missing.');
            return;
        }

        async function fetchComments() {
            try {
                const response = await fetch(`http://localhost:3000/api/comments/${filename}/comments`, {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                    },
                    credentials: 'include',
                });
                if (!response.ok) {
                    throw new Error('Failed to fetch comments. Status: ' + response.status);
                }
                const data = await response.json();
                setComments(data); // Make sure replies are included in this data
            } catch (error) {
                setError(error.message);
            }
        }

        fetchComments();
    }, [filename, token]);

    const handleCommentSubmit = async (e) => {
        e.preventDefault();
        if (!newComment.trim()) return;

        try {
            const response = await fetch(`http://localhost:3000/api/comments/${filename}/comments`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                credentials: 'include',
                body: JSON.stringify({
                    content: newComment.trim(),
                    parentId: replyingToCommentId // Include parentId only if replying
                }),
            });

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`Failed to post comment. Status: ${response.status}, ${errorText}`);
            }

            const savedComment = await response.json();

            // If replying, update the parent comment with the new reply
            if (replyingToCommentId) {
                setComments(comments.map(comment =>
                    comment._id === savedComment._id ? savedComment : comment
                ));
            } else {
                setComments([...comments, savedComment]);
            }

            setNewComment('');
            setReplyingToCommentId(null); // Reset reply state after submission
        } catch (error) {
            setError(error.message);
        }
    };

    const handleEditClick = (commentId, currentContent) => {
        setEditingCommentId(commentId);
        setNewComment(currentContent);
    };

    const handleEditSubmit = async (e) => {
        e.preventDefault();
        if (!newComment.trim()) return;

        try {
            const response = await fetch(`http://localhost:3000/api/comments/${editingCommentId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                credentials: 'include',
                body: JSON.stringify({ content: newComment.trim() }),
            });

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`Failed to edit comment. Status: ${response.status}, ${errorText}`);
            }

            const updatedComment = await response.json();
            setComments(comments.map(comment =>
                comment._id === editingCommentId ? updatedComment : comment
            ));
            setEditingCommentId(null);
            setNewComment('');
        } catch (error) {
            setError(error.message);
        }
    };

    const handleDelete = async (commentId) => {
        try {
            const response = await fetch(`http://localhost:3000/api/comments/${commentId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
                credentials: 'include',
            });

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`Failed to delete comment. Status: ${response.status}, ${errorText}`);
            }

            setComments(comments.filter(comment => comment._id !== commentId));
        } catch (error) {
            setError(error.message);
        }
    };

    const handleReplySubmit = async (e) => {
        e.preventDefault();
        if (!newReply.trim()) return;

        try {
            const response = await fetch(`http://localhost:3000/api/comments/${filename}/comments`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                credentials: 'include',
                body: JSON.stringify({
                    content: newReply.trim(),
                    parentId: replyingToCommentId, // Attach parentId to make it a reply
                }),
            });

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`Failed to post reply. Status: ${response.status}, ${errorText}`);
            }

            const savedComment = await response.json();
            setComments(comments.map(comment =>
                comment._id === replyingToCommentId ? savedComment : comment
            ));
            setNewReply('');
            setReplyingToCommentId(null); // Reset reply state after submission
        } catch (error) {
            setError(error.message);
        }
    };

    if (error) {
        return <div>Error: {error}</div>;
    }

    return (
        <div className="comments-section">
            <h3>Comments</h3>
            <ul>
                {comments.map((comment) => (
                    <li key={comment._id}>
                        <strong>{comment.userName}:</strong> {comment.content}
                        {userData && userData._id === comment.userId && (
                            <>
                                <button onClick={() => handleEditClick(comment._id, comment.content)}>
                                    Edit
                                </button>
                                <button onClick={() => handleDelete(comment._id)}>
                                    Delete
                                </button>
                            </>
                        )}
                        <button onClick={() => setReplyingToCommentId(comment._id)}>
                            Reply
                        </button>

                        {/* Display replies */}
                        {comment.replies && comment.replies.length > 0 && (
                            <ul>
                                {comment.replies.map(reply => (
                                    <li key={reply._id}>
                                        <strong>{reply.userName}:</strong> {reply.content}
                                    </li>
                                ))}
                            </ul>
                        )}

                        {/* Reply form */}
                        {replyingToCommentId === comment._id && (
                            <form onSubmit={handleReplySubmit}>
                                <textarea
                                    value={newReply}
                                    onChange={(e) => setNewReply(e.target.value)}
                                    placeholder="Write a reply..."
                                />
                                <button type="submit">Post Reply</button>
                            </form>
                        )}
                    </li>
                ))}
            </ul>

            <form onSubmit={editingCommentId ? handleEditSubmit : handleCommentSubmit}>
                <textarea
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder="Write a comment..."
                />
                <button type="submit">{editingCommentId ? 'Save Edit' : 'Post Comment'}</button>
            </form>
        </div>
    );
}

export default Comments;
