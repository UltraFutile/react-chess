import React from "react";
import './Square.css'

export class Square extends React.Component {
    render() {
        return (
            <button className="square">
                {'\u265C'}
            </button>
        );
    }
}