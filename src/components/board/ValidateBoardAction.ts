import React from 'react';
import { BoardState } from "../../lib/model/BoardState";
import { SquareState } from "../../lib/model/SquareState";
import { toggleSquareSelect, movePiece, changeTurn } from "./UpdateBoardState";
import { isLegalBishopMove } from "../../lib/pieces/Bishop";
import { isLegalKnightMove } from "../../lib/pieces/Knight";
import { isLegalPawnMove } from "../../lib/pieces/Pawn";
import { isLegalRookMove } from "../../lib/pieces/Rook";
import { getKingPossibleMoves, isLegalKingMove } from '../../lib/pieces/King';
import { Team } from '../../lib/Team';
import { destinationHasSameTeam } from '../../lib/pieces/PieceHelpers';
import { Piece, PieceProps } from '../../lib/model/PieceProps';

export const onSquareClickFactory = (state: BoardState, setState: React.Dispatch<React.SetStateAction<BoardState>>) => 
    (fileIndex: number, rankIndex: number) => () => {
    const prevSquare = state.currentlySelectedSquare;
    const nextSquare: SquareState = state.squareGrid[fileIndex][rankIndex];
    const sameSquareSelected = nextSquare.selected;

    if (prevSquare == null 
        && (nextSquare.piece == null || nextSquare.piece.team !== state.whichTeamsTurn)) {
        return;
    }
    
    if (sameSquareSelected || teamPieceSelected(nextSquare, state.whichTeamsTurn)) {
        setState(toggleSquareSelect(state, fileIndex, rankIndex));
    }
    else if (validateMove(state, prevSquare, nextSquare)) {

        const newState = movePiece(state, fileIndex, rankIndex)
        
        // Check for checkmate OR stalemate
        
        // Get all team pieces attacking enemy king. (nextsquare piece, and then check  r/b/q)
        const teamPieceMap = newState.whichTeamsTurn === Team.White ? newState.whitePieceMap : newState.blackPieceMap;
        const enemyPieceMap = newState.whichTeamsTurn === Team.White ? newState.blackPieceMap : newState.whitePieceMap;
        const enemyKingSquare: SquareState = enemyPieceMap['king'].values().next().value;
        const enemyKingAttackers = getAllPiecesAttackingSquare(newState, enemyKingSquare, teamPieceMap);

        
        if (enemyKingAttackers.length > 0) {
            console.log("There are pieces attacking the king")
            console.log(enemyKingAttackers);

            // Are all the squares enemy king can move to being attacked? (aka can the King escape)
            let kingPossibleMoves: SquareState[] = getKingPossibleMoves(newState, [enemyKingSquare.file, enemyKingSquare.rank]);
            console.log(kingPossibleMoves);
            // For each possible enemy king move, 
            // simulate it and validate with all team pieces
            for (let enemyKingMove of kingPossibleMoves) {
                const squareIsVulnerable = squareCanBeAttacked(newState, enemyKingMove, teamPieceMap, enemyKingSquare);
                if (!squareIsVulnerable) {
                    console.log(`Not checkmate, king can move to ${enemyKingMove.file}, ${enemyKingMove.rank}`)
                }
            }

            // Is there more than one piece attacking the king? -> true
            // - Can the piece attacking the king be captured?
            // - Can the piece attacking the king be blocked?

        }
        else {
            // no pieces attacking king? => check for stalemate
        }


        changeTurn(newState);
        setState(newState);
        console.log(newState)
    }
};

const squareCanBeAttacked = (
    state: BoardState, 
    target: SquareState, 
    pieceMap: Record<Piece, Set<SquareState>>,
    prevSquare: SquareState) => {
    let piece: Piece;
    for (piece in pieceMap) {
        const validate = getValidationForPiece(piece);
        const pieces = Array.from(pieceMap[piece]);

        for (let square of pieces) {
            const validMove = simulateMove(state, prevSquare, target, () => validate(state, [square.file, square.rank], [target.file, target.rank]));
            console.log(`Validate move by ${piece} from ${square.file}, ${square.rank} to ${target.file}, ${target.rank}, result ${validMove}`);
            if (validMove)
                return true;
        }
    }

    return false;
}


const teamPieceSelected = (nextSquare: SquareState, currentTeam: Team) => {
    return nextSquare.piece?.team === currentTeam;
}

