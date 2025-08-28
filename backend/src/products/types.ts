import type { IProduct } from "./model.js";
import type { Types } from "mongoose";

export type ProductResponse = Omit<IProduct, "categoryId"> & {
  categoryId: { _id: Types.ObjectId; name: string }; // reflect populated category
};
