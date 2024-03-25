import { Prisma } from "@prisma/client";

declare global {
  namespace Express {
    export interface User extends Prisma.UserFieldRefs {}
    export interface Vote extends Prisma.VoteFieldRefs {}
    export interface Candidate extends Prisma.CandidateFieldRefs {}
    export interface Voter extends Prisma.VoterFieldRefs {}
    export interface Admin extends Prisma.AdminFieldRefs {}
  }
}
