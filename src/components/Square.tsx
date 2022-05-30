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
            {`${props.file}${props.rank}`}
        </button>
    );
}