import { QueryCtx } from "./_generated/server";

// Helper function to get user data from both collections
export async function getUserInCollections(
    ctx: QueryCtx,
    userId: string | undefined
): Promise<{ existsInRecruiters: boolean; existsInPdfs: boolean }> {

    if (!userId) {
        return {
            existsInRecruiters: false,
            existsInPdfs: false,
        };
    }

    // Check if user exists in "recruiters" collection
    const recruiter = await ctx.db
        .query("recruiters")
        .filter((q) => q.eq(q.field("userId"), userId))
        .first();

    // Check if user exists in "pdfs" collection
    const pdf = await ctx.db
        .query("pdfs")
        .filter((q) => q.eq(q.field("userId"), userId))
        .first();

    return {
        existsInRecruiters: !!recruiter,
        existsInPdfs: !!pdf,
    };
}
