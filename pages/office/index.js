import React from 'react';
import Link from 'next/link'
import {
    Container,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Link as MuiLink,
    Typography,
    withTheme,
    withStyles,
} from '@material-ui/core';
import { Skeleton } from '@material-ui/lab';
import DescriptionIcon from '@material-ui/icons/Description';

import axios from 'axios';
import styles from '../../styles/interfaces/office';

class MainDashboard extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            data: [],
        };

        //Method Bindings
        this.updateData = this.updateData.bind(this);
    }

    componentDidMount() {
        //Fetch All Data for the first time
        this.updateData();
    }

    updateData() {
        axios.get('/api/office')
            .then(res => {
                const { data } = res;
                this.setState({
                    data
                });
            })
            .catch(e => {
                console.log('Couldn\'t fetch Data', e);
            })
    }

    render() {
        const { classes } = this.props;
        const { data } = this.state;

        return (
            <Container maxWidth={false} className={classes.container}>
                <TableContainer component={Paper}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell component="th" align='center'>ID</TableCell>
                                <TableCell component="th" align='center'>Name</TableCell>
                                <TableCell component="th" align='center'>Contact</TableCell>
                                <TableCell component="th" align='center'>Report</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {/* TODO: Shift to react-window (Windowing to reduce load time) */}
                            {/* https://github.com/bvaughn/react-window#how-is-react-window-different-from-react-virtualized */}
                            {
                                data.length ? (
                                    data.map(agent => (
                                        <TableRow key={agent.agent_id}>
                                            <TableCell align='center'>{agent.agent_id}</TableCell>
                                            <TableCell align='center'>{agent.agent_name}</TableCell>
                                            <TableCell align='center'>{agent.agent_phone}</TableCell>
                                            <TableCell align='center'>
                                                <Typography>
                                                    <Link
                                                        href={{
                                                            pathname: '/office/[agent_id]',
                                                            query: { agent_id: agent.agent_id },
                                                        }}
                                                        passHref
                                                    >
                                                        <MuiLink >
                                                            View Report
                                                    </MuiLink>
                                                    </Link>
                                                </Typography>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                ) : (
                                    (() => {
                                        let arr = [];
                                        for (let i = 0; i < 15; i++) {
                                            arr.push(
                                                <TableRow key={i}>
                                                    <TableCell align='center'><Skeleton variant="rect" /></TableCell>
                                                    <TableCell align='center'><Skeleton variant="rect" /></TableCell>
                                                    <TableCell align='center'><Skeleton variant="rect" /></TableCell>
                                                    <TableCell align='center'><Skeleton variant="rect" /></TableCell>
                                                </TableRow>
                                            );
                                        }
                                        return arr;
                                    })()
                                )
                            }
                        </TableBody>
                    </Table>
                </TableContainer>
            </Container>
        );
    }
}

export default withStyles(styles)(MainDashboard);