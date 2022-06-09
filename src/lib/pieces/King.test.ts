import { addPiece } from "../../components/board/ManagePiece";
import { Coordinates } from "../../types/AlgebraicNotation";
import { BoardStateFactory, BoardState } from "../model/BoardState";
import { Team } from "../Team";
import { isLegalKingMove } from "./King";

describe.each([
    { thisTeam: Team.White, otherTeam: Team.Black},
    { thisTeam: Team.Black, otherTeam: Team.White}
])("king tests", ({ thisTeam, otherTeam }) => {
    const boardFactory: BoardStateFactory = new BoardStateFactory();
    let state: BoardState;

    beforeEach(() => {
        state = boardFactory.createBoardState();
    });

    describe("legal basic moves", () => {
        const origin: Coordinates = ['e', 4];
        const kingLegalDestinations: Coordinates[] = [
            ['e', 5], ['f', 5], ['f', 4], ['f', 3], 
            ['e', 3], ['d', 3], ['d', 4], ['d', 5]
        ];

        beforeEach(() => {
            addPiece(state, thisTeam, 'king', origin);
        });
        
        it.each([
            kingLegalDestinations.map((value) => { return {coordinates: value}; })
        ])("can move one square to (%j)", ({ coordinates }) => {
            expect(isLegalKingMove(origin, coordinates)).toBe(true);
        });
    });

    describe("legal captures", () => {
        const origin: Coordinates = ['e', 4];
        const kingLegalDestinations: Coordinates[] = [
            ['e', 5], ['f', 5], ['f', 4], ['f', 3], 
            ['e', 3], ['d', 3], ['d', 4], ['d', 5]
        ];

        beforeEach(() => {
            addPiece(state, thisTeam, 'king', origin);
            kingLegalDestinations.forEach((value: Coordinates) => {
                addPiece(state, otherTeam, 'pawn',  value);
            });
        });
        
        it.each([
            kingLegalDestinations.map((value) => { return {coordinates: value}; })
        ])("can capture enemey pieces at (%j)", ({ coordinates }) => {
            expect(isLegalKingMove(origin, coordinates)).toBe(true);
        });
    });

    describe("illegal moves", () => {
        const origin: Coordinates = ['e', 4];
        const immediateSurroundingSquares: Coordinates[] = [
            ['e', 6], ['f', 6], ['g', 5], ['g', 4], 
            ['g', 3], ['f', 2], ['e', 2], ['d', 2 ],
            ['c', 3], ['c', 4], ['c', 5], ['d', 6 ],
        ];

        beforeEach(() => {
            addPiece(state, thisTeam, 'king', origin);
        });
        
        it.each([
            immediateSurroundingSquares.map((value) => { return {coordinates: value}; })
        ])("can't move beyond range to square at (%j)", ({ coordinates }) => {
            expect(isLegalKingMove(origin, coordinates)).toBe(false);
        });
    });
})