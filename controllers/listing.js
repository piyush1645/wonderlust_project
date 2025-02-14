const Listing=require("../models/listing");
 
module.exports.indexRoute=async (req, res) => {
    const AllListing = await Listing.find({});
    console.log(AllListing);
    res.render("listings/index.ejs", { AllListing })
};

module.exports.newRoute=(req, res) => {
    res.render("listings/new.ejs");
};

module.exports.showRoute=async (req, res) => {
    let { id } = req.params;
    const item = await Listing.findById(id).populate({path:"reviews",populate:{path:"author"}}).populate("owner");
    console.log(item);
    if(!item){
        req.flash("error","listing is does not exist");
        res.redirect("/listing");
    }
    res.render("listings/show.ejs", { item });
    };

module.exports.createRoute=async (req, res) => {
    let url=req.file.path;
    let filename=req.file.filename;
    // let {title,price,location,country,image}=req.body;
    const newlisting = new Listing(req.body.listing);
    newlisting.owner=req.user._id;
    newlisting.image={url,filename};
    await newlisting.save();
    req.flash("success","listing is created!");
    res.redirect("/listing");
    };

module.exports.editRoute=async (req, res) => {
    let { id } = req.params;
    const item = await Listing.findById(id);
    if(!item){
        req.flash("error","listing is does not exist");
        res.redirect("/listing");
    }
    let originalImageUrl=item.image.url;
    item.image.url=originalImageUrl.replace("/upload","/upload/c_fill,h_300,w_250,e_blur:200")
    res.render("listings/edit.ejs", { item });
    };

module.exports.updateRoute=async (req, res) => {
    let { id } = req.params;
    const item = await Listing.findByIdAndUpdate(id, { ...req.body.listing });

    if(typeof req.file!=="undefined"){
        let url = req.file.path;
    let filename=req.file.filename;
    item.image={url,filename};
    await item.save();
    }
    req.flash("success","listing is update");
    res.redirect(`/listing/${id}`);
    
    };

module.exports.deleteRoute=async (req, res) => {
    let { id } = req.params;
    const deleteitem = await Listing.findByIdAndDelete(id);
    req.flash("success","listing is deleted");
    res.redirect("/listing");
    };

    