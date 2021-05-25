import React from 'react'
import './AppLoader.css'
import {Dimmer,Loader} from 'semantic-ui-react'

const AppLoader = (props) => {
    return (
        <Dimmer className="loadingDimmer" active={props.loading}>
            <Loader size="huge" content="Loading" />
        </Dimmer>
    )
}

export default AppLoader