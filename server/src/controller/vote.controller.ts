import { Request, Response, NextFunction } from "express";
import asyncCatch from "../errors/catchAsync";
import customError from "../errors/customError";
import { prisma } from "../models/db";

export const Vote = {
  addvote: asyncCatch(
    async (req: Request, res: Response, next: NextFunction) => {
      const user_id = req.user.id as number;
      if (!user_id) return next(new customError("Provide user ID", 404));

      const candidate_id = req.params.candidate_id as unknown as number;
      if (!candidate_id)
        return next(new customError("Provide candidate ID", 404));

      const election_id = req.params.election_id as unknown as number;
      if (!election_id)
        return next(new customError("Provide election ID", 404));
      const voter = await prisma.voter.findFirst({
        where: {
          user_id,
        },
      });

      //check if there in no voter of that id 
      if (!voter)
        return next(new customError("You are not authorized to vote", 404));

      const checkVote = await prisma.vote.findFirst({
        where: {
          voter_id: voter.voter_id,
          election_id,
        },
      });
      if (checkVote)
        return next(new customError("You have already voted", 404));

      const election = await prisma.election.findFirst({
        where: {
          election_id,
        },
      });
      if (!election)
        return next(new customError("Election does not exists", 404));

      const start_time = election.start_date as Date;
      const end_time = election.end_date as Date;
      const current_time = new Date();
      if (current_time < start_time || current_time > end_time)
        return next(new customError("Voting time is over", 404));

      const addVote = prisma.vote.create({
        data: {
          voter_id: voter.voter_id,
          candidate_id,
          election_id,
        },
      });
      //vote is incremented

      const incrementVoteCount = prisma.candidate.update({
        where: { candidate_id },
        data: { vote_count: { increment: 1 } },
      });

      const transaction = await prisma.$transaction([
        addVote,
        incrementVoteCount,
      ]);

      res.status(200).json(transaction);
    }
  ),
};
