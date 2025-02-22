// const express = require("express"); 
// const bodyParser = require("body-parser");
// const cors = require("cors");
// const mongoose = require("mongoose");
// const multer = require("multer"); 
// const path = require("path"); 
// const Port = 5005;

// const app = express();
// app.use(cors());

// const storage_field = multer.diskStorage({
//     destination: (req, file, cb) => {
//         cb(null, './uploads/'); 
//     },
//     filename: (req, file, cb) => {
//         cb(null, Date.now() + path.extname(file.originalname)); 
//     }
// });
// const upload = multer({ storage: storage_field });

// mongoose.connect("mongodb://localhost:27017/JobPortal")
// .then(() => { console.log("MongoDB connected..") })
// .catch((err) => { console.log("Failed to connect MongoDB", err) });

// const Category_Schema = new mongoose.Schema({
//     Categoryname: String,
//     CategoryDescription: String,
//     CategorySalary: Number,
//     CategoryLocation: String,
//     CategoryImage: String, 
// });

// const Category_Datas = mongoose.model("CategoryLists", Category_Schema);

// app.post("/InsertCategoryDatas", upload.single('CategoryImage'), async (req, res) => {
//     const { Categoryname, CategoryDescription, CategorySalary, CategoryLocation } = req.body;
//     const imageUrl = req.file ? `http://localhost:${Port}/uploads/${req.file.filename}` : '';

//     try{
//         const newData = new Category_Datas({  Categoryname, CategoryDescription, CategorySalary, CategoryLocation, CategoryImage : imageUrl });
//         await newData.save();
//         res.status(200).send({ message: "Data inserted successfully" });
//     } 
//     catch (err){
//         res.status(500).send({ message: "Error inserting data", error: err.message });
//     }
// });


// app.get("/GetCategoryDatas", async (req, res) => {
//     try {
//         const totaldatas = await Category_Datas.find();
//         if (!totaldatas || totaldatas.length === 0) 
//         {
//             return res.status(404).send({ message: "No categories found" });
//         }
//         res.status(200).send({ totaldatas });
//     } catch (err) {
//         res.status(500).send({ message: "Error fetching data", error: err.message });
//     }
// });

// app.listen(Port, () => { console.log(`Server is listening on port ${Port}`) });







const express = require("express"); 
const bodyParser = require("body-parser");
const cors = require("cors");
const mongoose = require("mongoose");
const multer = require("multer"); 
const path = require("path"); 
const { type } = require("os");
const Port = 5005;

const app = express();
app.use(cors());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

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


//--------------------------------------------------------- CATEGORY DATAS --------------------------------------------------------- // 
const Category_Schema = new mongoose.Schema({
    Categoryname : { type : String , required : true },
    CategoryImage: { type : String , required : true }
});

const Category_Datas = mongoose.model("CategoryLists", Category_Schema);


// --------Insert Datas
app.post("/InsertCategoryDatas", upload.single('CategoryImage'), async (req, res) => {
    const { Categoryname} = req.body;
    const imageUrl = req.file ? `http://localhost:${Port}/uploads/${req.file.filename}` : '';

    try{
        const newData = new Category_Datas({  Categoryname, CategoryImage : imageUrl });
        await newData.save();
        res.status(200).send({ message: "Data inserted successfully" });
    } 
    catch (err){
        res.status(500).send({ message: "Error inserting data", error: err.message });
    }
});


