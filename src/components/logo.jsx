import Tilt from 'react-parallax-tilt';
import brain from './brain.png';

const logo = () => {
    return (
        <div style={{marginLeft: '30px'}}>
            <Tilt className="Logo Tilt br2 shadow-2 center" options={{ max : 55 }} style={{ height: 150, width: 150}} >
                    <div className="Tilt-inner pa3">
                        <img style={{paddingTop: '5px'}} alt='logo' src={brain}/>
                    </div>
            </Tilt>
        </div>
    );
}

export default logo;