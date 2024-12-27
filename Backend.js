

const express = require("express"); 
const bodyParser = require("body-parser");
const cors = require("cors");
const mongoose = require("mongoose");
const multer = require("multer"); 
const path = require("path"); 
const Port = 5005;

const app = express();
app.use(cors());

const storage_field = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './uploads/'); 
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname)); 
    }
});
const upload = multer({ storage: storage_field });

mongoose.connect("mongodb://localhost:27017/JobPortal")
.then(() => { console.log("MongoDB connected..") })
.catch((err) => { console.log("Failed to connect MongoDB", err) });

const Category_Schema = new mongoose.Schema({
    Categoryname: String,
    CategoryDescription: String,
    CategorySalary: Number,
    CategoryLocation: String,
    CategoryImage: String, 
});

const Category_Datas = mongoose.model("CategoryLists", Category_Schema);

app.post("/InsertCategoryDatas", upload.single('CategoryImage'), async (req, res) => {
    const { Categoryname, CategoryDescription, CategorySalary, CategoryLocation } = req.body;
    const imageUrl = req.file ? `http://localhost:${Port}/uploads/${req.file.filename}` : '';

    try{
        const newData = new Category_Datas({  Categoryname, CategoryDescription, CategorySalary, CategoryLocation, CategoryImage : imageUrl });
        await newData.save();
        res.status(200).send({ message: "Data inserted successfully" });
    } 
    catch (err){
        res.status(500).send({ message: "Error inserting data", error: err.message });
    }
});


app.get("/GetCategoryDatas", async (req, res) => {
    try {
        const totaldatas = await Category_Datas.find();
        if (!totaldatas || totaldatas.length === 0) 
        {
            return res.status(404).send({ message: "No categories found" });
        }
        res.status(200).send({ totaldatas });
    } catch (err) {
        res.status(500).send({ message: "Error fetching data", error: err.message });
    }
});

app.listen(Port, () => { console.log(`Server is listening on port ${Port}`) });
