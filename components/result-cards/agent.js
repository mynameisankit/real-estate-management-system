import React from 'react';
import { Grid, TextField, Typography, Box, withTheme, withStyles, Button } from '@material-ui/core';
import styles from '../../styles/result-blocks/cards';
import axios from 'axios';

class Card extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            input: {
                buyer_phone: '',
            },
        };

        //Method Bindings
        this.updateStatus = this.updateStatus.bind(this);
        this.handleTextField = this.handleTextField.bind(this);
    }

    updateStatus() {
        const data = this.props.children;
        const { input } = this.state;
        const status = data.prop_status === "Sale" ? "Sell" : "Rent";
        //Update the state of the parent;
        axios.get('/api/agent/update', {
            params: { prop_id: data.prop_id, buyer_phone: input.buyer_phone, status },
        })
            .then(res => {
            })
            .catch(e => {
                console.log(e);
            });
    }

    handleTextField(e) {
        this.setState({
            input: {
                buyer_phone: e.target.value,
            },
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
                                <Typography variant='h5'>{data.prop_status === "Sale" ? "Buy" : data.prop_status} at</Typography>
                                <Typography variant='h5'>₹ {data.prop_price}</Typography>
                            </Box>
                        </Grid>

                        <Grid item xs={2}>
                            <Box>
                                <Typography variant='h6'>{data.seller_name}</Typography>
                                <Typography variant='h6'>{data.seller_phone}</Typography>
                            </Box>
                        </Grid>

                        {
                            data.prop_status === 'Sold' || data.prop_status === 'Rented' ? null : (
                                <Grid item xs={3} className={classes.buttonWrapper}>
                                    <Box textAlign='right' width='100%'>
                                        <TextField
                                            variant='outlined'
                                            label="Buyer Phone Number"
                                            onBlur={this.handleTextField}
                                            fullWidth
                                            style={{ marginBottom: '20px' }}
                                        />
                                        <Button size='large' variant="contained" color="secondary" onClick={this.updateStatus}>
                                            {data.prop_status === "Sale" ? "Sell" : "Rent"}
                                        </Button>
                                    </Box>
                                </Grid>
                            )
                        }
                    </Grid>
                </Box>
            </Grid>
        );
    }


}

export default withStyles(styles)(withTheme(Card));