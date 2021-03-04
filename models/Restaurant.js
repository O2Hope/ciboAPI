const mongoose = require("mongoose");
const slugify = require("slugify");
const geocoder = require("../utils/geocoder");

const RestaurantSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      unique: true,
      trim: true,
      maxlength: 50,
    },
    slug: String,
    description: {
      type: String,
      required: true,
      maxlength: 500,
    },
    website: {
      type: String,
    },
    phone: {
      type: String,
      maxlength: 20,
    },
    email: {
      type: String,
    },
    address: {
      type: String,
      required: true,
    },
    location: {
      type: {
        type: String,
        enum: ["Point"],
      },
      coordinates: {
        type: [Number],
        index: "2dsphere",
      },
      formattedAddress: String,
      street: String,
      city: String,
      state: String,
      zipcode: String,
      country: String,
    },
    averageRating: {
      type: Number,
      min: 1,
      max: 10,
    },
    averageCost: {
      type: Number,
      min: 1,
      max: 5,
    },
    photo: {
      type: String,
      default: "no-photo.jpg",
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Create restaurant slug from the name
RestaurantSchema.pre("save", function (next) {
  this.slug = slugify(this.name, { lower: true });
  next();
});

// Geocode and location field
RestaurantSchema.pre("save", async function (next) {
  const loc = await geocoder.geocode(this.address);
  this.location = {
    type: "Point",
    coordinates: [loc[0].longitude, loc[0].latitude],
    formattedAddress: loc[0].formattedAddress,
    street: loc[0].streetName,
    city: loc[0].city,
    state: loc[0].stateCode,
    zipcode: loc[0].zipcode,
    country: loc[0].countryCode,
  };

  // Do not save address in DB
  this.address = undefined;
  next();
});

// Cascade delete courses when Restaurant is deleted

RestaurantSchema.pre("remove", async function (next) {
    console.log(`Dishes being removed from restaurant ${this._id}`)
  await this.model("Dish").deleteMany({ restaurant: this._id });
  next()
});

// Reverse populate with virtuals

RestaurantSchema.virtual("dishes", {
  ref: "Dish",
  localField: "_id",
  foreignField: "restaurant",
  justOne: false,
});

module.exports = mongoose.model('Restaurant', RestaurantSchema)