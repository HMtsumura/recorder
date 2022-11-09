import { useContext } from 'react';
import { Color, ColorPicker } from 'material-ui-color';
import { MyGlobalContext } from '../contexts/openRegistForm';

const palette = {
    red: '#ff0000',
    blue: '#0000ff',
    green: '#00ff00',
    yellow: 'yellow',
    cyan: 'cyan',
    lime: 'lime',
    gray: 'gray',
    orange: 'orange',
    purple: 'purple',
    black: 'black',
    white: 'white',
    pink: 'pink',
    darkblue: 'darkblue',
};

export default function ColorPallete() {
    const ctx = useContext(MyGlobalContext);

    function handleColorChange(newColor: Color){
        ctx.setColor(newColor);
    }

    return (
        <ColorPicker
            value={ctx.color}
            onChange={handleColorChange}
            palette={palette}
            hideTextfield
        />

    );
}