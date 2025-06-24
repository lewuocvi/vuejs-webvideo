import * as functions from 'firebase-functions';
import { getDatabase } from 'firebase-admin/database';
import express from 'express';
import admin from 'firebase-admin';
import cors from 'cors';

admin.initializeApp();

const app = express();
app.use(cors({ origin: true }));
app.use(express.json());

const db = admin.firestore();
const realtimeDb = getDatabase();

// Middleware to verify the authentication token
const verifyToken = async (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ error: 'Thiếu token' });
    }

    const idToken = authHeader.split(' ')[1];

    try {
        const decodedToken = await admin.auth().verifyIdToken(idToken);
        req.user = decodedToken;
        next();
    } catch (error) {
        console.error('Lỗi xác thực token:', error);
        return res.status(401).json({ error: 'Token không hợp lệ' });
    }
};

// User route
app.get('/user', verifyToken, async (req, res) => {
    const { uid, email } = req.user;

    try {
        const userDoc = await db.collection('users').doc(uid).get();
        if (!userDoc.exists) {
            return res.status(404).json({ error: 'User not found' });
        }
        const userData = userDoc.data();
        return res.status(200).json({ ...userData, email });
    } catch (error) {
        console.error('Error fetching user data:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
});

// Posts routes
app.get('/posts', async (req, res) => {
    const { id } = req.query;
    try {
        if (id) {
            // Fetch a specific post by ID
            const postDoc = await db.collection('posts').doc(id).get();
            if (!postDoc.exists) {
                return res.status(404).json({ error: 'Post not found' });
            }
            const post = { id: postDoc.id, ...postDoc.data() };
            return res.status(200).json(post);
        } else {
            // Fetch all posts
            const postsSnapshot = await db.collection('posts').get();
            const posts = postsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            return res.status(200).json(posts);
        }
    } catch (error) {
        console.error('Error fetching posts:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
});

app.post('/posts', verifyToken, async (req, res) => {
    const { uid } = req.user;
    const { title, content } = req.body;
    try {
        if (!title || !content) {
            return res.status(400).json({ error: 'Title and content are required' });
        }
        const newPost = {
            title,
            content,
            authorId: uid,
            createdAt: admin.firestore.FieldValue.serverTimestamp()
        };
        const docRef = await db.collection('posts').add(newPost);
        return res.status(201).json({ id: docRef.id, ...newPost });
    } catch (error) {
        console.error('Error creating post:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
});

app.put('/posts/:id', verifyToken, async (req, res) => {
    const { uid } = req.user;
    const { id } = req.params;
    const { title, content } = req.body;
    try {
        if (!title && !content) {
            return res.status(400).json({ error: 'Invalid request' });
        }
        const postRef = db.collection('posts').doc(id);
        const post = await postRef.get();
        if (!post.exists) {
            return res.status(404).json({ error: 'Post not found' });
        }
        if (post.data().authorId !== uid) {
            return res.status(403).json({ error: 'Not authorized to update this post' });
        }
        await postRef.update({ title, content, updatedAt: admin.firestore.FieldValue.serverTimestamp() });
        return res.status(200).json({ message: 'Post updated successfully' });
    } catch (error) {
        console.error('Error updating post:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
});

app.delete('/posts/:id', verifyToken, async (req, res) => {
    const { uid } = req.user;
    const { id } = req.params;
    try {
        const postRef = db.collection('posts').doc(id);
        const post = await postRef.get();
        if (!post.exists) {
            return res.status(404).json({ error: 'Post not found' });
        }
        if (post.data().authorId !== uid) {
            return res.status(403).json({ error: 'Not authorized to delete this post' });
        }
        await postRef.delete();
        return res.status(200).json({ message: 'Post deleted successfully' });
    } catch (error) {
        console.error('Error deleting post:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
});

app.post('/posts/:postId/comments', verifyToken, async (req, res) => {
    const { uid } = req.user;
    const { postId } = req.params;
    const { content, replyingTo } = req.body;

    try {
        // Check if the post exists
        const postRef = db.collection('posts').doc(postId);
        const post = await postRef.get();
        if (!post.exists) {
            return res.status(404).json({ error: 'Post not found' });
        }

        // Validate comment content
        if (!content || content.trim() === '') {
            return res.status(400).json({ error: 'Comment content is required' });
        }

        // Create the new comment
        const newComment = { postId, authorId: uid, content, replyingTo, createdAt: admin.database.ServerValue.TIMESTAMP };

        // Add the comment to Realtime Database
        const commentsRef = realtimeDb.ref('comments').push();
        await commentsRef.set(newComment);

        // Return the created comment
        return res.status(201).json({
            id: commentsRef.key,
            ...newComment,
            createdAt: new Date().toISOString()
        });
    } catch (error) {
        console.error('Error creating comment:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
});

// GET route for fetching comments
app.get('/posts/:postId/comments', async (req, res) => {
    const { postId } = req.params;
    try {
        const commentsRef = realtimeDb.ref('comments');
        const snapshot = await commentsRef.orderByChild('postId').equalTo(postId).once('value');

        if (!snapshot.exists()) {
            return res.status(404).json({ error: 'Comments not found' });
        }

        const comments = [];
        snapshot.forEach((childSnapshot) => {
            comments.push({ id: childSnapshot.key, ...childSnapshot.val(), createdAt: new Date(childSnapshot.val().createdAt).toISOString() });
        });

        // Sort comments by createdAt in descending order
        comments.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

        return res.status(200).json(comments);
    } catch (error) {
        console.error('Error fetching comments:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
});

export const api = functions.https.onRequest(app);