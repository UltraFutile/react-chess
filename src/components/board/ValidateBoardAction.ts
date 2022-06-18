import React from 'react';
import { BoardState, getCoordinates } from "../../lib/model/BoardState";
import { SquareState } from "../../lib/model/SquareState";
import { toggleSquareSelect, movePiece } from "./UpdateBoardState";
import { isLegalBishopMove } from "../../lib/pieces/Bishop";
import { isLegalKnightMove } from "../../lib/pieces/Knight";
import { isLegalPawnMove } from "../../lib/pieces/Pawn";
import { isLegalRookMove } from "../../lib/pieces/Rook";
import { isLegalKingMove } from '../../lib/pieces/King';
import { Team } from '../../lib/Team';
import { destinationHasSameTeam } from '../../lib/pieces/PieceHelpers';
import { PieceProps } from '../../lib/model/PieceProps';

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
        setState(movePiece(state, fileIndex, rankIndex));
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
    let isValidMove: boolean = true;
    switch(prevSquare.piece.piece) {
        case 'pawn':
            isValidMove = isLegalPawnMove(state, getCoordinates(prevSquare), getCoordinates(nextSquare));
            break;
        case 'knight':
            isValidMove = isLegalKnightMove(getCoordinates(prevSquare), getCoordinates(nextSquare));
            break;
        case 'rook':
            isValidMove = isLegalRookMove(state, getCoordinates(prevSquare), getCoordinates(nextSquare));
            break;
        case 'bishop':
            isValidMove = isLegalBishopMove(state, getCoordinates(prevSquare), getCoordinates(nextSquare));
            break;
        case 'king':
            isValidMove = isLegalKingMove(getCoordinates(prevSquare), getCoordinates(nextSquare));
            break;
        case 'queen':
            isValidMove = isLegalBishopMove(state, getCoordinates(prevSquare), getCoordinates(nextSquare))
                        || isLegalRookMove(state, getCoordinates(prevSquare), getCoordinates(nextSquare));
            break;
    }

    if (!isValidMove) {
        return false;
    }

    const teamPieceMap = state.whichTeamsTurn === Team.White ? state.whitePieceMap : state.blackPieceMap;
    const enemyPieceMap = state.whichTeamsTurn === Team.White ? state.blackPieceMap : state.whitePieceMap;

    if (prevSquare.piece.piece === 'king') {
        // check if any enemy piece can attack king's new position. (maybe move this to under isLegalKingMove?)
        const doesMoveResultInCheck = simulateMove(state, prevSquare, nextSquare, () => {
            // TODO: need access to pieces!
            // map = {piece: squareState[]}
            // map.keys.foreach OR map[piece].foreach
            for (let square of enemyPieceMap['pawn']) {
                if (isLegalPawnMove(state, getCoordinates(square), getCoordinates(nextSquare))) {
                    console.log("Under attack by pawn")
                    return true;
                }
            }

            for (let square of enemyPieceMap['knight']) {
                if (isLegalKnightMove(getCoordinates(square), getCoordinates(nextSquare))) {
                    console.log("Under attack by knight")
                    return true;
                }
            }

            for (let square of enemyPieceMap['rook']) {
                if (isLegalRookMove(state, getCoordinates(square), getCoordinates(nextSquare))) {
                    console.log("Under attack by rook")
                    return true;
                }
            }

            for (let square of enemyPieceMap['bishop']) {
                if (isLegalBishopMove(state, getCoordinates(square), getCoordinates(nextSquare))) {
                    console.log("Under attack by bishop")
                    return true;
                }
            }

            for (let square of enemyPieceMap['king']) {
                if (isLegalKingMove(getCoordinates(square), getCoordinates(nextSquare))) {
                    console.log("Under attack by king")
                    return true;
                }
            }

            for (let square of enemyPieceMap['queen']) {
                if (isLegalBishopMove(state, getCoordinates(square), getCoordinates(nextSquare))
                || isLegalRookMove(state, getCoordinates(square), getCoordinates(nextSquare))) {
                    console.log("Under attack by queen")
                    return true;
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
            for (let square of enemyPieceMap['rook']) {
                if (isLegalRookMove(state, getCoordinates(square), getCoordinates(kingSquare))) {
                    console.log("Under attack by rook")
                    return true;
                }
            }
            
            for (let square of enemyPieceMap['bishop']) {
                if (isLegalBishopMove(state, getCoordinates(square), getCoordinates(kingSquare))) {
                    console.log("Under attack by bishop")
                    return true;
                }
            }

            for (let square of enemyPieceMap['queen']) {
                if (isLegalBishopMove(state, getCoordinates(square), getCoordinates(kingSquare))
                || isLegalRookMove(state, getCoordinates(square), getCoordinates(kingSquare))) {
                    console.log("Under attack by queen")
                    return true;
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

const simulateMove = (state: BoardState, prevSquare: SquareState, nextSquare: SquareState, validationFunction: () => boolean): boolean => {
    if (prevSquare.piece == null) {
        throw new Error("Attempted to simulate move without a moving piece.")
    }

    const teamPieceMap = state.whichTeamsTurn === Team.White ? state.whitePieceMap : state.blackPieceMap;
    const enemyPieceMap = state.whichTeamsTurn === Team.White ? state.blackPieceMap : state.whitePieceMap;
    
    let capturedPiece: PieceProps | undefined;

    if (nextSquare.piece) {
        capturedPiece = nextSquare.piece;
        enemyPieceMap[nextSquare.piece.piece].delete(nextSquare);
    }

    teamPieceMap[prevSquare.piece.piece].delete(prevSquare);
    teamPieceMap[prevSquare.piece.piece].add(nextSquare);

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

    return result;
}

