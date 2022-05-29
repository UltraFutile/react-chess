import React from "react";
import './Square.css'

export class Square extends React.Component<{ file: number, rank: number }> {
    FILE_CHAR_STRING = "ABCDEFGH";

    render() {
        return (
            <button className="square">
                {/* {'\u265C'} */}
                {`${this.FILE_CHAR_STRING[this.props.file]}${this.props.rank + 1}`}
            </button>
        );
    }
}