import { addPiece } from "../../components/board/ManagePiece";
import { Coordinates } from "../../types/AlgebraicNotation";
import { BoardStateFactory, BoardState, getIndexesFromCoordinates, getSquare } from "../model/BoardState";
import { Team } from "../Team";
import { getKingPossibleMoves, isLegalKingMove } from "./King";

describe.each([
    { thisTeam: Team.White, otherTeam: Team.Black},
    { thisTeam: Team.Black, otherTeam: Team.White}
])("isLegalKingMove tests", ({ thisTeam, otherTeam }) => {
    const boardFactory: BoardStateFactory = new BoardStateFactory();
    let state: BoardState;

    beforeEach(() => {
        state = boardFactory.createBoardState();
    });

    describe("legal basic moves", () => {
        const origin = getIndexesFromCoordinates(['e', 4]);
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
            expect(isLegalKingMove(state, origin, getIndexesFromCoordinates(coordinates))).toBe(true);
        });
    });

    describe("legal captures", () => {
        const origin = getIndexesFromCoordinates(['e', 4]);
        const kingLegalDestinations: Coordinates[] = [
            ['e', 5], ['f', 5], ['f', 4], ['f', 3], 
            ['e', 3], ['d', 3], ['d', 4], ['d', 5]
        ];

        beforeEach(() => {
            addPiece(state, thisTeam, 'king', origin);
            kingLegalDestinations.forEach((value: Coordinates) => {
                addPiece(state, otherTeam, 'pawn',  getIndexesFromCoordinates(value));
            });
        });
        
        it.each([
            kingLegalDestinations.map((value) => { return {coordinates: value}; })
        ])("can capture enemey pieces at (%j)", ({ coordinates }) => {
            expect(isLegalKingMove(state, origin, getIndexesFromCoordinates(coordinates))).toBe(true);
        });
    });

    describe("illegal moves", () => {
        const origin = getIndexesFromCoordinates(['e', 4]);
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
            expect(isLegalKingMove(state, origin, getIndexesFromCoordinates(coordinates))).toBe(false);
        });
    });
});

