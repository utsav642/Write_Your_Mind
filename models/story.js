const mongoose = require("mongoose");

const storySchema = new mongoose.Schema({
    title: String,
    post: String,
    author: String,
    category: String,
    status: String,
    likes: {
        type: Number,
        default: 0
    },
    comments: [String],
    date: String
});

const Story = new mongoose.model("Story", storySchema);
module.exports = {storySchema,Story};