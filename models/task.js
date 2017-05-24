var mongoose = require('mongoose');

var TaskSchema = mongoose.Schema({
    title: String,
    description: String,
    image: String,
    dueDate: Date,
    completedDate: Date
});
module.exports = mongoose.model('Task', TaskSchema);
