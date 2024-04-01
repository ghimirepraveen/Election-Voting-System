import { Request, Response, NextFunction } from "express";
import asyncCatch from "../errors/catchAsync";
import { prisma } from "../models/db";
import customError from "../errors/customError";
import { checkAdminMail } from "../utils/checkaAdminMail";
import {
  getDetails,
  getDetailsForVerified,
  getAllEntityNotVerified,
  getAllEntity,
  deleteEntity,
  verifyEntity,
} from "../utils/admin";

export const adminController = (userType: "voter" | "candidate") => ({
  getdetails: asyncCatch(
    async (req: Request, res: Response, next: NextFunction) => {
      const id = Number(req.params.voterid);
      if (!id) {
        return next(new customError("Provide ID", 404));
      }

      const details = await getDetails(userType, id);
      res.status(200).json({
        status: "success",
        details,
      });
    }
  ),
  getDetailsForVerified: asyncCatch(
    async (req: Request, res: Response, next: NextFunction) => {
      const details = await getDetailsForVerified(userType);
      const email = req.user.email;

      res.status(200).json({
        status: "success",
        details,
      });
    }
  ),
  getAllEntityNotVerified: asyncCatch(
    async (req: Request, res: Response, next: NextFunction) => {
      const details = await getAllEntityNotVerified(userType);
      res.status(200).json({
        status: "success",
        details,
      });
    }
  ),

  getAllEntity: asyncCatch(
    async (req: Request, res: Response, next: NextFunction) => {
      const details = await getAllEntity(userType);
      res.status(200).json({
        status: "success",
        details,
      });
    }
  ),
  verifyEntity: asyncCatch(
    async (req: Request, res: Response, next: NextFunction) => {
      const id = Number(req.params.voterid);
      if (!id) {
        return next(new customError("Provide ID", 404));
      }

      const details = await verifyEntity(userType, id);
      res.status(200).json({
        status: "success",
        details,
      });
    }
  ),

  deleteEntity: asyncCatch(
    async (req: Request, res: Response, next: NextFunction) => {
      const id = Number(req.params.voterid);
      if (!id) {
        return next(new customError("Provide ID", 404));
      }

      const details = await deleteEntity(userType, id);
      res.status(200).json({
        status: "success",
        details,
      });
    }
  ),
  //after this all code is for election controller
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
});
