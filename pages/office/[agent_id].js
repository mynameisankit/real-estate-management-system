import React from 'react';
import {
    Container,
    Typography,
    Box,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    withTheme,
    withStyles,
} from '@material-ui/core';
import moment from 'moment';
import Charts from '../../components/result-cards/office/Charts';
import styles from '../../styles/interfaces/report';

//For getServerSideProps
import { executeQuery } from '../../lib/db';

class Report extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            data: JSON.parse(this.props.data),
            agentDetails: JSON.parse(this.props.agentDetails),
        };
    }

    render() {
        const { classes } = this.props;
        const { data, agentDetails } = this.state;

        return (
            <Container maxWidth={false} className={classes.container}>
                <Box className={classes.overview}>
                    <Typography variant='h4' align='left'>{agentDetails.agent_name}'s Report</Typography>
                </Box>

                <Charts>
                    { data }
                </Charts>

                <Box>
                    <Container maxWidth={false} className={classes.container}>
                        <Typography variant='h5'>Transactions</Typography>
                        <TableContainer component={Paper}>
                            <Table>
                                <TableHead>
                                    <TableRow>
                                        <TableCell component="th" align='center'>Transaction ID</TableCell>
                                        <TableCell component="th" align='center'>Date</TableCell>
                                        <TableCell component="th" align='center'>Location</TableCell>
                                        <TableCell component="th" align='center'>Type</TableCell>
                                        <TableCell component="th" align='center'>BHK</TableCell>
                                        <TableCell component="th" align='center'>Deal Type</TableCell>
                                        <TableCell component="th" align='center'>Transaction Amount</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {/* TODO: Shift to react-window (Windowing to reduce load time) */}
                                    {/* https://github.com/bvaughn/react-window#how-is-react-window-different-from-react-virtualized */}
                                    {
                                        data.map(transaction => {
                                            const address = `${transaction.house_no}, ${transaction.house_name}, ${transaction.street} ${transaction.city} - ${transaction.pincode}, ${transaction.state_name}`;

                                            return (
                                                <TableRow key={transaction.record_id}>
                                                    <TableCell align='center'>{transaction.record_id}</TableCell>
                                                    <TableCell align='center'>
                                                        { moment(transaction.record_date).format('MMMM D, YYYY') }
                                                    </TableCell>
                                                    <TableCell align='center'>{address}</TableCell>
                                                    <TableCell align='center'>{transaction.prop_type}</TableCell>
                                                    <TableCell align='center'>{transaction.bhk}</TableCell>
                                                    <TableCell align='center'>{transaction.sale_type}</TableCell>
                                                    <TableCell align='center'>{transaction.amt}</TableCell>
                                                </TableRow>
                                            );
                                        })
                                    }
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </Container>
                </Box>
            </Container >
        );
    }
}

export async function getServerSideProps(context) {
    const { agent_id } = context.query;
    let results = (await executeQuery(`select * from record natural join agent natural join buyer natural join property where agent_id = ${agent_id}`));
    results = JSON.stringify(results);

    let agentDetails = (await executeQuery(`select * from agent where agent_id = ${agent_id}`));
    agentDetails = JSON.stringify(agentDetails[0]);

    return {
        props: {
            data: results,
            agentDetails,
        },
    }
}

export default withStyles(styles)(Report);