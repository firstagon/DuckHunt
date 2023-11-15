import { Fragment } from "react"

const GameInfo = ({ level, score, killed, addClass }) => {

    return (
        <Fragment>
            <div className='gameInfo'>
                <span className='gameScore'> LEVEL <br /> {level} </span>
                <span className='gameScore'> SCORE <br /> {score} </span>
                <span className='gameScore'> DUCKS <br /> {killed} </span>
            </div>
            <span className={'level ' + addClass}> LEVEL {level} </span>
        </Fragment>
    )
}

export default GameInfo