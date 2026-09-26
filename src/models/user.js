import { Schema } from "mongoose";
import { model } from "mongoose";

// ЦЕ НАПИСАНА "ЗАГЛУШКА", ЩОБ НЕ ЛАМАВСЯ КОД ДЛЯ authenticate.js
// ЦЕЙ ФАЙЛ ТИМЧАСОВИЙ

const userSchema = new Schema(
  {
    username: {
      type: String,
    },
    email: {
      type: String,
    },
    password: {
      type: String,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

userSchema.pre("save", function () {
  if (!this.username) {
    this.username = this.email;
  }
});

userSchema.methods.toJSON = function () {
  const obj = this.toObject();
  delete obj.password;
  return obj;
};

export const User = model("User", userSchema);
