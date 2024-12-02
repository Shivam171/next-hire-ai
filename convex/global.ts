import { query } from "./_generated/server";
import { v } from "convex/values";
import { getUserInCollections } from "./userHelpers";

export const checkUserInCollections = query({
    args: { userId: v.optional(v.string()) },
    handler: async (ctx, args) => {
        const { userId } = args;

        if (!userId) {
            return {
                existsInRecruiters: false,
                existsInPdfs: false,
            };
        }

        // Call the helper function to check if the user exists in both collections
        const { existsInRecruiters, existsInPdfs } = await getUserInCollections(ctx, userId);

        // Return the results
        return {
            existsInRecruiters,
            existsInPdfs,
        };
    },
});

// Get all data from the "recruiters" collection
export const getAllRecruiters = query({
    handler: async (ctx) => {
        const recruiters = await ctx.db.query("recruiters").collect();
        return recruiters;
    },
})

// Get all data from the "pdfs" collection
export const getAllJobSeekers = query({
    handler: async (ctx) => {
        const pdfs = await ctx.db.query("pdfs").collect();
        return pdfs;
    },
})
