import dotenv from 'dotenv'
import jwt from 'jsonwebtoken'

dotenv.config()

const isauthenticated = async (req, res, next) => {
  try {
    let token = req.cookies?.token

    // ✅ Check Authorization header
    if (!token && req.headers.authorization?.startsWith("Bearer")) {
      token = req.headers.authorization.split(" ")[1]
    }

    if (!token) {
      return res.status(401).json({
        message: 'User not authenticated',
        success: false
      })
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    if (!decoded) {
      return res.status(401).json({
        message: 'Invalid token',
        success: false
      })
    }

    req.id = decoded.id
    next()
  } catch (error) {
    console.error(error)
    return res.status(401).json({
      message: 'Authentication failed',
      success: false
    })
  }
}

export default isauthenticated
