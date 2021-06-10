import React from 'react';
import { withStyles } from '@material-ui/core';
import styles from '../styles/loading';

function LoadingScreen(props) {
    const { classes } = props;

    return (
        <div className={classes.container}>
            <div className={classes.building}>
                <div className={classes.windowAlt}>
                    <div className={classes.pullie} />
                </div>
                <div className={classes.window}>
                    <div className={classes.streak} />
                </div>
                <div className={classes.window}>
                    <div className={classes.streak} />
                </div>
                <div className={classes.window}>
                    <div className={classes.streak} />
                </div>
                <div className={classes.windowAlt}>
                    <div className={classes.pullie} />
                </div>
                <div className={classes.window}>
                    <div className={classes.streak} />
                </div>
                <div className={classes.door}>
                    <div className={classes.doorWindow} />
                    <div className={classes.box} />
                </div>
            </div>
        </div>
    );
}

export default withStyles(styles)(LoadingScreen);