import { addPiece } from '../../components/board/ManagePiece';
import { Coordinates } from '../../types/AlgebraicNotation';
import { BoardState, BoardStateFactory } from '../model/BoardState';
import { Team } from '../Team';
import { isLegalPawnMove } from './Pawn';

const boardFactory: BoardStateFactory = new BoardStateFactory();
let state: BoardState;

beforeEach(() => {
    state = boardFactory.createBoardState();
})

describe("white pawn movement from starting position", () => {
    const position: Coordinates = ['e', 2];

    beforeEach(() => {
        addPiece(state, Team.White, 'pawn', position);
    });

    it("can move one square forward", () => {
        expect(isLegalPawnMove(state, position, ['e', 3])).toBe(true);
    });

    it("can move two squares forward at start rank", () => {
        expect(isLegalPawnMove(state, position, ['e', 4])).toBe(true);
    });
});

describe('white pawn movement after starting postiion', () => {
    const position: Coordinates = ['e', 3];

    beforeEach(() => {
        addPiece(state, Team.White, 'pawn', position);
    });

    it("can move one square forward", () => {
        expect(isLegalPawnMove(state, position, ['e', 4])).toBe(true);
    });

    it("can't move two square forward", () => {
        expect(isLegalPawnMove(state, position, ['e', 5])).toBe(false);
    });
});

describe('white pawn illegal moves', () => {
    const position: Coordinates = ['e', 3];

    beforeEach(() => {
        addPiece(state, Team.White, 'pawn', position);
    });

    it("can't move a square backwards", () => {
        expect(isLegalPawnMove(state, position, ['e', 2])).toBe(false);
    });

    it("can't move three squares forward", () => {
        expect(isLegalPawnMove(state, position, ['e', 6])).toBe(false);
    });

    it("can't move to a square on the same rank", () => {
        expect(isLegalPawnMove(state, position, ['f', 3])).toBe(false);
    });
});