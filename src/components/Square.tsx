import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChessKing, faChessKnight } from '@fortawesome/free-solid-svg-icons'
// import { faChessKing as regularKing } from '@fortawesome/free-regular-svg-icons'

import './Square.css'

export const Square = (props: { file: number, rank: number, color: string, onClick: (file: number, rank: number) => void}) => {
    const FILE_CHAR_STRING = "ABCDEFGH";
    const buttonStyle = {
        backgroundColor: props.color
    };
    return (
        <button className="square" style={buttonStyle} onClick={() => props.onClick(props.file, props.rank)}>
            {/* {'\u265C'} */}
            {/* {`${this.FILE_CHAR_STRING[this.props.file]}${this.props.rank + 1}`} */}
            <FontAwesomeIcon icon={faChessKnight} style={{ 
                color: "white",
                filter: "drop-shadow(2px 2px 5px rgb(0 0 0 / 0.4))"
            }}/>
            {/* {`${props.file}${props.rank}`} */}
        </button>
    );
}