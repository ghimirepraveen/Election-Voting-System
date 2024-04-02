import { Request, Response, NextFunction } from "express";
import asyncCatch from "../errors/catchAsync";
import customError from "../errors/customError";
import { prisma } from "../models/db";

export const Election = {
  addElection: asyncCatch(
    async (req: Request, res: Response, next: NextFunction) => {
      const { name, start_date, end_date, description, candidacyends } =
        req.body;

      if (!name || !start_date || !end_date || !description || !candidacyends) {
        return next(new customError("Provide all data", 404));
      }

      const admin_id = req.user.id;
      if (!admin_id) {
        return next(new customError("Provide ID", 404));
      }
      const election = await prisma.election.create({
        data: {
          admin: { connect: { admin_id } },
          name,
          start_date,
          end_date,
          description,
          candidacyends,
        },
      });
      res.status(200).json({
        status: "success",
        election,
      });
    }
  ),
  getAllElection: asyncCatch(
    async (req: Request, res: Response, next: NextFunction) => {
      const election = await prisma.election.findMany();
      res.status(200).json({
        status: "success",
        election,
      });
    }
  ),
  getElectionById: asyncCatch(
    async (req: Request, res: Response, next: NextFunction) => {
      const id = Number(req.params.electionid);
      if (!id) {
        return next(new customError("Provide ID", 404));
      }
      const election = await prisma.election.findUnique({
        where: {
          election_id: id,
        },
      });
      res.status(200).json({
        status: "success",
        election,
      });
    }
  ),

  getElectionBeforeEndDate: asyncCatch(
    async (req: Request, res: Response, next: NextFunction) => {
      const election = await prisma.election.findMany({
        where: {
          admin_id: req.user.id,
          end_date: {
            lte: new Date(),
          },
        },
      });
      res.status(200).json({
        status: "success",
        election,
      });
    }
  ),
  updateElection: asyncCatch(
    async (req: Request, res: Response, next: NextFunction) => {
      const id = Number(req.params.electionid);
      const { name, start_date, end_date, description } = req.body;
      if (!name || !start_date || !end_date || !description) {
        return next(new customError("Provide all data", 404));
      }
      const election = await prisma.election.update({
        where: {
          election_id: id,
        },
        data: {
          name,
          start_date,
          end_date,
          description,
        },
      });
      res.status(200).json({
        status: "success",
        election,
      });
    }
  ),
  deleteElection: asyncCatch(
    async (req: Request, res: Response, next: NextFunction) => {
      const id = Number(req.params.electionid);
      if (!id) {
        return next(new customError("Provide ID", 404));
      }
      const election = await prisma.election.delete({
        where: {
          election_id: id,
        },
      });
      res.status(200).json({
        status: "success",
        election,
      });
    }
  ),
  getAllVoteCountOfElection: asyncCatch(
    async (req: Request, res: Response, next: NextFunction) => {
      const id = Number(req.params.electionid);
      if (!id) {
        return next(new customError("Provide ID", 404));
      }
      const election = await prisma.election.findUnique({
        where: {
          election_id: id,
        },
        select: {
          candidates: true,
        },
      });
      res.status(200).json({
        status: "success",
        election,
      });
    }
  ),

  getWinner: asyncCatch(
    async (req: Request, res: Response, next: NextFunction) => {
      const id = Number(req.params.electionid);
      if (!id) {
        return next(new customError("Provide ID", 404));
      }
      //check either there is election or not with this id
      const electionExist = await prisma.election.findUnique({
        where: {
          election_id: id,
        },
      });
      if (!electionExist) {
        return next(new customError("No election found with this id", 404));
      }

      //check election time is over or not
      const electionTime = await prisma.election.findUnique({
        where: {
          election_id: id,
        },
        select: {
          end_date: true,
        },
      });
      console.log("electionTime", electionTime);
      const current_time = new Date();
      if (!electionTime || current_time < electionTime.end_date) {
        return next(new customError("Election time is not over", 404));
      }

      const election = await prisma.election.findUnique({
        where: {
          election_id: id,
        },
        select: {
          candidates: true,
        },
      });
      const winner = election?.candidates.reduce((prev, current) =>
        prev.vote_count > current.vote_count ? prev : current
      );
      res.status(200).json({
        status: "success",
        winner,
      });
    }
  ),
};
