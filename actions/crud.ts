import { connectToDatabase } from '@/lib/mongoose';  // your connection util
import { MetaphorModel } from '@/model';          // your model

export async function insertDummyContent() {
  await connectToDatabase();  // ensures DB connection

  const dummy = new MetaphorModel({
    userId: 'user123',
    algoTitle: 'Bubble Sort',
    algoSteps: '1. Compare adjacent elements\n2. Swap if out of order\n3. Repeat',
    metaphorName: 'Soda Bubbles',
    metaphorDesc: 'Like bubbles rising in soda, the biggest numbers "bubble up" to the top!',
    src: 'https://example.com/bubble-sort-illustration.png',
  });

  const result = await dummy.save();
  console.log('Dummy content inserted:', result);
}

insertDummyContent().catch(console.error);
