// usePostComments.js

import { useState, useEffect } from 'react';
import firestore from '@react-native-firebase/firestore';

const usePostComments = (postId) => {
    const [postComments, setPostComments] = useState([]);
    const [commentContent, setCommentContent] = useState('');

    useEffect(() => {
        const unsubscribe = firestore().collection('posts').doc(postId).collection('comments').orderBy('timestamp', 'desc').onSnapshot(snapshot => {
            const fetchedComments = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            setPostComments(fetchedComments);
        });

        return () => unsubscribe();
    }, [postId]);

    return postComments;
};

export default usePostComments;