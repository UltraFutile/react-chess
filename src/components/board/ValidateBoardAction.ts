import React from 'react';
import { BoardState } from "../../lib/model/BoardState";
import { SquareState } from "../../lib/model/SquareState";
import { toggleSquareSelect, movePiece, changeTurn } from "./UpdateBoardState";
import { getKingPossibleMoves } from '../../lib/pieces/King';
import { Team } from '../../lib/Team';
import { destinationHasSameTeam } from '../../lib/pieces/PieceHelpers';
import { Piece } from '../../lib/model/PieceProps';
import { simulateMove } from './SimulateMove';
import { getValidationForPiece } from './GetValidationForPiece';

export const onSquareClickFactory = (state: BoardState, setState: React.Dispatch<React.SetStateAction<BoardState>>) => 
    (fileIndex: number, rankIndex: number) => () => {
    const prevSquare = state.currentlySelectedSquare;
    const nextSquare: SquareState = state.squareGrid[fileIndex][rankIndex];
    const sameSquareSelected = nextSquare.selected;

    if (prevSquare == null 
        && (nextSquare.piece == null || !state.teamManager.isTeamsTurn(nextSquare.piece.team))) {
        return;
    }
    
    if (sameSquareSelected || teamPieceSelected(nextSquare, state.teamManager.attackingTeam)) {
        setState(toggleSquareSelect(state, fileIndex, rankIndex));
    }
    else if (validateMove(state, prevSquare, nextSquare)) {

        const newState = movePiece(state, fileIndex, rankIndex)
        
        // Check for checkmate OR stalemate
        
        // Get all team pieces attacking enemy king. (nextsquare piece, and then check  r/b/q)
        const enemyKingSquare: SquareState = state.teamManager.getKing(newState.teamManager.defendingTeam);
        const enemyKingAttackers = getAllPiecesAttackingSquare(newState, enemyKingSquare, newState.teamManager.attackingTeam);

        if (enemyKingAttackers.length > 0) {
            console.log("There are pieces attacking the king")
            console.log(enemyKingAttackers);

            // Are all the squares enemy king can move to being attacked? (aka can the King escape)
            let kingPossibleMoves: SquareState[] = getKingPossibleMoves(newState, [enemyKingSquare.file, enemyKingSquare.rank]);
            console.log(kingPossibleMoves);
            // For each possible enemy king move, 
            // simulate it and validate with all team pieces
            for (let enemyKingMove of kingPossibleMoves) {
                const squareIsVulnerable = canSquareBeAttacked(newState, enemyKingMove, newState.teamManager.attackingTeam, enemyKingSquare);
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

    if (prevSquare.piece.piece === 'king') {
        // check if any enemy piece can attack king's new position. (maybe move this to under isLegalKingMove?)
        const doesMoveResultInCheck = simulateMove(state, prevSquare, nextSquare, 
            isSquareUnderAttack(state, nextSquare, state.teamManager.defendingTeam));
        return !doesMoveResultInCheck
    }
    else {
        // check for possible discovered checks
        // this should involve temporarily performing the move, then check if enemy r/b/q can attack the king
        const kingSquare: SquareState = state.teamManager.getKing(state.teamManager.attackingTeam);
        console.log(kingSquare);
        const doesMoveResultInCheck = simulateMove(state, prevSquare, nextSquare, 
            isSquareUnderAttack(state, kingSquare, state.teamManager.defendingTeam, ['rook', 'bishop', 'queen']));

        return !doesMoveResultInCheck;
    }
}

const canSquareBeAttacked = (
    state: BoardState, 
    target: SquareState, 
    attackingTeam: Team,
    prevSquare: SquareState): boolean => {
    const pieceIterator = state.teamManager.getPieceIterator(attackingTeam);
    for (const square of pieceIterator) {
        if (square.piece == null) {
            continue;
        }
        const validate = getValidationForPiece(square.piece.piece);
        const validMove = simulateMove(state, prevSquare, target, () => validate(state, [square.file, square.rank], [target.file, target.rank]));
        console.log(`Validate move by ${square.piece.piece} from ${square.file}, ${square.rank} to ${target.file}, ${target.rank}, result ${validMove}`);
            if (validMove)
                return true;
    }

    return false;
}


const isSquareUnderAttack = (state: BoardState, targetSquare: SquareState, attackingTeam: Team, attackingPieces?: Piece[]) => (): boolean => {
    const pieceIterator = state.teamManager.getPieceIterator(attackingTeam, attackingPieces);
    for (const square of pieceIterator) {
        if (square.piece == null) {
            continue;
        }
        if (getValidationForPiece(square.piece.piece)(state, [square.file, square.rank], [targetSquare.file, targetSquare.rank])) {
            console.log("Under attack by " + square.piece.piece);
            return true;
        }
    }

    return false;
}

const getAllPiecesAttackingSquare = (state: BoardState, targetSquare: SquareState, attackingTeam: Team): Piece[] => {
    const pieces: Piece[] = [];
    const pieceIterator = state.teamManager.getPieceIterator(attackingTeam);
    for (const square of pieceIterator) {
        if (square.piece == null) {
            continue;
        }
        if (getValidationForPiece(square.piece.piece)(state, [square.file, square.rank], [targetSquare.file, targetSquare.rank])) {
            console.log("Under attack by " + square.piece.piece);
            pieces.push(square.piece.piece);
        }
    }

    return pieces;
}
