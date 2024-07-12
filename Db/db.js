import mongoose from "mongoose";

export const connectToMongo=()=>{
    mongoose.connect('mongodb+srv://faizanhussain78612:02sep27nov@cluster0.xkhcwju.mongodb.net/?retryWrites=true&w=majority').then(()=>{
        console.log('*|*|*|Database Connected Succesfully|*|*|*');
    }).catch((error)=>{
        console.log(error.message);
    })
}





