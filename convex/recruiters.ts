import { v } from 'convex/values';
import { mutation, query } from './_generated/server';

export const addRecruiter = mutation({
    args: {
        userId: v.string(),
        role: v.optional(v.string()),
        recruiterDetails: v.object({
            name: v.string(),
            email: v.string(),
            role: v.string(),
            company: v.string(),
            profileImage: v.string(),
            inbox: v.optional(v.object({
                message: v.optional(v.object({
                    resumeKeyword: v.array(v.string()),
                    resumeUrl: v.string(),
                    userImg: v.string(),
                    userName: v.string(),
                })),
                sender: v.string(),
                timestamp: v.number(),
            })),
        }),
        creationTime: v.optional(v.number()),
    },

    handler: async (ctx, args) => {
        const { userId, recruiterDetails } = args;

        // Save the recruiter details
        const newRecruiter = {
            userId,
            ...recruiterDetails,
        };

        try {
            const recruiterId = await ctx.db.insert('recruiters', newRecruiter);
            return { success: true, id: recruiterId };
        } catch (error) {
            console.error('Error inserting recruiter:', error);
            return { success: false, error: 'Failed to save recruiter' };
        }
    },
});

export const getUserRole = query({
    args: { userId: v.string() },
    handler: async (ctx, args) => {
        const { userId } = args;
        const recruiter = await ctx.db
            .query('recruiters')
            .filter(q => q.eq(q.field('userId'), userId))
            .first();

        if (!recruiter) {
            return { success: false, message: 'User not found' };
        }

        return { success: true, role: recruiter.role || null };
    },
});

export const getRecruiterDetails = query({
    args: { userId: v.string() },
    handler: async (ctx, args) => {
        const { userId } = args;
        const recruiter = await ctx.db
            .query('recruiters')
            .filter(q => q.eq(q.field('userId'), userId))
            .first();

        if (!recruiter) {
            return { success: false, message: 'Recruiter not found' };
        }

        return { success: true, recruiterDetails: recruiter };
    },
})

export const getRecruiterInbox = query({
    args: { userId: v.string() },
    handler: async (ctx, args) => {
        const { userId } = args;

        // Fetch the recruiter's inbox from the database
        const recruiter = await ctx.db
            .query('recruiters')
            .filter(q => q.eq(q.field('userId'), userId))
            .first();

        if (!recruiter) {
            return { success: false, message: 'Recruiter not found' };
        }

        return recruiter.inbox;
    },
});

export const updateRecruiterInbox = mutation({
    args: {
        userId: v.string(),
        inbox: v.object({
            message: v.optional(v.object({
                resumeKeyword: v.array(v.string()),
                resumeUrl: v.string(),
                userImg: v.string(),
                userName: v.string(),
            })),
            sender: v.string(),
            timestamp: v.number(),
        }),
    },
    handler: async (ctx, args) => {
        const { userId, inbox } = args;

        // Fetch the recruiter from the database
        const recruiter = await ctx.db
            .query('recruiters')
            .filter(q => q.eq(q.field('userId'), userId))
            .first();

        if (!recruiter) {
            return { success: false, message: 'Recruiter not found' };
        }

        // Add the new inbox entry to the existing inbox
        const updatedInbox = recruiter.inbox ? [...recruiter.inbox, inbox] : [inbox];

        try {
            // Use patch to update the inbox field
            await ctx.db.patch(recruiter._id, { inbox: updatedInbox });

            return { success: true, inbox: updatedInbox };
        } catch (error) {
            console.error('Error updating inbox:', error);
            return { success: false, error: 'Failed to update inbox' };
        }
    },
});



