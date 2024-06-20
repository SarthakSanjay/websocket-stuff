import express from 'express'
import { uploadFiles } from '../controllers/file_upload'
import { authMiddleware } from '../middleware/auth'

const router = express.Router()

router.route('/file').post(authMiddleware,uploadFiles)

export default router