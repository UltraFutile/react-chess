import { Team } from "../../Team";
import { Piece } from "../PieceProps";
import { SquareState } from "../SquareState";

export class TeamManager {
    private whitePieceMap: Record<Piece, Set<SquareState>>;
    private blackPieceMap: Record<Piece, Set<SquareState>>;
    private _attackingTeam: Team;

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

        this._attackingTeam = Team.White;
    }

    addPiece(team: Team, piece: Piece, square: SquareState) {
        const teamMap = this.getTeamMap(team);

        if (piece === 'king' && teamMap.king.size > 0) {
            throw new Error(`Attempted to add king at ${square.file} ${square.rank} when team ${this.getTeamString(team)} already has a king`);
        }

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

    changeTurn() {
        this._attackingTeam = this._attackingTeam === Team.White ? Team.Black : Team.White;
    }

    isTeamsTurn(team: Team): boolean {
        return this._attackingTeam === team;
    }

    get attackingTeam(): Team {
        return this._attackingTeam;
    }

    get defendingTeam(): Team {
        return this._attackingTeam === Team.White ? Team.Black : Team.White;
    }

    private getTeamMap(team: Team): Record<Piece, Set<SquareState>> {
        return team === Team.White ? this.whitePieceMap : this.blackPieceMap;
    }

    public getPieceIterator(team: Team, pieces?: Piece[]) {
        return this.teamPieceGenerator(this.getTeamMap(team), pieces);    
    }

    private getTeamString(team: Team): string {
        return team === Team.White ? 'White' : 'Black';
    }

    private *teamPieceGenerator(pieceMap: Record<Piece, Set<SquareState>>, pieces?: Piece[]) {
        pieces = pieces == null ? Object.keys(pieceMap) as Piece[] : pieces;
        for (const piece of pieces) {
            const pieceArray = Array.from(pieceMap[piece]);
            for (const piece of pieceArray) {
                yield piece;
            }
        }
    }
}
