import { Team } from "../../Team";
import { Piece } from "../PieceProps";
import { SquareState } from "../SquareState";

export class TeamManager {
    private whitePieceMap: Record<Piece, Set<SquareState>>;
    private blackPieceMap: Record<Piece, Set<SquareState>>;

    constructor() {
        this.whitePieceMap = {
            king: new Set<SquareState>(),
            queen: new Set<SquareState>(),
            bishop: new Set<SquareState>(),
            knight:new Set<SquareState>(),
            pawn: new Set<SquareState>(),
            rook: new Set<SquareState>(),
        };

        this.blackPieceMap = {
            king: new Set<SquareState>(),
            queen: new Set<SquareState>(),
            bishop: new Set<SquareState>(),
            knight:new Set<SquareState>(),
            pawn: new Set<SquareState>(),
            rook: new Set<SquareState>(),
        };
    }

    addPiece(team: Team, piece: Piece, square: SquareState) {
        const teamMap = this.getTeamMap(team);
        teamMap[piece].add(square);
    }

    removePiece(team: Team, piece: Piece, square: SquareState) {
        const teamMap = this.getTeamMap(team);
        teamMap[piece].delete(square);
    }

    getKing(team: Team): SquareState {
        const teamMap = this.getTeamMap(team);
        return teamMap['king'].values().next().value;
    }

    public getPieceMap(team: Team): Record<Piece, Set<SquareState>> {
        return this.getTeamMap(team);
    }

    private getTeamMap(team: Team): Record<Piece, Set<SquareState>> {
        return team === Team.White ? this.whitePieceMap : this.blackPieceMap;
    }
}