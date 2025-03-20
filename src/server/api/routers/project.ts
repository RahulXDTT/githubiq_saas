import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../trpc";
import { TRPCError } from "@trpc/server";
import { pollCommits } from "@/lib/github";
import { indexGithubRepo } from "@/lib/github-loader";

export const projectRouter = createTRPCRouter({
    createProject: protectedProcedure
        .input(
            z.object({
                name: z.string(),
                githubUrl: z.string(),
                githubToken: z.string().optional(),
            })
        )
        .mutation(async ({ ctx, input }) => {
           console.log("Auth user ID:", ctx.user.userId);
           console.log("Database user:", ctx.dbUser);
           
           try {
               // Create project with relationship
               const project = await ctx.db.project.create({
                   data: {
                       githubUrl: input.githubUrl,
                       name: input.name,
                       userToProjects: {
                           create: {
                               userId: ctx.dbUser.id
                           }
                       }
                   },
                   include: {
                       userToProjects: true
                   }
               });
               
               console.log("Project created:", project);
               await indexGithubRepo(project.id, input.githubUrl, input.githubToken);
               await pollCommits(project.id);
               return project;
           } catch (error) {
               console.error("Error creating project:", error);
               throw new TRPCError({
                   code: 'INTERNAL_SERVER_ERROR',
                   message: 'Failed to create project',
                   cause: error
               });
           }
        }),

        getProjects: protectedProcedure.query(async ({ ctx }) => {
            return await ctx.db.project.findMany({
              where: {
                userToProjects: {
                  some: {
                    userId: ctx.user.userId!
                  }
                },
                deletedAt: null
              }
            })
          }),
          getCommits: protectedProcedure.input(z.object({
            projectId: z.string()
          })).query(async ({ ctx, input }) => {
            return await ctx.db.commit.findMany({ where: { projectId: input.projectId } });
          })
          
});