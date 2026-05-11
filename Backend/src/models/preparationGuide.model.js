const mongoose = require("mongoose")

const preparationGuideSchema =
new mongoose.Schema({

    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "users",
        required: true
    },

    company: String,

    role: String,

    experienceLevel: String,

    preparationTime: String,

    result: String

}, {
    timestamps: true
})

module.exports = mongoose.model(
    "PreparationGuide",
    preparationGuideSchema
)