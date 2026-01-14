import { db } from "@/server/api/db";
import {Octokit} from "octokit";
import axios from "axios";
import { AIsummariseCommit } from './gemini';
export const octokit = new Octokit({
    auth: process.env.GITHUB_TOKEN,
});

const githubUrl = 'https://github.com/docker/genai-stack';

interface Response {
  commitHash: string;
  commitMessage: string;
  commitAuthorName: string;
  commitAuthorAvatar: string;
  commitDate: string;
}

export const getCommitHashes = async (githubUrl: string): Promise<Response[]> => {
    const [owner, repo] = githubUrl.split('/').slice(-2)
    if(!owner || !repo){
        throw new Error("Invalid github url!")
    }
    const { data } = await octokit.rest.repos.listCommits({
      owner,
      repo
    })
  
    const sortedCommits = data.sort((a: any, b: any) => 
        new Date(b.commit.author.date).getTime() - new Date(a.commit.author.date).getTime()
      ) as any[];
      
      return sortedCommits.slice(0, 15).map((commit: any) => ({
        commitHash: commit.sha as string,
        commitMessage: commit.commit?.message ?? "",
        commitAuthorName: commit.commit?.author?.name ?? "",
        commitAuthorAvatar: commit.commit?.author?.avatar_url ?? "",
        commitDate: commit.commit?.author?.date ?? ""
      }));
    }
      
    export const pollCommits = async (projectId: string) => {
        const { project, githubUrl } = await fetchProjectGithubUrl(projectId);
        const commitHashes = await getCommitHashes(githubUrl);
        
        // Use Promise.all to process and upsert commits concurrently
        await Promise.all(commitHashes.map(async (commit) => {
            try {
                let summary = await summariseCommit(githubUrl, commit.commitHash) || "";
                // Strip HTML tags from the summary
                summary = summary.replace(/<[^>]*>?/gm, '');
                await db.commit.upsert({
                    where: {
                        projectId_commitHash: {
                            projectId: projectId,
                            commitHash: commit.commitHash
                        }
                    },
                    update: {
                        commitMessage: commit.commitMessage,
                        commitAuthorName: commit.commitAuthorName,
                        commitAuthorAvatar: commit.commitAuthorAvatar,
                        commitDate: commit.commitDate,
                        summary: summary
                    },
                    create: {
                        projectId: projectId,
                        commitHash: commit.commitHash,
                        commitMessage: commit.commitMessage,
                        commitAuthorName: commit.commitAuthorName,
                        commitAuthorAvatar: commit.commitAuthorAvatar,
                        commitDate: commit.commitDate,
                        summary: summary
                    }
                });
            } catch (error) {
                console.error(`Error upserting commit ${commit.commitHash}:`, error);
            }
        }));
    };

    async function summariseCommit(githubUrl: string, commitHash: string) {
        // get the diff, then pass the diff into AI
        const { data } = await axios.get(`${githubUrl}/commit/${commitHash}.diff`, {
          headers: {
            Accept: 'application/vnd.github.v3.diff'
          }
        });

        return await AIsummariseCommit(data) || "";
    }
      


      
      async function fetchProjectGithubUrl(projectId: string) {
        const project = await db.project.findUnique({
          where: { id: projectId },
          select: {
            githubUrl: true
          }
        });
      
        if (!project?.githubUrl) {
          throw new Error("Project has no github url");
        }
      
        return { project, githubUrl: project.githubUrl };
      }
      
      async function filterUnprocessedCommits(projectId: string, commitHashes: Response[]) {
        const processedCommits = await db.commit.findMany({
          where: { projectId }
        });
      
        const unprocessedCommits = commitHashes.filter(
          (commit) => !processedCommits.some(
            (processedCommit) => processedCommit.commitHash === commit.commitHash
          )
        );
      
        return unprocessedCommits;
      }

     /*  await pollCommits('cm8euifmq0003bp4sos1oyzwp').then(console.log) */

 