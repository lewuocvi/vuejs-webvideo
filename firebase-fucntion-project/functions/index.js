import { https } from 'firebase-functions';
import admin from 'firebase-admin';

admin.initializeApp();

export const protectedRoute = https.onRequest(async (req, res) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ error: 'Thiếu token' });
    }

    const idToken = authHeader.split(' ')[1];

    try {
        const decodedToken = await admin.auth().verifyIdToken(idToken);
        const { uid, email } = decodedToken;

        // Bạn có thể xử lý logic tuỳ ý tại đây
        return res.status(200).json({
            message: 'Đã xác thực',
            uid,
            email
        });

    } catch (error) {
        console.error('Lỗi xác thực token:', error);
        return res.status(401).json({ error: 'Token không hợp lệ' });
    }
});