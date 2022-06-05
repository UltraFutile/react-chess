import { SquareState } from "../model/SquareState";
import { Team } from "../Team";

export function destinationHasSameTeam (origTeam: Team, dest: SquareState) {
    return dest.piece && dest.piece.team === origTeam;
}