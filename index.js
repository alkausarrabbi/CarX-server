const express=require("express");
const { MongoClient } = require('mongodb');
const app=express();
require('dotenv').config();
const cors = require('cors');
const ObjectId = require('mongodb').ObjectId;


const port=process.env.PORT || 5000;


app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.mviji.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });


async function run() {
    try {
        await client.connect();
        const database = client.db('CarX');
        const productsCollection = database.collection('Products');
        const bookingsCollection = database.collection('Bookings');
        const ratingCollection = database.collection('Ratings');
        const usersCollection = database.collection('Users');


        app.get('/allproducts', async (req, res) => {
            const cursor = productsCollection.find({});
            const products = await cursor.toArray();
            res.json(products);

        });
        app.get('/ratings', async (req, res) => {
            const cursor = ratingCollection.find({});
            const result = await cursor.toArray();
            res.json(result);

        });
        app.get('/allproducts/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const product = await productsCollection.findOne(query);
          
            res.send(product);

        });

        app.get('/bookings', async (req, res) => {
           const email=req.query.email;
           const query={email:email};
            const cursor = bookingsCollection.find(query);
            const bookings = await cursor.toArray();
            res.json(bookings);

        });
        app.get('/allbookings', async (req, res) => {
           
            const cursor = bookingsCollection.find({});
            const bookings = await cursor.toArray();
            res.json(bookings);

        });
        app.get('/users/:email', async (req, res) => {
            const email = req.params.email;
            const query = { email: email };
            const user = await usersCollection.findOne(query);
            let isAdmin = false;
            if (user?.role === "admin") {
                isAdmin = true;
            }
            res.json({ admin: isAdmin });
        })
// 
// 
// 
// 
// 
// 

        app.post('/bookings', async (req, res) => {
            const booking = req.body;
            const result = await bookingsCollection.insertOne(booking);
            res.json(result);
        });
        app.post('/ratings', async (req, res) => {
            const rating = req.body;
            const result = await ratingCollection.insertOne(rating);
            res.json(result);
        });
        app.post('/allproducts', async (req, res) => {
            const product = req.body;
            const result = await productsCollection.insertOne(product);
            res.json(result);
        });
        
        app.post('/users', async (req, res) => {
            const newUser = req.body;
            const result = await usersCollection.insertOne(newUser);
            res.json(result);
           
        });

// 
// 
// 
// 
// 
// 
// 
// 


        app.put('/bookings/:id', async (req, res) => {
            const id = req.params.id;
            const updatedBooking = req.body;
            const filter = { _id: ObjectId(id) };
            const options = { upsert: true };
            const updateDoc = {
                $set: {
                    order: updatedBooking.order,
                },
            };
            const result = await bookingsCollection.updateOne(filter, updateDoc, options)
            res.json(result)
        })
        app.put('/users', async (req, res) => {
            const updated = req.body;
            const filter = { email:updated.email };
            const options = { upsert: true };
            const updateDoc = {$set:updated};
            const result = await usersCollection.updateOne(filter, updateDoc, options)
            res.json(result)
        })
        app.put('/users/admin', async (req, res) => {
            const user = req.body;
            const filter = { email:user.email };
            const updateDoc = {$set:{role:'admin'}};
            const result = await usersCollection.updateOne(filter, updateDoc)
            res.json(result);
            console.log(result);
        })

// 
// 
// 
// 
// 
// 
// 


        app.delete('/bookings/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await bookingsCollection.deleteOne(query);

            res.json(result);
        })
        app.delete('/allproducts/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await productsCollection.deleteOne(query);

            res.json(result);
        })
//     
//        
// 
// 
// 
// 
// 

    }
    finally {
        // await client.close();
    }
}

run().catch(console.dir);






app.get('/',(req,res)=>{
    res.send("WelCome To CarX Database");
})

app.listen(port,()=>{
    console.log("listening carx location is :",port);
})