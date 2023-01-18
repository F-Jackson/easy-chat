import ExpandFile from '../ExpandFile';


interface Props {
    file: string,
    type: string,
    expands?: boolean
}

export default function FileImage(props: Props) {
    const newStyle = {
        width: 'max-content',
        height: '100%'
    } as React.CSSProperties

    return (
        <ExpandFile type={props.type} src={props.file} expands={props.expands}>
            <img
                src={props.file} 
                alt="sended"
                style={props.expands === false ? newStyle : {width: '100%'}}
            />
        </ExpandFile>
    );
}