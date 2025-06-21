import mongoose, { Schema, Document, Model, models } from 'mongoose';

const ContentSchema = new Schema<IContent>({
  userId: { type: String, required: true },  
  algoTitle: { type: String, required: true },
  algoSteps: { type: String, required: true },
  metaphorName: { type: String, required: true },
  metaphorDesc: { type: String, required: true },
  src: { type: String, required: true },
}, {
  timestamps: true 
});

export const MetaphorModel: Model<IContent> = models.Metaphor || mongoose.model<IContent>('Metaphor', ContentSchema);