// -----------Fetching Datas
app.get("/GetCategoryDatas", async(req, res) => {
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


// -------------Delete Datas
app.delete("/DeleteCategoryDatas/:id", async(req,res) => {
    try{
        const {id} = req.params;
        const findid = await Category_Datas.findByIdAndDelete(id);
        return res.status(200).send({message : "Datas deleted successfully.."});
    }
    catch(err){
        res.status(500).send({ message: "Error occurs for deletion", error: err.message });
    }
});


//---------------Update Datas
app.put("/UpdateCategoryDatas/:id", upload.single("CategoryImage"), async (req, res) => {
    try 
    {
        const { id } = req.params;
        const { Categoryname } = req.body;

        const existingCategory = await Category_Datas.findByIdAndUpdate(id);
        if (!existingCategory) 
        {
            return res.status(404).json({ message: "Category not found" });
        }

        // Update category fields
        if (Categoryname) existingCategory.Categoryname = Categoryname;
        if (req.file) 
        {
            const imageUrl = `http://localhost:${Port}/uploads/${req.file.filename}`;
            existingCategory.CategoryImage = imageUrl; 
        }

        await existingCategory.save();
        res.status(200).json({ message: "Category updated successfully", category: existingCategory });
    } 
    catch (error) {
        console.error("Error updating category:", error);
        res.status(500).json({ message: "Failed to update category", error: error.message });
    }
});




//--------------------------------------------------------- JOB DATAS --------------------------------------------------------- // 
const job_schema = new mongoose.Schema({
    MainCategory: { type: String, required: true },
    JobPosition: { type: String, required: true },
    Description: { type: String, required: true },
    Salary: { type: Number, required: true },
    WebsiteLink: { type: String, required: true },
    Location: { type: String, required: true },
    JobType: { type: String, required: true },
    Image: { type: String, required: true }
})
const Job_Datas = mongoose.model("Job Datas",job_schema);

// ---------------Insert JobDatas
app.post("/InsertJobDatas",upload.single("Image"),async(req,res)=>{
    const {MainCategory,JobPosition,Description,Salary,WebsiteLink,Location,JobType} = req.body;
    const Imag_Url = req.file ? `http://localhost:${Port}/uploads/${req.file.filename}` : "";
    try{
        const newJob_Datas = new Job_Datas({MainCategory,JobPosition,Description,Salary,WebsiteLink,Location,JobType,Image:Imag_Url});
        await newJob_Datas.save();
        res.status(200).send({message : "JobDatas inserted"});
    }
    catch(err){
        res.status(500).send({ message: "Error inserting Jobdatas", error: err.message });
    }
});


// ---------------Fetching JobDatas
app.get("/GetJobDatas", async(req,res) => {
    try{
        const totaljobdatas = await Job_Datas.find();
        if (!totaljobdatas || totaljobdatas.length === 0) 
            {
                return res.status(404).send({ message: "No categories found" });
            }
        res.status(200).send({totaljobdatas});
    }
    catch(err){
        res.status(500).send({ message: "Error fetching data", error: err.message });
    }
});


// ----------------Delete JobDatas
app.delete("/DeleteJobDatas/:id", async(req,res) => {
    try{
        const {id} = req.params;
        const findid = await Job_Datas.findByIdAndDelete(id);
        res.status(200).send({ message: "Data Deleted" });
    }
    catch(err){
        res.status(500).send({ message: "Error occurs for deletion", error: err.message });
    }
});


// ----------------Update JobDatas
app.put("/EditJobDatas/:id", upload.single("Image"), async (req, res) => {
    try {
        const { id } = req.params;

        const existingJobData = await Job_Datas.findById(id);
        if (!existingJobData) {
            return res.status(404).json({ message: "Job data not found." });
        }

        const {MainCategory,JobPosition,Description,Salary,WebsiteLink,Location,JobType,} = req.body;

        if (MainCategory) existingJobData.MainCategory = MainCategory;
        if (JobPosition) existingJobData.JobPosition = JobPosition;
        if (Description) existingJobData.Description = Description;
        if (Salary) existingJobData.Salary = Salary;
        if (WebsiteLink) existingJobData.WebsiteLink = WebsiteLink;
        if (Location) existingJobData.Location = Location;
        if (JobType) existingJobData.JobType = JobType;

        if (req.file) {
            const newImageUrl = `http://localhost:${Port}/uploads/${req.file.filename}`;
            existingJobData.Image = newImageUrl;
        }

        const updatedJobData = await existingJobData.save();

        res.status(200).json({
            message: "Job data successfully updated.",
            data: updatedJobData,
        });
    } catch (err) {
        console.error("Error updating job data:", err);
        res.status(500).json({ message: "An error occurred while updating job data." });
    }
});



//--------------------------------------------------------- BLOG DATAS --------------------------------------------------------- //
const Blog_Schema = new mongoose.Schema({
    BlogTitle : { type : String },
    BlogImage : { type : String },
    BlogDescription : { type : String }
})
const Blog_Datas = mongoose.model("BlogLists",Blog_Schema);

// --------Insert Blog Datas
app.post("/InsertBlogDatas", upload.single("BlogImage") , async(req,res)=>{
    const {BlogTitle,BlogDescription} = req.body;
    const blogimgurl = req.file ? `http://localhost:${Port}/uploads/${req.file.filename}` : '';
    try{
        const newblogdatas = new Blog_Datas({BlogTitle,BlogImage:blogimgurl,BlogDescription});
        await newblogdatas.save();
    }
    catch(err){
        res.status(500).send({ message: "Error inserting blog data", error: err.message });
    }
});

// --------Delete Blog Datas
app.delete("/DeleteBlogDatas/:id", async(req,res)=>{
    try{
        const {id} = req.params;
        const findid = await Blog_Datas.findByIdAndDelete(id);
        return res.status(200).send({message : "Blog Datas deleted successfully.."});
    }
    catch(err){
        res.status(404).send({message:"Error deleting blog datas"});
    }
});

// --------Update Blog Datas
app.put("/UpdateBlogDatas/:id", upload.single("BlogImage") , async(req,res)=>{
    const {id} = req.params;
    const {BlogTitle,BlogDescription} = req.body;
    try{
        const existingBlogDatas = await Blog_Datas.findById(id);
        if(BlogTitle) existingBlogDatas.BlogTitle = BlogTitle; 
        if(req.file) { 
            const newBlogImage = `http://localhost:${Port}/uploads/${req.file.filename}`;
            existingBlogDatas.BlogImage = newBlogImage;
        }
        if(BlogDescription) existingBlogDatas.BlogDescription = BlogDescription;
        await existingBlogDatas.save();
        res.send({message : "Blog Datas Updated successfully.."});
    }
    catch(err){
        res.status(404).send({message:"Error Updating Blog Datas"});
    }
});

// --------Fetch Blog Datas
app.get("/GetBlogDatas", async(req,res)=>{
    try{
        const totalblogdatas = await Blog_Datas.find();
        res.send({totalblogdatas});
    }
    catch(err){
        res.status(500).send({ message: "Error fetching blog data", error: err.message });
    }
});


app.listen(Port, () => { console.log(`Server is listening on port ${Port}`) });


