import { Request, Response, NextFunction } from "express";
import asyncCatch from "../errors/catchAsync";
import customError from "../errors/customError";
import { prisma } from "../models/db";
import exp from "constants";

export const Candidancy = {
  addCandidancy: asyncCatch(
    async (req: Request, res: Response, next: NextFunction) => {
      const user_id = req.user.id as number;
      if (!user_id) return next(new customError("Provide candidate ID", 404));
      const election_id = req.params.electionid as unknown as number;

      if (!election_id)
        return next(new customError("Provide election ID", 404));

      const checkCandidancy = await prisma.electionCandidacy.findFirst({
        where: {
          user_id,
        },
      });
      if (!checkCandidancy)
        return next(new customError("You have already applied", 404));

      //check candiancy end time
      const election = await prisma.election.findFirst({
        where: {
          election_id,
        },
      });
      if (!election)
        return next(new customError("Election does not exists", 404));
      const end_time = election.candidacyends as Date;
      const current_time = new Date();
      if (current_time > end_time)
        return next(new customError("Candidancy time is over", 404));

      const candidate_id = checkCandidancy?.candidate_id as number;
      const addCandidancy = await prisma.electionCandidacy.create({
        data: {
          user_id,
          candidate_id,
          election_id: election_id,
        },
      });
      res.status(200).json(addCandidancy);
    }
  ),

  deleteCandidancy: asyncCatch(
    async (req: Request, res: Response, next: NextFunction) => {
      const user_id = req.user.id as number;
      if (!user_id) return next(new customError("Provide user ID", 404));
      const election_id = req.params.election_id as unknown as number;

      if (!election_id)
        return next(new customError("Provide election ID", 404));
      //candidancy should deleted before election starts
      const election = await prisma.election.findFirst({
        where: {
          election_id,
        },
      });
      if (!election)
        return next(new customError("Election does not exists", 404));
      const start_time = election.start_date as Date;
      const current_time = new Date();
      if (current_time > start_time)
        return next(new customError("Election has already started", 404));
      //after success then delete the election
      const deleteCandidancy = await prisma.electionCandidacy.delete({
        where: {
          user_id,
          election_id,
        },
      });
      res.status(200).json(deleteCandidancy);
    }
  ),
  getelectionCandidancy: asyncCatch(
    async (req: Request, res: Response, next: NextFunction) => {
      const election_id = req.params.election_id as unknown as number;
      if (!election_id)
        return next(new customError("Provide election ID", 404));
      const getelectionCandidancy = await prisma.electionCandidacy.findMany({
        where: {
          election_id,
        },
      });
      res.status(200).json(getelectionCandidancy);
    }
  ),
};
