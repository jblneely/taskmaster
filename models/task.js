var mongoose = require('mongoose');

var TaskSchema = mongoose.Schema({
    title: String,
    description: String,
    image: String,
    dueDate: Date,
    completedDate: Date,
    completed: Boolean
});
module.exports = mongoose.model('Task', TaskSchema);
