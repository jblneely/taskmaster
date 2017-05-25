var mongoose = require('mongoose');

var TaskSchema = mongoose.Schema({
    userId: String,
    title: String,
    description: String,
    image: String,
    dueDate: Date,
    completedDate: Date,
    completed: Boolean
});
module.exports = mongoose.model('Task', TaskSchema);
