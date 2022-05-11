const {Schema , model} =require('mongoose');

const schema = new Schema({
    imageUrl:{type:String,required:true},
    nameProduct:{type:String,required:true},
    description:{type:String,required:true},
    country:{type:String},
    codeFlag:{type:String},
    created:{type:Date,default:Date.now}
});
module.exports = model('Product',schema);