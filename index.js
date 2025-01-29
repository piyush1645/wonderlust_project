const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const Listing = require("./models/listing.js"); 
const app = express();

app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname, "public")));

async function main() {
    await mongoose.connect("mongodb://127.0.0.1:27017/wonderlust");
    console.log("Connected to MongoDB");
}
main().catch(err => console.log(err));

let port = 8080;


app.get("/", (req, res) => {
    console.log("Hello, Home Route");
    res.send("Welcome to Home Page");
});

app.get("/testlisting", async (req, res) => {
    let sampleListing = new Listing({
        title: "My New Villa",
        description: "By the beach",
        image: "https://pixabay.com/videos/pagoda-mountains-japan-japanese-240841/",
        price: 12000,
        location: "Bhavnagar",
        country: "India",
    });

    await sampleListing.save();
    console.log("Sample listing was saved");
    res.send("Listing added successfully!");
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
