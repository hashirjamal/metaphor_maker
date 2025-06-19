// models/Content.ts

import mongoose, { Schema, Document, Model, models } from 'mongoose';

// 1. TypeScript Interface
export interface IContent extends Document {
  userId: string;
  algoTitle: string;
  algoSteps: string;
  metaphorName: string;
  metaphorDesc: string;
  src: string;
  createdAt?: Date;
  updatedAt?: Date;
}

// 2. Mongoose Schema
const ContentSchema = new Schema<IContent>({
  userId: { type: String, required: true },  // ✅ userId field
  algoTitle: { type: String, required: true },
  algoSteps: { type: String, required: true },
  metaphorName: { type: String, required: true },
  metaphorDesc: { type: String, required: true },
  src: { type: String, required: true },
}, {
  timestamps: true // ✅ adds createdAt and updatedAt automatically
});

// 3. Mongoose Model
export const MetaphorModel: Model<IContent> = models.Content || mongoose.model<IContent>('Metaphor', ContentSchema);
