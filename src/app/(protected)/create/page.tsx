"use client";

import { api } from "@/trpc/react";
import React from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import useRefetch from '../../../hooks/use-refetch';

type FormInput = {
    repoUrl: string;
    projectName: string;
    githubToken?: string;
};

const CreatePage = () => {
    const { register, handleSubmit, reset } = useForm<FormInput>();
    const createProject = api.project.createProject.useMutation()
    const refetch = useRefetch()

    function onSubmit(data: FormInput) {
        
        createProject.mutate({
            githubUrl: data.repoUrl,
            name: data.projectName,
            githubToken: data.githubToken
        },{
            onSuccess: () => {
                toast.success('Projected created successfully')
                refetch()
                reset()
            },

            onError: () =>  {
                toast.error('Failed to create project')
            },
        })
        return true
    }

    return (
        <div className="flex items-center gap-12 h-screen justify-center bg-white">
            {/* Image Section */}
            <img src="/git.jpg" alt="create page image" className="h-80 w-auto" />
            
            {/* Form Section */}
            <div className="w-[400px]">
                <div className="font-semibold text-2xl mb-2">
                    <h1>Link your GitHub Repository</h1>
                    <p className="text-sm text-gray-500">
                        Enter the URL of your repository to link it to GitHubIQ
                    </p>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 mt-4">
                    <input
                        {...register("projectName", { required: true })}
                        placeholder="Project Name"
                        className="border border-gray-300 rounded-md px-4 py-2 w-full"
                        required
                    />

                    <input
                        {...register("repoUrl", { required: true })}
                        placeholder="Enter Repository URL"
                        className="border border-gray-300 rounded-md px-4 py-2 w-full"
                        type="url"
                        required
                    />

                    <input
                        {...register("githubToken")}
                        placeholder="GitHub Token (Optional)"
                        className="border border-gray-300 rounded-md px-4 py-2 w-full"
                    />

                    <button
                        type="submit" disabled={createProject.isPending}
                        className="bg-purple-500 text-white px-4 py-2 rounded-md hover:bg-purple-600 w-full"
                    >
                        Create Project
                    </button>
                </form>
            </div>
        </div>
    );
};

export default CreatePage;