describe.each([
    { thisTeam: Team.White, otherTeam: Team.Black},
    { thisTeam: Team.Black, otherTeam: Team.White}
])("getKingLegalMoves tests", ({ thisTeam, otherTeam }) => {
    const boardFactory: BoardStateFactory = new BoardStateFactory();
    let state: BoardState;

    beforeEach(() => {
        state = boardFactory.createBoardState();
    });

    describe("on middle of board", () => {
        const origin = getIndexesFromCoordinates(['e', 4]);

        beforeEach(() => {
            addPiece(state, thisTeam, 'king', origin);
        });
        
        it("returns correct squares when immediate squares are empty", () => {
            const coords: Coordinates[] = [
                ['e', 5], ['f', 5], ['f', 4], ['f', 3], 
                ['e', 3], ['d', 3], ['d', 4], ['d', 5]
            ]
            
            const expectedMoveSet = new Set(
                coords.map(x => getSquare(state, getIndexesFromCoordinates(x))));

            const kingPossibleMoves = getKingPossibleMoves(state, origin);
            
            expect(kingPossibleMoves.length).toBe(8);
            kingPossibleMoves.forEach(move => {
                expect(expectedMoveSet.has(move)).toBe(true);
            })
        });

        it("returns squares excluding squares with ally pieces", () => {
            addPiece(state, thisTeam, 'pawn', getIndexesFromCoordinates(['e', 5]));
            addPiece(state, thisTeam, 'pawn', getIndexesFromCoordinates(['d', 4]));

            const coords: Coordinates[] = [
                ['f', 5], ['f', 4], ['f', 3], 
                ['e', 3], ['d', 3], ['d', 5]
            ]
            
            const expectedMoveSet = new Set(
                coords.map(x => getSquare(state, getIndexesFromCoordinates(x))));

            const kingPossibleMoves = getKingPossibleMoves(state, origin);
            
            expect(kingPossibleMoves.length).toBe(6);
            kingPossibleMoves.forEach(move => {
                expect(expectedMoveSet.has(move)).toBe(true);
            })
        });

        it("returns squares with enemy pieces", () => {
            addPiece(state, otherTeam, 'pawn', getIndexesFromCoordinates(['e', 5]));
            addPiece(state, otherTeam, 'pawn', getIndexesFromCoordinates(['d', 4]));

            const coords: Coordinates[] = [
                ['e', 5], ['f', 5], ['f', 4], ['f', 3], 
                ['e', 3], ['d', 3], ['d', 4], ['d', 5]
            ]
            
            const expectedMoveSet = new Set(
                coords.map(x => getSquare(state, getIndexesFromCoordinates(x))));

            const kingPossibleMoves = getKingPossibleMoves(state, origin);
            
            expect(kingPossibleMoves.length).toBe(8);
            kingPossibleMoves.forEach(move => {
                expect(expectedMoveSet.has(move)).toBe(true);
            })
        });
    });

    describe("on middle of edge on board", () => {
        it("returns correct squares when on right edge", () => {
            const origin = getIndexesFromCoordinates(['h', 4]);
            addPiece(state, thisTeam, 'king', origin);

            const coords: Coordinates[] = [
                ['h', 5], ['h', 3], ['g', 3], ['g', 4], ['g', 5]
            ]
            
            const expectedMoveSet = new Set(
                coords.map(x => getSquare(state, getIndexesFromCoordinates(x))));

            const kingPossibleMoves = getKingPossibleMoves(state, origin);
            
            expect(kingPossibleMoves.length).toBe(5);
            kingPossibleMoves.forEach(move => {
                expect(expectedMoveSet.has(move)).toBe(true);
            })
        });

        it("returns correct squares when on left edge", () => {
            const origin = getIndexesFromCoordinates(['a', 4]);
            addPiece(state, thisTeam, 'king', origin);
            
            const coords: Coordinates[] = [
                ['a', 5], ['b', 5], ['b', 4], ['b', 3], ['a', 3]
            ]
            
            const expectedMoveSet = new Set(
                coords.map(x => getSquare(state, getIndexesFromCoordinates(x))));

            const kingPossibleMoves = getKingPossibleMoves(state, origin);
            
            expect(kingPossibleMoves.length).toBe(5);
            kingPossibleMoves.forEach(move => {
                expect(expectedMoveSet.has(move)).toBe(true);
            })
        });

        it("returns correct squares when on top edge", () => {
            const origin = getIndexesFromCoordinates(['e', 8]);
            addPiece(state, thisTeam, 'king', origin);
            
            const coords: Coordinates[] = [
                ['f', 8], ['f', 7], ['e', 7], ['d', 7], ['d', 8]
            ]
            
            const expectedMoveSet = new Set(
                coords.map(x => getSquare(state, getIndexesFromCoordinates(x))));

            const kingPossibleMoves = getKingPossibleMoves(state, origin);
            
            expect(kingPossibleMoves.length).toBe(5);
            kingPossibleMoves.forEach(move => {
                expect(expectedMoveSet.has(move)).toBe(true);
            })
        });

        it("returns correct squares when on bottom edge", () => {
            const origin = getIndexesFromCoordinates(['e', 1]);
            addPiece(state, thisTeam, 'king', origin);

            const coords: Coordinates[] = [
                ['e', 2], ['f', 2], ['f', 1], ['d', 1], ['d', 2]
            ]
            
            const expectedMoveSet = new Set(
                coords.map(x => getSquare(state, getIndexesFromCoordinates(x))));

            const kingPossibleMoves = getKingPossibleMoves(state, origin);
            
            expect(kingPossibleMoves.length).toBe(5);
            kingPossibleMoves.forEach(move => {
                expect(expectedMoveSet.has(move)).toBe(true);
            })
        });
    });

    describe("on corners of board", () => {
        it("returns correct squares when on upper right corner", () => {
            const origin = getIndexesFromCoordinates(['h', 8]);
            addPiece(state, thisTeam, 'king', origin);

            const coords: Coordinates[] = [
                ['h', 7], ['g', 7], ['g', 8],
            ]
            
            const expectedMoveSet = new Set(
                coords.map(x => getSquare(state, getIndexesFromCoordinates(x))));

            const kingPossibleMoves = getKingPossibleMoves(state, origin);
            
            expect(kingPossibleMoves.length).toBe(3);
            kingPossibleMoves.forEach(move => {
                expect(expectedMoveSet.has(move)).toBe(true);
            })
        });

        it("returns correct squares when on lower right corner", () => {
            const origin = getIndexesFromCoordinates(['h', 1]);
            addPiece(state, thisTeam, 'king', origin);
            
            const coords: Coordinates[] = [
                ['h', 2], ['g', 1], ['g', 2], 
            ]
            
            const expectedMoveSet = new Set(
                coords.map(x => getSquare(state, getIndexesFromCoordinates(x))));

            const kingPossibleMoves = getKingPossibleMoves(state, origin);
            
            expect(kingPossibleMoves.length).toBe(3);
            kingPossibleMoves.forEach(move => {
                expect(expectedMoveSet.has(move)).toBe(true);
            })
        });

        it("returns correct squares when on lower left corner", () => {
            const origin = getIndexesFromCoordinates(['a', 1]);
            addPiece(state, thisTeam, 'king', origin);
            
            const coords: Coordinates[] = [
                ['a', 2], ['b', 2], ['b', 1], 
            ]
            
            const expectedMoveSet = new Set(
                coords.map(x => getSquare(state, getIndexesFromCoordinates(x))));

            const kingPossibleMoves = getKingPossibleMoves(state, origin);
            
            expect(kingPossibleMoves.length).toBe(3);
            kingPossibleMoves.forEach(move => {
                expect(expectedMoveSet.has(move)).toBe(true);
            })
        });

        it("returns correct squares when on upper left corner", () => {
            const origin = getIndexesFromCoordinates(['a', 8]);
            addPiece(state, thisTeam, 'king', origin);

            const coords: Coordinates[] = [
                ['b', 8], ['b', 7], ['a', 7], 
            ]
            
            const expectedMoveSet = new Set(
                coords.map(x => getSquare(state, getIndexesFromCoordinates(x))));

            const kingPossibleMoves = getKingPossibleMoves(state, origin);
            
            expect(kingPossibleMoves.length).toBe(3);
            kingPossibleMoves.forEach(move => {
                expect(expectedMoveSet.has(move)).toBe(true);
            })
        });
    });
})