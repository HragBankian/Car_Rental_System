import mongoose, { Schema, models } from "mongoose";

const reservationSchema = new Schema(
  {
    userID: {
      type: Schema.Types.ObjectId,
      ref: "User",
      default: "",
      required: true,
    },
    vehicleID: {
      type: Schema.Types.ObjectId,
      ref: "Vehicle",
      default: "",
      required: true,
    },
    pickupDate: {
      type: Date,
      default: "",
      required: true,
    },
    endDate: {
      type: Date,
      default: "",
      required: true,
    },
    extraFeatures: {
      type: String,
      default: "",
      required: true,
    },
  },
  { timestamps: true }
);

const Reservation = models.Reservation || mongoose.model("Reservation", reservationSchema);
export default Reservation;
