type Content = {
  algoTitle:string
  algoSteps:string
  metaphorName:string
  metaphorDesc:string
  src:string
  userId:string
  _id?:string // mongo db will add it later
}

interface IContent extends Document {
  userId: string;
  algoTitle: string;
  algoSteps: string;
  metaphorName: string;
  metaphorDesc: string;
  src: string;
  createdAt?: Date;
  updatedAt?: Date;
}