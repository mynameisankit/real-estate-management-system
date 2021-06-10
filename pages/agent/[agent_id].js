import React from 'react';
import Head from 'next/head';
import Image from 'next/image';
import {
    Container,
    Grid,
    Box,
    Typography,
    TextField,
    Checkbox,
    FormControl,
    FormGroup,
    FormControlLabel,
    InputLabel,
    Select,
    Button,
    Snackbar,
    CircularProgress,
    withTheme,
    withStyles
} from '@material-ui/core';
import { Alert } from '@material-ui/lab';
import AgentCard from '../../components/result-cards/agent';
import AddButton from '../../components/add-button';
import styles from '../../styles/interfaces/filter';

//Icons
import SearchIcon from '@material-ui/icons/Search';

//To fetch / request data dynamically
//TODO: Change to SWR (https://swr.vercel.app/)
import axios from 'axios';

class Seller extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            filters: {
                house_no: '',
                street: '',
                city: '',
                state: '',
                type: '',
                rent: true,
                sale: true,
                rented: false,
                sold: false,
                prop_price: '',
                prop_area: '',
                bhk: '',
            },
            data: [],
            snackbar: {
                isOpen: false,
                message: '',
            },
            isResultLoading: false,
        };

        //Instance Properties
        this.agent_id = this.props.params.agent_id;

        //Method Bindings
        this.handleSelect = this.handleSelect.bind(this);
        this.handleTextField = this.handleTextField.bind(this);
        this.handleCheckbox = this.handleCheckbox.bind(this);
        this.updateData = this.updateData.bind(this);
        this.handleSnackbar = this.handleSnackbar.bind(this);
    }

    componentDidMount() {
        //Fetch all data
        this.updateData();
    }

    handleSnackbar(event, reason) {
        if (reason !== 'clickaway') {
            this.setState({
                snackbar: {
                    isOpen: false,
                    message: '',
                }
            });
        }
    }

    updateData() {
        const { filters } = this.state;

        if (!(filters.rent || filters.sale || filters.sold || filters.rented)) {
            this.setState({
                snackbar: {
                    isOpen: true,
                    message: 'Please select "Rent" or "Sale" or "Rented" or "Sold" or all of them',
                },
            });
        }
        else {
            this.setState({
                isResultLoading: true,
            });

            axios.get(`/api/agent`, {
                params: { ...filters, agent_id: this.agent_id },
            })
                .then(res => {
                    const { data } = res;
                    //If there is any error is response then don't
                    //update the state
                    if (res.status !== toString(500)) {
                        this.setState({
                            data
                        });
                    }
                    else {
                        console.log('Couldn\'t Fetch Data');
                    }

                    //Update the state of the Result block
                    this.setState({
                        isResultLoading: false,
                    });
                })
                .catch(e => {
                    console.log('Error : ', e);
                    //TODO: Insert Alert here
                });
        }
    }

    handleSelect(event) {
        const { filters } = this.state;
        const { value } = event.target;
        filters.state = value;
        this.setState({
            filters
        });
    }

    handleTextField(event, field) {
        const { filters } = this.state;
        const { value } = event.target;
        filters[field] = value;
        this.setState({
            filters
        });
    }

    handleCheckbox(event, field) {
        const { filters } = this.state;
        filters[field] = event.target.checked;
        this.setState({
            filters
        });
    }

    render() {
        const { data, filters, snackbar } = this.state;
        const { classes } = this.props;

        return (
            <React.Fragment>
                <Head>
                    <title>Agent Interface</title>
                </Head>
                <Container disableGutters maxWidth={false} className={classes.container}>

                    <Box
                        position='fixed'
                        zIndex={-1}
                        overflow='hidden'
                        height='100%'
                        width='100%'
                        className={classes.backgroundImage}
                    >
                        <Image
                            alt="Mountains"
                            src='/images/house.jpg'
                            layout="fill"
                            objectFit="cover"
                        />
                    </Box>

                    <Box className={classes.mainWrapper}>
                        {/* Filter Box */}
                        <Box className={classes.filter}>
                            <Grid container>
                                <Grid item md={2} className={classes.gridItem}>
                                    <Typography variant='h6' className={classes.filterHeading}>Location</Typography>
                                    <form autoComplete="off">
                                        <TextField
                                            variant='outlined'
                                            label="House Number"
                                            onBlur={(event) => { this.handleTextField(event, 'house_no') }}
                                            fullWidth
                                            className={classes.input}
                                        />
                                        <TextField
                                            variant='outlined'
                                            label="Street"
                                            onBlur={(event) => { this.handleTextField(event, 'street') }}
                                            fullWidth
                                            className={classes.input}
                                        />
                                        <TextField
                                            variant='outlined'
                                            label="City"
                                            onBlur={(event) => { this.handleTextField(event, 'city') }}
                                            fullWidth
                                            className={classes.input}
                                        />
                                    </form>
                                    {/* TODO: Edit the look */}
                                    <FormControl className={classes.stateFormControl}>
                                        <InputLabel>State</InputLabel>
                                        <Select
                                            native
                                            value={filters.state ? filters.state : 'None'}
                                            onChange={this.handleSelect}
                                        >
                                            {
                                                ['None', 'Uttar Pradesh', 'Assam', 'Maharashtra', 'Delhi', 'Rajasthan', 'Madhya Pradesh', 'Kerala', 'Telangana', 'Orissa', 'Bihar', 'Jharkhand', 'Punjab', 'Karnataka', 'Haryana', 'Andhra Pradesh', 'West Bengal', 'Tamil Nadu'].map(state => (<option key={state} value={state}>{state}</option>))
                                            }
                                        </Select>
                                    </FormControl>
                                </Grid>

                                <Grid item md={2} className={classes.gridItem}>
                                    <Typography variant='subtitle1'>&nbsp;</Typography>
                                    <form autoComplete="off">
                                        <TextField
                                            onBlur={(event) => { this.handleTextField(event, 'prop_area') }}
                                            variant='outlined'
                                            label="Area"
                                            className={classes.input}
                                            fullWidth
                                        />
                                        <TextField
                                            onBlur={(event) => { this.handleTextField(event, 'prop_price') }}
                                            variant='outlined'
                                            label="Price"
                                            className={classes.input}
                                            fullWidth
                                        />
                                    </form>
                                </Grid>

                                <Grid item md={2} className={classes.gridItem}>
                                    <Typography variant='subtitle1'>&nbsp;</Typography>
                                    <form autoComplete="off">
                                        <TextField
                                            onBlur={(event) => { this.handleTextField(event, 'bhk') }}
                                            variant='outlined'
                                            label="BHK"
                                            fullWidth
                                            className={classes.input}
                                        />
                                        <TextField
                                            variant='outlined'
                                            label="Type"
                                            onBlur={(event) => { this.handleTextField(event, 'type') }}
                                            fullWidth
                                            className={classes.input}
                                        />
                                    </form>

                                    {/* Rent / Sale Checkboxes */}
                                    <FormGroup row>
                                        <FormControlLabel
                                            onChange={(event) => { this.handleCheckbox(event, 'rent') }}
                                            checked={filters.rent}
                                            control={<Checkbox color="primary" />}
                                            label='Rent'
                                        />
                                        <FormControlLabel
                                            onChange={(event) => { this.handleCheckbox(event, 'sale') }}
                                            checked={filters.sale}
                                            control={<Checkbox color="primary" />}
                                            label='Sale'
                                        />
                                    </FormGroup>
                                    <FormGroup row>
                                        <FormControlLabel
                                            onChange={(event) => { this.handleCheckbox(event, 'rented') }}
                                            checked={filters.rented}
                                            control={<Checkbox color="primary" />}
                                            label='Rented'
                                        />
                                        <FormControlLabel
                                            onChange={(event) => { this.handleCheckbox(event, 'sold') }}
                                            checked={filters.sold}
                                            control={<Checkbox color="primary" />}
                                            label='Sold'
                                        />
                                    </FormGroup>
                                </Grid>

                                {/* Search Button */}
                                <Grid item md={6} className={`${classes.buttonWrapper} ${classes.gridItem}`}>
                                    <Box width='100%' textAlign='right'>
                                        <Button
                                            variant="contained"
                                            color="primary"
                                            onClick={this.updateData}
                                            className={classes.button}
                                            startIcon={<SearchIcon />}
                                        >Filter</Button>
                                    </Box>
                                </Grid>

                            </Grid>
                        </Box>

                        {/* Results Box */}
                        <Box textAlign='center' className={classes.resultBox}>
                            {
                                this.state.isResultLoading ? (
                                    <React.Fragment>
                                        <CircularProgress size={50} />
                                        <Typography variant='h5'>Loading...</Typography>
                                    </React.Fragment>
                                ) : (
                                    <Grid container spacing={4}>
                                        {
                                            data.length !== 0 ? (
                                                data.map(row => <AgentCard callback={this.updateData} key={row.prop_id}>{row}</AgentCard>)
                                            ) : (
                                                <Grid item xs={12}>
                                                    <Box textAlign='center'>
                                                        <Typography variant='h4'>No Results Found</Typography>
                                                    </Box>
                                                </Grid>
                                            )
                                        }
                                    </Grid>
                                )
                            }
                        </Box>
                    </Box>

                    <Snackbar
                        disableWindowBlurListener
                        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
                        open={snackbar.isOpen}
                        autoHideDuration={6000}
                        onClose={this.handleSnackbar}
                    >
                        <Alert variant='filled' onClose={this.handleSnackbar} severity="error" elevation={6}>
                            {snackbar.message}
                        </Alert>
                    </Snackbar>

                </Container>
            </React.Fragment>
        );
    }
};

export function getServerSideProps(context) {
    return {
        props: { params: context.params }
    };
}

export default withStyles(styles)(withTheme(Seller));