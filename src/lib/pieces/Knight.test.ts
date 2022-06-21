import { addPiece } from "../../components/board/ManagePiece";
import { Coordinates } from "../../types/AlgebraicNotation";
import { BoardStateFactory, BoardState, getIndexesFromCoordinates } from "../model/BoardState";
import { Team } from "../Team";
import { isLegalKnightMove } from "./Knight";

describe.each([
    { thisTeam: Team.White, otherTeam: Team.Black},
    { thisTeam: Team.Black, otherTeam: Team.White}
])("knight tests", ({ thisTeam, otherTeam }) => {
    const boardFactory: BoardStateFactory = new BoardStateFactory();
    let state: BoardState;

    beforeEach(() => {
        state = boardFactory.createBoardState();
    });

    describe("legal basic moves", () => {
        const origin = getIndexesFromCoordinates(['e', 4]);
        const knightLegalDestinations: Coordinates[] = [
            ['f', 6], ['g', 5], ['g', 3], ['f', 2], 
            ['d', 2], ['c', 3], ['c', 5], ['d', 6]
        ];

        beforeEach(() => {
            addPiece(state, thisTeam, 'knight', origin);
        });
        
        it.each([
            knightLegalDestinations.map((value) => { return {coordinates: value}; })
        ])("can move two squares and one diagonal to (%j)", ({ coordinates }) => {
            expect(isLegalKnightMove(state, origin, getIndexesFromCoordinates(coordinates))).toBe(true);
        });
    });

    describe("legal captures", () => {
        const origin = getIndexesFromCoordinates(['e', 4]);
        const knightLegalDestinations: Coordinates[] = [
            ['f', 6], ['g', 5], ['g', 3], ['f', 2], 
            ['d', 2], ['c', 3], ['c', 5], ['d', 6]
        ];

        beforeEach(() => {
            addPiece(state, thisTeam, 'knight', origin);
            knightLegalDestinations.forEach((value: Coordinates) => {
                addPiece(state, otherTeam, 'pawn', getIndexesFromCoordinates(value));
            });
        });
        
        it.each([
            knightLegalDestinations.map((value) => { return {coordinates: value}; })
        ])("can capture enemey pieces at (%j)", ({ coordinates }) => {
            expect(isLegalKnightMove(state, origin, getIndexesFromCoordinates(coordinates))).toBe(true);
        });
    });

    describe("illegal short moves", () => {
        const origin = getIndexesFromCoordinates(['e', 4]);
        const immediateSurroundingSquares: Coordinates[] = [
            ['e', 5], ['f', 5], ['f', 4], ['f', 3], 
            ['e', 3], ['d', 3], ['d', 4], ['d', 5 ]
        ];

        beforeEach(() => {
            addPiece(state, thisTeam, 'knight', origin);
        });
        
        it.each([
            immediateSurroundingSquares.map((value) => { return {coordinates: value}; })
        ])("can't move to immediate square at (%j)", ({ coordinates }) => {
            expect(isLegalKnightMove(state, origin, getIndexesFromCoordinates(coordinates))).toBe(false);
        });
    });

    describe("illegal straight 2 square moves", () => {
        const origin = getIndexesFromCoordinates(['e', 4]);
        const immediateSurroundingSquares: Coordinates[] = [
            ['e', 6], ['g', 4], ['e', 2], ['c', 4],
        ];

        beforeEach(() => {
            addPiece(state, thisTeam, 'knight', origin);
        });
        
        it.each([
            immediateSurroundingSquares.map((value) => { return {coordinates: value}; })
        ])("can't move only two squares to (%j)", ({ coordinates }) => {
            expect(isLegalKnightMove(state, origin, getIndexesFromCoordinates(coordinates))).toBe(false);
        });
    });

    describe("illegal destinations immediately out of range", () => {
        const origin = getIndexesFromCoordinates(['e', 4]);
        const immediateSurroundingSquares: Coordinates[] = [
            ['e', 7], ['g', 6], ['h', 4], ['g', 2], 
            ['e', 1], ['c', 2], ['b', 4], ['c', 6],
        ];

        beforeEach(() => {
            addPiece(state, thisTeam, 'knight', origin);
        });
        
        it.each([
            immediateSurroundingSquares.map((value) => { return {coordinates: value}; })
        ])("can't move out of range to (%j)", ({ coordinates }) => {
            expect(isLegalKnightMove(state, origin, getIndexesFromCoordinates(coordinates))).toBe(false);
        });
    });
})