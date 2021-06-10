import React from 'react';
import { Grid, Button, withTheme, withStyles } from '@material-ui/core';
import AddCircleIcon from '@material-ui/icons/AddCircle';

const styles = {
    root: {
        height: '120px',
        width: '100%',
    },
};

class AddButton extends React.Component {
    render() {
        const { classes } = this.props;

        return (
            <Grid item xs={12}>
                <Button variant='contained' color='primary' className={classes.root}>
                    <AddCircleIcon fontSize='large' />
                </Button>
            </Grid>
        );
    }
}

export default withStyles(styles)(AddButton);