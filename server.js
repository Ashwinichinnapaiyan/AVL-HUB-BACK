require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const connectDB = require('./config/db');
const bodyParser = require('body-parser');
const addstudentRoutes = require('./routes/addstudentRoutes');
const purchasedCoursesRouter = require('./routes/PurchasedCourses');
const Feedback = require('./models/Feedback'); // Ensure Feedback model is imported correctly
const authRoutes = require('./routes/authRoutes');


const app = express();
app.use(express.json());
app.use(cors());
app.use(bodyParser.json());

// Use the auth routes
app.use('/api/auth', authRoutes);


mongoose
  .connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("Error connecting to MongoDB:", err));

// Define Schema and Model
const courseSchema = new mongoose.Schema({
  title: { type: String, required: true },
  instructor: { type: String, required: true },
  image: { type: String },
  video: { type: String },
  category: { type: String, required: true },
});

const Course = mongoose.model("Course", courseSchema);

// Routes
app.post("/add-course", async (req, res) => {
  const { title, instructor, image, video, category } = req.body;

  // Validation
  if (!title || !instructor || !category) {
    return res.status(400).json({ message: "All fields are required." });
  }

  try {
    const newCourse = new Course({ title, instructor, image, video, category });
    await newCourse.save();
    res.status(201).json({ message: "Course added successfully!" });
  } catch (err) {
    res.status(500).json({ message: "Error adding course", error: err.message });
  }
});
// GET all feedback
app.get('/api/feedback', async (req, res) => {
  try {
    const feedbacks = await Feedback.find();
    res.json(feedbacks);
  } catch (err) {
    res.status(500).send('Error retrieving feedback');
  }
});

// POST new feedback
app.post('/api/feedback', async (req, res) => {
  const { name, comment, rating } = req.body;

  if (!name || !comment || rating === undefined) {
    return res.status(400).send('Please provide all feedback fields');
  }

  const newFeedback = new Feedback({ name, comment, rating });

  try {
    await newFeedback.save();
    res.status(201).json(newFeedback);
  } catch (err) {
    res.status(500).send('Error saving feedback');
  }
});

// Routes
app.use('/api/courses', purchasedCoursesRouter);

// Use student routes
app.use('/api/students', addstudentRoutes);

// Student login route
app.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const student = await User.findOne({ email });
    if (!student) {
      return res.status(400).json({ message: "User not found." });
    }

    const validPassword = await bcrypt.compare(password, student.password);
    if (!validPassword) {
      return res.status(400).json({ message: "Invalid password." });
    }

    res.status(200).json({ message: "Login successful" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});




// Start server
const PORT = process.env.PORT ||4000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