const validateMove = (state: BoardState, prevSquare: SquareState | undefined, nextSquare: SquareState): boolean => {
    if (prevSquare == null || prevSquare.piece == null) {
        throw new Error("Attempted to move piece without selecting one");
    }

    if (destinationHasSameTeam(prevSquare.piece.team, nextSquare))
        return false;

    // validate move attempt
    let isValidMove: boolean = getValidationForPiece(prevSquare.piece.piece)(state, [prevSquare.file, prevSquare.rank], [nextSquare.file, nextSquare.rank]);

    if (!isValidMove) {
        return false;
    }

    const teamPieceMap = state.whichTeamsTurn === Team.White ? state.whitePieceMap : state.blackPieceMap;
    const enemyPieceMap = state.whichTeamsTurn === Team.White ? state.blackPieceMap : state.whitePieceMap;

    if (prevSquare.piece.piece === 'king') {
        // check if any enemy piece can attack king's new position. (maybe move this to under isLegalKingMove?)
        const doesMoveResultInCheck = simulateMove(state, prevSquare, nextSquare, () => {
            let piece: keyof typeof enemyPieceMap;
            for (piece in enemyPieceMap) {
                for (let square of enemyPieceMap[piece]) {
                    if (getValidationForPiece(piece)(state, [square.file, square.rank], [nextSquare.file, nextSquare.rank])) {
                        console.log("Under attack by " + piece);
                        return true;
                    }
                }
            }
            return false;
        })

        return !doesMoveResultInCheck
    }
    else {
        // check for possible discovered checks
        //      this should involve temporarily performing the move, then check if enemy r/b/q can attack the king
        const kingSquare: SquareState = teamPieceMap['king'].values().next().value;
        console.log(kingSquare);
        const doesMoveResultInCheck = simulateMove(state, prevSquare, nextSquare, () => {
            let piecesThatCanDiscoverCheck: Piece[] = ['rook', 'bishop', 'queen'];
            for (let piece of piecesThatCanDiscoverCheck) {
                for (let square of enemyPieceMap[piece]) {
                    if (getValidationForPiece(piece)(state, [square.file, square.rank], [kingSquare.file, kingSquare.rank])) {
                        console.log("Under attack by " + piece);
                        return true;
                    }
                }
            }
            return false;
        });

        return !doesMoveResultInCheck;
    }
}


// perform move
// perform check => fcn()
// revert move
const simulateMove = (
    state: BoardState, 
    prevSquare: SquareState, 
    nextSquare: SquareState, 
    validationFunction: () => boolean): boolean => {
    if (prevSquare.piece == null) {
        throw new Error("Attempted to simulate move without a moving piece.")
    }
    // Get team of moving piece
    const currentTeam = prevSquare.piece.team;

    const teamPieceMap = currentTeam === Team.White ? state.whitePieceMap : state.blackPieceMap;
    const enemyPieceMap = currentTeam === Team.White ? state.blackPieceMap : state.whitePieceMap;

    let capturedPiece: PieceProps | undefined;

    if (nextSquare.piece) {
        capturedPiece = nextSquare.piece;
        enemyPieceMap[nextSquare.piece.piece].delete(nextSquare);
    }

    teamPieceMap[prevSquare.piece.piece].delete(prevSquare);
    teamPieceMap[prevSquare.piece.piece].add(nextSquare);

    // capture
    nextSquare.piece = prevSquare.piece; 
    prevSquare.piece = undefined;

    const result: boolean = validationFunction();

    // revert move
    prevSquare.piece = nextSquare.piece;

    teamPieceMap[prevSquare.piece.piece].delete(nextSquare);
    teamPieceMap[prevSquare.piece.piece].add(prevSquare);

    if (capturedPiece) {
        nextSquare.piece = capturedPiece;
        enemyPieceMap[nextSquare.piece.piece].add(nextSquare);
    }
    else {
        nextSquare.piece = undefined;

    }

    if (teamPieceMap['king'].size > 1 || enemyPieceMap['king'].size > 1) {
        console.log("More than one king")
    }

    return result;
}


const getAllPiecesAttackingSquare = (state: BoardState, targetSquare: SquareState, pieceMap: Record<Piece, Set<SquareState>>): Piece[] => {
    const pieces: Piece[] = [];
    let piece: Piece;
    for (piece in pieceMap) {
        for (let square of pieceMap[piece]) {
            if (getValidationForPiece(piece)(state, [square.file, square.rank], [targetSquare.file, targetSquare.rank])) {
                console.log("Under attack by " + piece);
                pieces.push(piece) // what for?
            }
        }
    }
    return pieces;
}


const getValidationForPiece = (piece: Piece) => {
    switch(piece) {
        case 'pawn':
            return isLegalPawnMove;
        case 'knight':
            return isLegalKnightMove;
        case 'rook':
            return isLegalRookMove;
        case 'bishop':
            return isLegalBishopMove;
        case 'king':
            return isLegalKingMove;
        case 'queen':
            return (state: BoardState, orig: [number, number], dest: [number, number]) => {
                return isLegalBishopMove(state, orig, dest)
                || isLegalRookMove(state, orig, dest);
            };
    }
}