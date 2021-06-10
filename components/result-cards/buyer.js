import React from 'react';
import { Grid, Typography, Box, withTheme, withStyles } from '@material-ui/core';
import styles from '../../styles/result-blocks/cards';

function Card(props) {
    const data = props.children;
    const { classes } = props;
    const { palette } = props.theme;

    return (
        <Grid item xs={12}>
            <Box boxShadow={10} className={classes.container} style={{
                backgroundColor: palette.primary.main,
                color: palette.primary.contrastText,
                }} textAlign='left'>
                <Grid container>
                    <Grid xs={3} item>
                        <Box>
                            <Typography variant='h6'>Location</Typography>
                            <Typography variant='body1'>
                                {data.house_no} {data.house_name}, {data.street}
                            </Typography>
                            <Typography variant='body1'>
                                {data.city} - {data.pincode}
                            </Typography>
                            <Typography variant='body1'>
                                {data.state_name}
                            </Typography>
                        </Box>
                    </Grid>

                    <Grid item xs={2}>
                        <Box>
                            <Typography variant='body1'>{data.bhk} BHK</Typography>
                            <Typography variant='body1'>{data.prop_type}</Typography>
                            <Typography variant='body1'>{data.prop_area} sqft</Typography>
                        </Box>
                    </Grid>

                    <Grid item xs={2}>
                        <Box>
                            <Typography variant='h5'>{data.prop_status === "Sale" ? "Buy" : "Rent"} at</Typography>
                            <Typography variant='h5'>₹ {data.prop_price}</Typography>
                        </Box>
                    </Grid>

                    <Grid item xs={5}>
                        <Typography component='div'>
                            <Box textAlign='right'>
                                <Typography variant='h5'>Agent Details</Typography>
                                <Typography variant='body1'>{data.agent_name}</Typography>
                                <Typography variant='body1'>{data.agent_phone}</Typography>
                            </Box>
                        </Typography>
                    </Grid>
                </Grid>
            </Box>
        </Grid>
    );
}

export default withStyles(styles)(withTheme(Card));