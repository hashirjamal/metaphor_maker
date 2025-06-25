"use server"
import { MetaphorModel } from '@/model'; // Adjust your import path
import { connectToDatabase } from '@/lib/mongooseConn';


const getTodayRange = () => {
    const start = new Date();
    start.setHours(0, 0, 0, 0);

    const end = new Date();
    end.setHours(23, 59, 59, 999);

    return { start, end };
};

// Server-side rate limit checker
export const checkRateLimit = async (userId?: string): Promise<boolean> => {
    const { start, end } = getTodayRange();


    if (userId) {
        await connectToDatabase()
        const count = await MetaphorModel.countDocuments({
            userId,
            createdAt: { $gte: start, $lte: end },
        });

        return count < 5;
    }

    return false;
};
