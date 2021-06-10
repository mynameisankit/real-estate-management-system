import React from 'react';
import { Grid, Typography, Box, withTheme, withStyles, Button } from '@material-ui/core';
import styles from '../../styles/result-blocks/cards';
import axios from 'axios';

class Card extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            isLoading: false,
        };

        //Method Bindings
        this.handleDelete = this.handleDelete.bind(this);
    }

    handleDelete() {        
        const data = this.props.children;
        this.setState({
            isLoading: true,
        });

        axios.get('/api/seller/delete', {
            params: { prop_id: data.prop_id },
        })
        .then(res => {
            //Update the state of the parent;
            this.setState({
                isLoading: false,
            });
        })
        .catch(e => {
            console.log(e);
        });
    }

    render() {
        const data = this.props.children;
        const { classes } = this.props;
        const { palette } = this.props.theme;

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
                                <Typography variant='body1'>{data.prop_id} BHK</Typography>
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

                        <Grid item xs={5} className={classes.buttonWrapper}>
                            <Box textAlign='right' width='100%'>
                                <Button size='large' variant="contained" color="secondary" onClick={this.handleDelete}>
                                    Unlist
                                </Button>
                            </Box>
                        </Grid>
                    </Grid>
                </Box>
            </Grid>
        );
    }


}

export default withStyles(styles)(withTheme(Card));