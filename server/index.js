import "dotenv/config"
import express from 'express';
import cors from 'cors';
import connectDB from './utils/db.js';
import cookieParser from 'cookie-parser';
import userRoutes from "./routes/user.route.js"
import documentRoutes from "./routes/document.route.js"
import activityRoutes from "./routes/activity.route.js"
import lawyerRoutes from "./routes/lawyer.route.js"


const PORT = process.env.PORT

const app = express()

app.use(express.json());



const corsOptions = {
  origin: process.env.FRONT_URL,
  credentials: true,
  optionSuccessStatus: 200,
};
app.use(cors(corsOptions));

app.use('/api/v1/user' ,userRoutes);
app.use('/api/v1/document' ,documentRoutes);
app.use('/api/v1/activity' ,activityRoutes);
app.use('/api/v1/lawyer' ,lawyerRoutes);



app.listen(PORT, () => {
    connectDB();
  console.log(`Server is running on port ${PORT}`);
})