import React from "react";
import './Square.css'

export class Square extends React.Component<{ file: number, rank: number, color: string }> {
    FILE_CHAR_STRING = "ABCDEFGH";

    render() {
        const buttonStyle = {
            backgroundColor: this.props.color
        };
        return (
            <button className="square" style={buttonStyle}>
                {/* {'\u265C'} */}
                {/* {`${this.FILE_CHAR_STRING[this.props.file]}${this.props.rank + 1}`} */}
                {`${this.props.file}${this.props.rank}`}
            </button>
        );
    }
}