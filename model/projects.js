var mongoose = require('mongoose');
var blobSchema = new mongoose.Schema({
    name: String,
    description: String,
    price: Number,
    note: String,
    start: Date,
    end: Date,
    members: [String],
});
mongoose.model('Project', blobSchema);
