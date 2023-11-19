const express = require('express');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const authRoute = require('./routes/auth');
const userRoute = require('./routes/users');
const postRoute = require('./routes/posts');
const categoryRoute = require('./routes/categories');
const multer = require('multer');
const path = require('path');

dotenv.config();

const app = express();
// // permite sa trimita datele din body in format JSON
app.use(express.json());

const conectareMongoDb = async ()=> {
  try {
    await mongoose.connect(process.env.MONGO_URL);
      console.log('Conectat la baza de date!');
  } catch (error) {
    console.log(error)
  }

}
conectareMongoDb();

const storage = multer.diskStorage({
      destination: (req, file, cb) => {
        cb(null, 'images');
      },
      filename: (req, file, cb) => {
        cb(null, req.body.name);
      },
    });


//   // pentru incarcarea unui singur fisier
  const upload = multer({storage: storage});
  app.post('/api/upload', upload.single('file'), (req, res) => {
    res.status(200).json('Fisierul a fost incarcat!');
  });
  // locatia unde sunt stocate fisiere imagine
  app.use('/images', express.static(path.join(__dirname, '/images')));

  app.use('/api/auth', authRoute);
  app.use('/api/users', userRoute);
  app.use('/api/posts', postRoute);
  app.use('/api/categories', categoryRoute);


const PORT = 5000

try {
  app.listen(PORT, () => {
    console.log(`API listening on PORT ${PORT}`)
  })
  
  app.get('/', (req, res) => {
    res.send('Hey this is my API running 🥳 ', process.env.MONGO_URL)
  })
  
  app.get('/about', (req, res) => {
    res.send('This is my about route..... ')
  })
  
} catch (error) {
  console.log(error)
}

// Export the Express API
module.exports = app
