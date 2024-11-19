import express from 'express';
import { mongoose } from 'mongoose';
import { User } from './models/User.model.js';
import { Post } from './models/Post.model.js';
import { validatePost } from './validators/validatePost.js';
import cors from 'cors';

const app = express()
const port = 3000

const connectionURL = "mongodb+srv://sergioflores735:WUa3aTg2iVzZrFuG@webdatabase.gbq59.mongodb.net/?retryWrites=true&w=majority&appName=WebDataBase"; // Change this based on your database connection

mongoose.connect(connectionURL)
.then(() => {
  console.info("connected to MongoDB");
})
.catch((error) => {
  console.log(error)
  console.error("error connecting to MongoDB:", error.message);
});

// rutas para el api
const loginPath = '/login'
const registerPath = '/register'
const PostPath = '/post'

// Middleware para analizar JSON
app.use(express.json())
app.use(cors())
//para los usuarios en la base de datos
app.get('/', (req, res) => {

  const user = {
    name : 'Giovani',
    email: 'giovani@gmail.com',
  }
  res.send(user)
})

//para el login
app.post(loginPath, async(request, response)=>{

  const {email,password} = request.body 
  const user = await User.findOne({email})

  const exists = user!=null
  if(!exists){
    return response.status(401).json({
      error:'User does not exist'
    })
  }

  const passwordIsCorrect = password === user.password

  if(!passwordIsCorrect){
    return response.status(401).json({
      error:'Invalid email or password'
    })
  }

  const userData = {
    id:user.id,
    email:user.email,
    firstname:user.firstname
  }

  response
  .status(200)
  .send(userData)

})

//para el registro
app.post(registerPath, async(request, response)=>{
    const email = request.body.email
    const password = request.body.password
    const firstname = request.body.firstname
    const lastname = request.body.lastname
    const phone = request.body.phone

    const newUser = new User({
      email,
      password,
      firstname,
      lastname,
      phone
    });

  const created = await newUser.save();
  response.status(201).json(created);
})

/////////////
//para la funcion de publicar
app.post(PostPath, async(request, response)=>{
  // const fotos = request.body.fotos
  const title = request.body.title
  const address = request.body.address
  const author = request.body.author
  const likes = request.body.likes
  const description = request.body.description
  const numberOfRooms = request.body.numberOfRooms
  const isHouse = request.body.isHouse
  const isDepartment = request.body.isDepartment
  const hasWaterService = request.body.hasWaterService
  const hasGasService = request.body.hasGasService
  const hasInternetService = request.body.hasInternetService
  const hasElectricService = request.body.hasElectricService
  const hasPhone = request.body.hasPhone
  const hasParking = request.body.hasParking
  const photos = request.body.photos

  const post = {
    title,
    address,
    author,
    likes,
    description,
    numberOfRooms,
    isHouse,
    isDepartment,
    hasWaterService,
    hasGasService,
    hasInternetService,
    hasElectricService,
    hasPhone,
    hasParking,
    photos,
  }

  const isValid = validatePost(post)
  console.log(isValid)

  if(!isValid){
    return response.status(400).json({
      error:'Invalid post'
    })
  }
  

  const newPost = new Post({
    title,
    address,
    author,
    likes,
    description,
    numberOfRooms,
    isHouse,
    isDepartment,
    hasWaterService,
    hasGasService,
    hasInternetService,
    hasElectricService,
    hasPhone,
    hasParking
  });

const created = await newPost.save();
response.status(201).json(created);
});

app.get(PostPath, async(req, res) => {
  const posts = await Post.find({});

  res.send(posts);
});
/////////////////
//barra de busqueda
// Ruta de búsqueda en Express
app.get('/search', async (req, res) => {
  try {
    // Extracción de parámetros de búsqueda desde la query string
    const { address, numberOfRooms, isHouse, isDepartment, hasWaterService, hasGasService, hasInternetService, hasElectricService,hasPhone, hasParking } = req.query;

    // Construcción de un objeto de consulta
    const query = {};

    // Aplicar filtros condicionalmente
    if (numberOfRooms) {
      query.numberOfRooms = parseInt(numberOfRooms);
    }
    if (isHouse) {
      query.isHouse = isHouse === 'true';
    }
    if (isDepartment) {
      query.isDepartment = isDepartment === 'true';
    }
    if (hasElectricService) {
      query.hasElectricService = hasElectricService === 'true';
    }
    if (hasGasService) {
      query.hasGasService = hasGasService === 'true';
    }
    if (hasInternetService) {
      query.hasInternetService = hasInternetService === 'true';
    }
    if (hasPhone) {
      query.hasPhone = hasPhone === 'true';
    }
    if (hasParking) {
      query.hasParking = hasParking === 'true';
    }

    // Consultar la base de datos con los filtros aplicados
    const posts = await Post.find(query);
    res.status(200).json(posts);

  } catch (error) {
    res.status(500).json({ message: 'Error al buscar inmuebles', error: error.message });
  }
});


app.listen(port, () => {
  console.log(`
    Server app listening on port ${port}`)
})