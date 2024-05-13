import express from 'express'
import { directMessage } from '../controllers/message'
const router = express.Router()

router.route('/').post(directMessage)

export default router