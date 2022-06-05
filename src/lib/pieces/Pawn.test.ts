import { addPiece } from '../../components/board/ManagePiece';
import { BoardRank, Coordinates } from '../../types/AlgebraicNotation';
import { BoardState, BoardStateFactory, getDestination } from '../model/BoardState';
import { Team } from '../Team';
import { isLegalPawnMove } from './Pawn';

describe.each([
    { thisTeam: Team.White, otherTeam: Team.Black},
    { thisTeam: Team.Black, otherTeam: Team.White}
])("pawn tests", ({thisTeam, otherTeam}) => {    
    const boardFactory: BoardStateFactory = new BoardStateFactory();
    let state: BoardState;
    const rankDirection: number = thisTeam === Team.White ? 1 : -1;
    const startingRank: BoardRank = thisTeam === Team.White ? 2 : 7;

    beforeEach(() => {
        state = boardFactory.createBoardState();
    });

    describe("movement from starting position", () => {
        const origin: Coordinates = ['e', startingRank];
    
        beforeEach(() => {
            addPiece(state, thisTeam, 'pawn', origin);
        });
    
        it("can move one square forward", () => {
            expect(isLegalPawnMove(state, origin, getDestination(state, origin, { rank: 1 * rankDirection }))).toBe(true);
        });
    
        it("can move two squares forward at start rank", () => {
            expect(isLegalPawnMove(state, origin, getDestination(state, origin, { rank: 2 * rankDirection }))).toBe(true);
        });
    });

    describe('movement after starting postiion', () => {
        const origin: Coordinates = ['e', startingRank + (1 * rankDirection) as BoardRank];
    
        beforeEach(() => {
            addPiece(state, thisTeam, 'pawn', origin);
        });
    
        it("can move one square forward", () => {
            expect(isLegalPawnMove(state, origin, getDestination(state, origin, { rank: 1 * rankDirection}))).toBe(true);
        });
    
        it("can't move two square forward", () => {
            expect(isLegalPawnMove(state, origin, getDestination(state, origin, { rank: 2 * rankDirection}))).toBe(false);
        });
    });
    
    describe('illegal movement range', () => {
        const origin: Coordinates = ['e', startingRank + (1 * rankDirection) as BoardRank];
    
        beforeEach(() => {
            addPiece(state, thisTeam, 'pawn', origin);
        });
    
        it("can't move a square backwards", () => {
            expect(isLegalPawnMove(state, origin, getDestination(state, origin, { rank: -1 * rankDirection}))).toBe(false);
        });
    
        it("can't move three squares forward", () => {
            expect(isLegalPawnMove(state, origin, getDestination(state, origin, { rank: 3 * rankDirection}))).toBe(false);
        });
    
        it("can't move to a square on the same rank", () => {
            expect(isLegalPawnMove(state, origin, getDestination(state, origin, { file: 1 }))).toBe(false);
            expect(isLegalPawnMove(state, origin, getDestination(state, origin, { file: -1 }))).toBe(false);
        });
    });

    describe('illegal captures', () => {
        const origin: Coordinates = ['e', startingRank + (1 * rankDirection) as BoardRank];
    
        beforeEach(() => {
            addPiece(state, thisTeam, 'pawn', origin);
            addPiece(state, thisTeam, 'pawn', getDestination(state, origin, { file: 1, rank: 1 * rankDirection }));
            addPiece(state, thisTeam, 'pawn', getDestination(state, origin, { file: -1, rank: 1 * rankDirection }));
        });
    
        it("can't capture piece on same team", () => {
            expect(isLegalPawnMove(state, origin, getDestination(state, origin, { file: 1, rank: 1 * rankDirection }))).toBe(false);
            expect(isLegalPawnMove(state, origin, getDestination(state, origin, { file: -1, rank: 1 * rankDirection }))).toBe(false);
        });
    });
    
    describe('legal captures', () => {
        const origin: Coordinates = ['e', startingRank + (1 * rankDirection) as BoardRank];
    
        beforeEach(() => {
            addPiece(state, thisTeam, 'pawn', origin);
            addPiece(state, otherTeam, 'pawn', getDestination(state, origin, { file: 1, rank: 1 * rankDirection }));
            addPiece(state, otherTeam, 'pawn', getDestination(state, origin, { file: -1, rank: 1 * rankDirection }));
        });
    
        it("can capture piece on enemy team", () => {
            expect(isLegalPawnMove(state, origin, getDestination(state, origin, { file: 1, rank: 1 * rankDirection }))).toBe(true);
            expect(isLegalPawnMove(state, origin, getDestination(state, origin, { file: -1, rank: 1 * rankDirection }))).toBe(true);
        });
    });

    describe('movement with obstacles at starting position', () => {
        const origin: Coordinates = ['e', startingRank];

        describe("with only immediate obstacle", () => {
            beforeEach(() => {
                addPiece(state, thisTeam, 'pawn', origin);
                addPiece(state, otherTeam, 'pawn', getDestination(state, origin, { rank: 1 * rankDirection }));
            });
        
            it("can't move one square forward", () => {
                expect(isLegalPawnMove(state, origin, getDestination(state, origin, { rank: 1 * rankDirection }))).toBe(false);
            });
        
            it("can't move two squares forward", () => {
                expect(isLegalPawnMove(state, origin, getDestination(state, origin, { rank: 2 * rankDirection }))).toBe(false);
            });
        });

        describe("with obstacle two squares ahead", () => {
            beforeEach(() => {
                addPiece(state, thisTeam, 'pawn', origin);
                addPiece(state, otherTeam, 'pawn', getDestination(state, origin, { rank: 2 * rankDirection }));
            });
        
            it("can move one square forward", () => {
                expect(isLegalPawnMove(state, origin, getDestination(state, origin, { rank: 1 * rankDirection }))).toBe(true);
            });
        
            it("can't move two squares forward", () => {
                expect(isLegalPawnMove(state, origin, getDestination(state, origin, { rank: 2 * rankDirection }))).toBe(false);
            });
        });
        
    })
})
