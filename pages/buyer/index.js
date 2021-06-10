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
import BuyerCard from '../../components/result-cards/buyer';
import styles from '../../styles/interfaces/filter';

//Icons
import SearchIcon from '@material-ui/icons/Search';

//For getServerSideProps
// import { fetchData } from '../../lib/db';

//To fetch / request data dynamically
//TODO: Change to SWR (https://swr.vercel.app/)
import axios from 'axios';

class PropertyList extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            filters: {
                street: '',
                city: '',
                state: '',
                type: '',
                rent: true,
                sale: true,
                budget_max: '',
                budget_min: '',
                area_max: '',
                area_min: '',
                bhk: '',
            },
            data: [],
            snackbar: {
                isOpen: false,
                message: '',
            },
            isResultLoading: false,
        };

        //Method Bindings
        this.handleSelect = this.handleSelect.bind(this);
        this.handleRange = this.handleRange.bind(this);
        this.handleTextField = this.handleTextField.bind(this);
        this.handleCheckbox = this.handleCheckbox.bind(this);
        this.updateData = this.updateData.bind(this);
        this.handleSnackbar = this.handleSnackbar.bind(this);
    }

    componentDidMount() {
        //Fetch all data for the first time
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

        if (!(filters.rent || filters.sale)) {
            this.setState({
                snackbar: {
                    isOpen: true,
                    message: "Please select 'Rent' or 'Sale' or both of them",
                },
            });
        }
        else {
            this.setState({
                isResultLoading: true,
            });

            axios.get('/api/buyer', {
                params: { ...filters },
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

    handleRange(event, field, type) {
        const { filters } = this.state;
        const { value } = event.target;
        if (field === 'budget') {
            if (type === 'max') {
                filters.budget_max = value;
            }
            else {
                filters.budget_min = value;
            }
        }
        else {
            if (type === 'max') {
                filters.area_max = value;
            }
            else {
                filters.area_min = value;
            }
        }
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
                    <title>Buyer Interface</title>
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
                                        <Select
                                            native
                                            value={filters.state ? filters.state : 'State'}
                                            onChange={this.handleSelect}
                                        >
                                            {
                                                ['State', 'Uttar Pradesh', 'Assam', 'Maharashtra', 'Delhi', 'Rajasthan', 'Madhya Pradesh', 'Kerala', 'Telangana', 'Orissa', 'Bihar', 'Jharkhand', 'Punjab', 'Karnataka', 'Haryana', 'Andhra Pradesh', 'West Bengal', 'Tamil Nadu'].map(state => (<option key={state} value={state}>{state}</option>))
                                            }
                                        </Select>
                                    </FormControl>
                                </Grid>

                                <Grid item md={5} className={classes.gridItem}>
                                    <Typography variant='h6' className={classes.filterHeading}>Budget</Typography>
                                    <form autoComplete="off" className={classes.rangeForm}>
                                        <TextField
                                            onBlur={(event) => { this.handleRange(event, 'budget', 'min') }}
                                            variant='outlined'
                                            label="Min"
                                            className={classes.input}
                                            style={{ width: '47%' }}
                                        />
                                        <TextField
                                            onBlur={(event) => { this.handleRange(event, 'budget', 'max') }}
                                            variant='outlined'
                                            label="Max"
                                            className={classes.input}
                                            style={{ width: '47%' }}
                                        />
                                    </form>
                                    <Typography variant='h6' className={classes.filterHeading}>Area</Typography>
                                    <form autoComplete="off" className={classes.rangeForm}>
                                        <TextField
                                            onBlur={(event) => { this.handleRange(event, 'area', 'min') }}
                                            variant='outlined'
                                            label="Min"
                                            className={classes.input}
                                            style={{ width: '47%' }}
                                        />
                                        <TextField
                                            onBlur={(event) => { this.handleRange(event, 'area', 'max') }}
                                            variant='outlined'
                                            label="Max"
                                            className={classes.input}
                                            style={{ width: '47%' }}
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
                                </Grid>

                                {/* Search Button */}
                                <Grid item md={3} className={`${classes.buttonWrapper} ${classes.gridItem}`}>
                                    <Box width='100%' textAlign='right'>
                                        <Button
                                            variant="contained"
                                            color="primary"
                                            onClick={this.updateData}
                                            className={classes.button}
                                            startIcon={<SearchIcon />}
                                        >Search</Button>
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
                                                data.map(row => <BuyerCard key={row.prop_id}>{row}</BuyerCard>)
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

export default withStyles(styles)(withTheme(PropertyList));