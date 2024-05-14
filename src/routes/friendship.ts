import express from 'express'
import { addFriend } from '../controllers/friendship'

const router = express.Router()

router.route('/').post(addFriend)

export default router