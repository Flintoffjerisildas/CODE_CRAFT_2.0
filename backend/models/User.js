const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ["student", "teacher", "admin"], default: "student" },
  region: { type: String },
  preferredLanguage: { type: String },
});


// Utility: Derive language from region (primary Indian languages)
const regionLanguageMap = {
  "Tamil Nadu": "Tamil",
  "Maharashtra": "Marathi",
  "West Bengal": "Bengali",
  "Karnataka": "Kannada",
  "Kerala": "Malayalam",
  "Gujarat": "Gujarati",
  "Punjab": "Punjabi",
  "Odisha": "Oriya",
  "Telangana": "Telugu",
  "Andhra Pradesh": "Telugu",
  "Uttar Pradesh": "Hindi",
  "Madhya Pradesh": "Hindi",
  "Bihar": "Hindi",
  "Rajasthan": "Hindi",
  "Delhi": "Hindi",
  "Haryana": "Hindi",
  "Jharkhand": "Hindi",
  "Chhattisgarh": "Hindi",
  "Assam": "Assamese",
  "Jammu & Kashmir": "Urdu",
  // Add more as needed
};

userSchema.statics.deriveLanguageFromRegion = function(region) {
  return regionLanguageMap[region] || "English";
};

module.exports = mongoose.model("User", userSchema);
