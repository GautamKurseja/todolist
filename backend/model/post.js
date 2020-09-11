const mongoose = require("mongoose");
const postSchema = mongoose.Schema({
  tittle: { type: String  },
  content: { type: String },
  creator : { type:mongoose.Schema.Types.ObjectId,ref: "User", required: true}
});

module.exports = mongoose.model('Post', postSchema)
