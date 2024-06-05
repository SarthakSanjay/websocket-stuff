import express from 'express'
import { getChatMessages } from '../controllers/message'
import { authMiddleware } from '../middleware/auth'
const router = express.Router()

router.route('/chat/:id').get(authMiddleware, getChatMessages)
export default router