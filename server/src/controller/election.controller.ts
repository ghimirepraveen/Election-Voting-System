import { Request, Response, NextFunction } from "express";
import asyncCatch from "../errors/catchAsync";
import customError from "../errors/customError";
import { prisma } from "../models/db";

export const Election = {
  addElection: asyncCatch(
    async (req: Request, res: Response, next: NextFunction) => {
      const { name, start_date, end_date, description, cadidatancyends } =
        req.body;

      if (
        !name ||
        !start_date ||
        !end_date ||
        !description ||
        !cadidatancyends
      ) {
        return next(new customError("Provide all data", 404));
      }

      const id = req.user.id;
      if (!id) {
        return next(new customError("Provide ID", 404));
      }
      const election = await prisma.election.create({
        data: {
          admin_id: id,
          name,
          start_date,
          end_date,
          description,
          cadidatancyends,
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
      const election = await prisma.election.findMany({
        where: {
          admin_id: req.user.id,
        },
      });
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

      //check election time is over or not
      const electionTime = await prisma.election.findUnique({
        where: {
          election_id: id,
        },
        select: {
          end_date: true,
        },
      });
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
