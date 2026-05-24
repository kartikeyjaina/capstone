import mongoose from "mongoose";

const projectSchema = new mongoose.Schema({
    user:{
        type: mongoose.Schema.Types.ObjectId,
        required: true,
    },
    title:{
        type: String,
        default: 'Untitled Project'
    }
});

const Project = mongoose.model('Project', projectSchema);

export default Project;