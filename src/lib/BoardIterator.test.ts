import { diagonalMovementGenerator, straightMovementGenerator } from "./BoardIterators";
import { BoardStateFactory, BoardState, getIndexesFromCoordinates, getDestination } from "./model/BoardState";

describe("test board iterators", () => {
    const boardFactory: BoardStateFactory = new BoardStateFactory();
    let state: BoardState;
    const origin = getIndexesFromCoordinates(['e', 4])

    beforeEach(() => {
        state = boardFactory.createBoardState();
    });

    describe("diagonal iterator tests", () => {
        it("can iterate squares in north east direction inclusively", () => {
            let gen = diagonalMovementGenerator(state, origin, getDestination(state, origin, { file: 3, rank: 3 }), true)
            let squares = [...gen];
            expect(squares.length).toBe(4);
            expect([squares[0].file, squares[0].rank]).toEqual([4, 3]);
            expect([squares[1].file, squares[1].rank]).toEqual([5, 4]);
            expect([squares[2].file, squares[2].rank]).toEqual([6, 5]);
            expect([squares[3].file, squares[3].rank]).toEqual([7, 6]);
        });

        it("can iterate squares in north east direction", () => {
            let gen = diagonalMovementGenerator(state, origin, getDestination(state, origin, { file: 3, rank: 3 }))
            let squares = [...gen];
            expect(squares.length).toBe(2);
            expect([squares[0].file, squares[0].rank]).toEqual([5, 4]);
            expect([squares[1].file, squares[1].rank]).toEqual([6, 5]);
        });

        it("can iterate squares in south east direction inclusively", () => {
            let gen = diagonalMovementGenerator(state, origin, getDestination(state, origin, { file: 3, rank: -3 }), true)
            let squares = [...gen];
            expect(squares.length).toBe(4);
            expect([squares[0].file, squares[0].rank]).toEqual([4, 3]);
            expect([squares[1].file, squares[1].rank]).toEqual([5, 2]);
            expect([squares[2].file, squares[2].rank]).toEqual([6, 1]);
            expect([squares[3].file, squares[3].rank]).toEqual([7, 0]);
        });

        it("can iterate squares in south east direction", () => {
            let gen = diagonalMovementGenerator(state, origin, getDestination(state, origin, { file: 3, rank: -3 }))
            let squares = [...gen];
            expect(squares.length).toBe(2);
            expect([squares[0].file, squares[0].rank]).toEqual([5, 2]);
            expect([squares[1].file, squares[1].rank]).toEqual([6, 1]);
        });

        it("can iterate squares in south west direction inclusively", () => {
            let gen = diagonalMovementGenerator(state, origin, getDestination(state, origin, { file: -3, rank: -3 }), true)
            let squares = [...gen];
            expect(squares.length).toBe(4);
            expect([squares[0].file, squares[0].rank]).toEqual([4, 3]);
            expect([squares[1].file, squares[1].rank]).toEqual([3, 2]);
            expect([squares[2].file, squares[2].rank]).toEqual([2, 1]);
            expect([squares[3].file, squares[3].rank]).toEqual([1, 0]);
        });

        it("can iterate squares in south west direction", () => {
            let gen = diagonalMovementGenerator(state, origin, getDestination(state, origin, { file: -3, rank: -3 }))
            let squares = [...gen];
            expect(squares.length).toBe(2);
            expect([squares[0].file, squares[0].rank]).toEqual([3, 2]);
            expect([squares[1].file, squares[1].rank]).toEqual([2, 1]);
        });

        it("can iterate squares in north west direction inclusively", () => {
            let gen = diagonalMovementGenerator(state, origin, getDestination(state, origin, { file: -3, rank: 3 }), true)
            let squares = [...gen];
            expect(squares.length).toBe(4);
            expect([squares[0].file, squares[0].rank]).toEqual([4, 3]);
            expect([squares[1].file, squares[1].rank]).toEqual([3, 4]);
            expect([squares[2].file, squares[2].rank]).toEqual([2, 5]);
            expect([squares[3].file, squares[3].rank]).toEqual([1, 6]);
        });

        it("can iterate squares in north west direction", () => {
            let gen = diagonalMovementGenerator(state, origin, getDestination(state, origin, { file: -3, rank: 3 }))
            let squares = [...gen];
            expect(squares.length).toBe(2);
            expect([squares[0].file, squares[0].rank]).toEqual([3, 4]);
            expect([squares[1].file, squares[1].rank]).toEqual([2, 5]);
        });
    });

    describe("straight iterator tests", () => {
        it("can iterate squares in north direction inclusively", () => {
            let gen = straightMovementGenerator(state, origin, getDestination(state, origin, { rank: 2 }), true)
            let squares = [...gen];
            expect(squares.length).toBe(3);
            expect([squares[0].file, squares[0].rank]).toEqual([4, 3]);
            expect([squares[1].file, squares[1].rank]).toEqual([4, 4]);
            expect([squares[2].file, squares[2].rank]).toEqual([4, 5]);
        });

        it("can iterate squares in north direction", () => {
            let gen = straightMovementGenerator(state, origin, getDestination(state, origin, { rank: 2 }))
            let squares = [...gen];
            expect(squares.length).toBe(1);
            expect([squares[0].file, squares[0].rank]).toEqual([4, 4]);
        });

        it("can iterate squares in south direction inclusively", () => {
            let gen = straightMovementGenerator(state, origin, getDestination(state, origin, { rank: -2 }), true)
            let squares = [...gen];
            expect(squares.length).toBe(3);
            expect([squares[0].file, squares[0].rank]).toEqual([4, 3]);
            expect([squares[1].file, squares[1].rank]).toEqual([4, 2]);
            expect([squares[2].file, squares[2].rank]).toEqual([4, 1]);
        });

        it("can iterate squares in south direction", () => {
            let gen = straightMovementGenerator(state, origin, getDestination(state, origin, { rank: -2 }))
            let squares = [...gen];
            expect(squares.length).toBe(1);
            expect([squares[0].file, squares[0].rank]).toEqual([4, 2]);
        });

        it("can iterate squares in west direction inclusively", () => {
            let gen = straightMovementGenerator(state, origin, getDestination(state, origin, { file: -2 }), true)
            let squares = [...gen];
            expect(squares.length).toBe(3);
            expect([squares[0].file, squares[0].rank]).toEqual([4, 3]);
            expect([squares[1].file, squares[1].rank]).toEqual([3, 3]);
            expect([squares[2].file, squares[2].rank]).toEqual([2, 3]);
        });

        it("can iterate squares in west direction", () => {
            let gen = straightMovementGenerator(state, origin, getDestination(state, origin, { file: -2 }))
            let squares = [...gen];
            expect(squares.length).toBe(1);
            expect([squares[0].file, squares[0].rank]).toEqual([3, 3]);
        });

        it("can iterate squares in east direction inclusively", () => {
            let gen = straightMovementGenerator(state, origin, getDestination(state, origin, { file: 2 }), true)
            let squares = [...gen];
            expect(squares.length).toBe(3);
            expect([squares[0].file, squares[0].rank]).toEqual([4, 3]);
            expect([squares[1].file, squares[1].rank]).toEqual([5, 3]);
            expect([squares[2].file, squares[2].rank]).toEqual([6, 3]);
        });

        it("can iterate squares in east direction", () => {
            let gen = straightMovementGenerator(state, origin, getDestination(state, origin, { file: 2 }))
            let squares = [...gen];
            expect(squares.length).toBe(1);
            expect([squares[0].file, squares[0].rank]).toEqual([5, 3]);
        });
    });

});