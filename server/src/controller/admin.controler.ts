import { Request, Response, NextFunction } from "express";
import asyncCatch from "../errors/catchAsync";
import { prisma } from "../models/db";
import customError from "../errors/customError";
const ADMIN = process.env.ADMIN;

export const Admin = {
  getAllVoters: asyncCatch(
    async (req: Request, res: Response, next: NextFunction) => {
      console.log(ADMIN, req.user.email);

      if (req.user.email !== ADMIN) {
        return next(
          new customError("You are not authorized to access this route", 401)
        );
      }

      const voters = await prisma.voter.findMany();
      res.status(200).json({
        status: "success",
        voters,
      });
    }
  ),
  getAllvoterNotVerified: asyncCatch(
    async (req: Request, res: Response, next: NextFunction) => {
      if (req.user.email !== ADMIN) {
        return next(
          new customError("You are not authorized to access this route", 401)
        );
      }
      const voters = await prisma.voter.findMany({
        where: {
          is_verified: false,
        },
      });
      res.status(200).json({
        status: "success",
        voters,
      });
    }
  ),

  getVoter: asyncCatch(
    async (req: Request, res: Response, next: NextFunction) => {
      const voterid = Number(req.params.voterid);
      if (req.user.email !== ADMIN) {
        return next(
          new customError("You are not authorized to access this route", 401)
        );
      }

      const userProfile = await prisma.voter.findUnique({
        where: {
          voter_id: voterid,
        },
      });
      res.status(200).json({
        status: "success",
        profile: userProfile,
      });
    }
  ),

  verfiyVoter: asyncCatch(
    async (req: Request, res: Response, next: NextFunction) => {
      if (req.user.email !== ADMIN) {
        return next(
          new customError("You are not authorized to access this route", 401)
        );
      }
      const voterid = Number(req.params.voterid);
      const voter = await prisma.voter.findUnique({
        where: {
          voter_id: voterid,
        },
      });

      if (!voter) next(new customError("Voter not found", 404));

      const verify = await prisma.voter.update({
        where: {
          voter_id: voterid,
        },
        data: {
          is_verified: true,
        },
      });

      res.status(200).json({
        status: "success",
        verify,
      });
    }
  ),

  deleteVoter: asyncCatch(
    async (req: Request, res: Response, next: NextFunction) => {
      const voterid = Number(req.params.voterid);

      if (req.user.email !== ADMIN) {
        return next(
          new customError("You are not authorized to access this route", 401)
        );
      }
      const voter = await prisma.voter.findUnique({
        where: {
          voter_id: voterid,
        },
      });

      if (!voter) next(new customError("Voter not found", 404));
      await prisma.voter.delete({
        where: {
          voter_id: voterid,
        },
      });

      res.status(200).json({
        status: "success",
        message: "Voter found",
        voter,
      });
    }
  ),

  getAllCandidates: asyncCatch(
    async (req: Request, res: Response, next: NextFunction) => {
      if (req.user.email !== ADMIN) {
        return next(
          new customError("You are not authorized to access this route", 401)
        );
      }

      const candidates = await prisma.candidate.findMany();
      res.status(200).json({
        status: "success",
        candidates,
      });
    }
  ),
  getAllCandidatesNotVerified: asyncCatch(
    async (req: Request, res: Response, next: NextFunction) => {
      if (req.user.email !== ADMIN) {
        return next(
          new customError("You are not authorized to access this route", 401)
        );
      }
      const candidates = await prisma.candidate.findMany({
        where: {
          is_verified: false,
        },
      });
      res.status(200).json({
        status: "success",
        candidates,
      });
    }
  ),

  getCandidate: asyncCatch(
    async (req: Request, res: Response, next: NextFunction) => {
      const candidateid = Number(req.params.candidateid);
      if (req.user.email !== ADMIN) {
        return next(
          new customError("You are not authorized to access this route", 401)
        );
      }

      const candidateProfile = await prisma.candidate.findUnique({
        where: {
          candidate_id: candidateid,
        },
      });
      res.status(200).json({
        status: "success",
        profile: candidateProfile,
      });
    }
  ),
  verifyCandidate: asyncCatch(
    async (req: Request, res: Response, next: NextFunction) => {
      if (req.user.email !== ADMIN) {
        return next(
          new customError("You are not authorized to access this route", 401)
        );
      }
      const candidateid = Number(req.params.candidateid);
      const candidate = await prisma.candidate.findUnique({
        where: {
          candidate_id: candidateid,
        },
      });

      if (!candidate) next(new customError("Candidate not found", 404));
      const verify = await prisma.candidate.update({
        where: {
          candidate_id: candidateid,
        },
        data: {
          is_verified: true,
        },
      });

      res.status(200).json({
        status: "success",
        candidate,
      });
    }
  ),
  deleteCandidate: asyncCatch(
    async (req: Request, res: Response, next: NextFunction) => {
      const candidateid = Number(req.params.candidateid);

      if (req.user.email !== ADMIN) {
        return next(
          new customError("You are not authorized to access this route", 401)
        );
      }
      const candidate = await prisma.candidate.findUnique({
        where: {
          candidate_id: candidateid,
        },
      });

      if (!candidate) next(new customError("Candidate not found", 404));
      await prisma.candidate.delete({
        where: {
          candidate_id: candidateid,
        },
      });

      res.status(200).json({
        status: "success",
        message: "Candidate found",
        candidate,
      });
    }
  ),
};

//should change this ligic for controller whole code is repeating
