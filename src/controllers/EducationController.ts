import { Request, Response } from "express";
import { prisma } from "../index";
import { AuthenticatedRequest } from "../types";
import { CreateEducationSchema } from "../schemas/EducationSchema";

const createEducation = async (req: AuthenticatedRequest, res: Response) => {
  const { institution, country, level, major, startYear, endYear } = req.body;

  const user = req.user;

  if(!user) {
    throw new Error("Unauthorized");
  }

  if(user.role !== "MENTOR" && user.role !== "MENTEE") {
    throw new Error("Unauthorized");
  };

  try {
    const existingEducation = await prisma.education.findFirst({
      where: {
        userId: user.id
      }
    })

    if(existingEducation) {
      throw new Error("Education already exists");
    }

    const education = await prisma.education.create({
      data: {
        userId: user.id,
        institution,
        country,
        level,
        major,
        startYear: parseInt(startYear),
        endYear: parseInt(endYear)
      }
    })

    if(!education) {
      throw new Error("Error while creating education.");
    }

    res.json("Education created successfully");
    
  } catch (err: any) {
      throw new Error(err.message);
  }
};

const verifyEducation = async (req: AuthenticatedRequest, res: Response) => {
  const { documentType, documentUrl } = req.body;

  const user = req.user;

  if(!user) {
    throw new Error("Unauthorized");
  }

  if(user.role !== "MENTOR" && user.role !== "MENTEE") {
    throw new Error("Unauthorized");
  };

  try {
    const education = await prisma.education.findFirst({
      where: {
        userId: user.id
      }
    });
  
    if(!education) {
       return res.status(404).json({ error: "Education not found" });
    }

    const existingEducationVerification = await prisma.educationVerification.findFirst({
      where: {
        educationId: education.id
      }
    });

    if(existingEducationVerification) {
      throw new Error("Education verification already exists");
    }

    const educationVerification = await prisma.educationVerification.create({
      data: {
        educationId: education.id,
        documentType,
        documentUrl
      }
    });

    if(!educationVerification) {
      throw new Error("Error while creating education verification.");
    }

    res.json("Education verification created successfully");
    
  } catch (err: any) {
    throw new Error(err.message);
  }
};

const getUserEducation = async (req: AuthenticatedRequest, res: Response) => {
  const user = req.user;

  if(!user) {
    throw new Error("Unauthorized");
  }

  if(user.role !== "MENTOR" && user.role !== "MENTEE") {
    throw new Error("Unauthorized");
  };

  try {
    const education = await prisma.education.findFirst({
      where: {
        userId: user.id
      }
    });

    if(!education) {
      return res.status(404).json({ error: "Education not found" });
    }

    res.json(education);
    
  } catch (err: any) {
    throw new Error(err.message);
  }
};

export default {
  createEducation,
  verifyEducation,
  getUserEducation
};


