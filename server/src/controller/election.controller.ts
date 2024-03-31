import { Request, Response, NextFunction } from "express";
import asyncCatch from "../errors/catchAsync";
import customError from "../errors/customError";
import { prisma } from "../models/db";

export const Election = {
  addElection: asyncCatch(
    async (req: Request, res: Response, next: NextFunction) => {
      const { name, start_date, end_date, description } = req.body;

      if (!name || !start_date || !end_date || !description) {
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
};
