import { Request, Response } from "express";
import { prisma } from "../index";
import { AuthenticatedRequest } from "../types";

const getAllPosts = async (req: Request, res: Response) => {
    try {
        const posts = await prisma.post.findMany({
            include: {
                comments: {
                    include: {
                        user: {
                            select: {
                                id: true,
                                name: true,
                                email: true,
                                emailVerified: true,
                                image: true,
                            }
                        }
                    },
                    orderBy: {
                        createdAt: 'desc'
                    }
                },
                kudos: {
                    include: {
                        user: {
                            select: {
                                id: true,
                                name: true,
                                email: true,
                                emailVerified: true,
                                image: true,
                            }
                        }
                    }
                },
                user: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                        emailVerified: true,
                        image: true,
                    }
                }
                },
                orderBy: {
                    createdAt: 'desc'
                }
            });

            if (!posts) {
                throw new Error("No posts found");
            }

            res.json(posts);
    } catch (error: any) {
        throw new Error(error.message);
    }
};

const getPostById = async (req: Request, res: Response) => {
    const id = req.params.id;

    console.log(id);

    try {
        const post = await prisma.post.findUnique({
            where: {
                id: id
            },
            include: {
                comments: {
                    include: {
                        user: {
                            select: {
                                id: true,
                                name: true,
                                email: true,
                                emailVerified: true,
                                image: true,
                            }
                        }
                    },
                    orderBy: {
                        createdAt: 'desc'
                    }
                },
                kudos: {
                    include: {
                        user: {
                            select: {
                                id: true,
                                name: true,
                                email: true,
                                emailVerified: true,
                                image: true,
                            }
                        }
                    }
                },
                user: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                        emailVerified: true,
                        image: true,
                    }
                }
            }
        })

        if (!post) {
            throw new Error("Post not found");
        }

        res.json(post);
    } catch (error: any) {
        throw new Error(error.message);
    }
};

const createPost = async (req: AuthenticatedRequest, res: Response) => {
    const file = req.file;
    const { content } = req.body;

    if (!content || !file?.path) {
        throw new Error("Content and Image is required");
    }

    const user = req.user;

    if (!user) {
        throw new Error("Unauthorized");
    }

    if(user.role !== "MENTOR" && user.role !== "MENTEE") {
        throw new Error("Unauthorized");
    }

    try {
        const post = await prisma.post.create({
            data: {
                userId: user.id,
                content,
                imageUrl: file.path,
            }
        })

        if (!post) {
            throw new Error("Error while creating post.");
        }

        res.status(201).json("Post created successfully");
    } catch (error: any) {
        throw new Error(error.message);
    }
};

const deletePost = async (req: AuthenticatedRequest, res: Response) => {
    const id = req.params.id;

    const user = req.user;

    if (!user) {
        throw new Error("Unauthorized");
    }

    if(user.role !== "MENTOR" && user.role !== "MENTEE") {
        throw new Error("Unauthorized");
    }

    try {
        const post = await prisma.post.findUnique({
            where: {
                id: id,
                userId: user.id
            }
        })

        if (!post) {
            throw new Error("Post not found.");
        }

        const deletePost = await prisma.post.delete({
            where: {
                id: id
            }
        })

        if (!deletePost) {
            throw new Error("Error while deleting post.");
        }

        res.json("Post deleted successfully");
    } catch (error: any) {
        throw new Error(error.message);
    }
};

const likePost = async (req: AuthenticatedRequest, res: Response) => {
    const id = req.params.id;

    const user = req.user;

    if (!user) {
        throw new Error("Unauthorized");
    }

    if(user.role !== "MENTOR" && user.role !== "MENTEE") {
        throw new Error("Unauthorized");
    }

    try {
        const post = await prisma.post.findUnique({
            where: {
                id: id
            }
        })

        if (!post) {
            throw new Error("Post not found.");
        }

        const kudo = await prisma.kudo.findFirst({
            where: {
                postId: id,
                userId: user.id
            }
        })

        if (kudo) {
            await prisma.kudo.delete({
                where: {
                    userId_postId: {
                        userId: user.id,
                        postId: id
                    }
                }
            })

            res.status(200).json("Post unliked successfully");
        } else {
            await prisma.kudo.create({
                data: {
                    userId: user.id,
                    postId: id
                }
            })

            res.status(200).json("Post liked successfully");
        }
    } catch (error: any) {
        throw new Error(error.message);
    }
}

export default {
    getAllPosts,
    getPostById,
    createPost,
    deletePost,
    likePost
}