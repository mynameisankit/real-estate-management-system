import React from 'react';
import dynamic from 'next/dynamic';
import {
    Typography,
    Box,
    Card,
    CardContent,
    Grid,
    withTheme,
    withStyles,
} from '@material-ui/core';
const Chart = dynamic(() => import('react-apexcharts'), { ssr: false });
import styles from '../../../styles/interfaces/office/charts';
import moment from 'moment';

class Graphs extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            data: this.props.data || this.props.children,
        };
    }

    percentSales(data) {
        const pieChart = {
            options: {
                labels: ['Rented', 'Sold'],
                chart: {
                    type: 'donut',
                },
                dataLabels: {
                    enabled: true,
                    formatter: function (val) {
                        return (`${parseFloat(val).toPrecision(4)}%`);
                    },
                },
                plotOptions: {
                    pie: {
                        donut: {
                            labels: {
                                show: true,
                                'total': {
                                    show: true
                                },
                            }
                        }
                    }
                },
                legend: {
                    horizontalAlign: 'center',
                    position: 'bottom',
                    markers: {
                        radius: 12
                    },
                    fontSize: 18,
                    itemMargin: {
                        horizontal: 12
                    },
                },
            },
            series: [0, 0],
        };

        data.forEach((record) => {
            const index = record.sale_type === 'Rented' ? 0 : 1;
            pieChart.series[index] += record.amt;
        });

        return pieChart;
    }

    timelineChart(data) {
        const lineChart = {
            series: [
                {
                    name: "Sold",
                    data: [],
                },
                {
                    name: "Rented",
                    data: [],
                }
            ],
            options: {
                chart: {
                    type: 'line',
                    zoom: {
                        enabled: false,
                    },
                    animations: {
                        enabled: true
                    },
                    stroke: {
                        curve: 'smooth',
                    },
                    markers: {
                        size: 0,
                    },
                },
                labels: [],
            },
        };

        //Insert last 7 months in label
        //and store null values in the data property
        for (let i = 0; i <= 7; i++) {
            lineChart.options.labels.push(moment().subtract(i, 'months').format('MMM'));
            lineChart.series[0].data.push(null);
            lineChart.series[1].data.push(null);
        }
        lineChart.options.labels = lineChart.options.labels.reverse();

        data.forEach((record) => {
            const { sale_type, record_date } = record;

            //Get the month and year of Transaction
            const month = moment(record_date).format('MMM');

            //Store the labels separately
            const months = lineChart.options.labels;

            //Find the index of the month in the array
            const idx = months.indexOf(month);
            if (sale_type === 'Sold') {
                const { data } = lineChart.series[0];
                data[idx] = data[idx] ? (data[idx] + 1) : 1;
            }
            else {
                const { data } = lineChart.series[1];
                data[idx] = data[idx] ? (data[idx] + 1) : 1;
            }
        });

        return lineChart;
    }

    pieChart(data, mapping, field) {
        const pieChart = {
            series: [],
            options: {
                chart: {
                    type: 'pie',
                },
                dataLabels: {
                    enabled: true,
                    formatter: function (val) {
                        return (`${parseFloat(val).toPrecision(4)}%`);
                    },
                },
                labels: [],
            },
        };

        //Insert Lables according to mapping
        //And 0s in series
        for (let i in mapping) {
            pieChart.options.labels.push(i);
            pieChart.series.push(0);
        }

        data.forEach(record => {
            const prop_type = record[field];
            const idx = mapping[prop_type];
            pieChart.series[idx] += 1;
        });

        return pieChart;
    }

    stateChart(data) {
        //Mapping States to indexes
    }

    render() {
        const { data } = this.state;
        const { classes } = this.props;

        const percentSales = this.percentSales(data);
        const timelineChart = this.timelineChart(data);

        //Mappings
        const propTypeMappings = {
            "Apartment": 0,
            "Bungalow": 1,
            "Flat": 2,
            "Villa": 3,
        };

        const statesMapping = {
            'Uttar Pradesh': 0,
            'Assam': 1,
            'Maharashtra': 2,
            'Delhi': 3,
            'Rajasthan': 4,
            'Madhya Pradesh': 5,
            'Kerala': 6,
            'Telangana': 7,
            'Orissa': 8,
            'Bihar': 9,
            'Jharkhand': 10,
            'Punjab': 11,
            'Karnataka': 12,
            'Haryana': 13,
            'Andhra Pradesh': 14,
            'West Bengal': 15,
            'Tamil Nadu': 16,
        };

        const propTypeChart = this.pieChart(data, propTypeMappings, 'prop_type');
        const statePieChart = this.pieChart(data, statesMapping, 'state_name');

        return (
            <Box>
                {/* Overview Stats */}
                <Grid container spacing={4}>

                    {/* Graph to show % of rents and sales in all transactions */}
                    <Grid item md={4}>
                        <Card raised className={classes.card}>
                            <CardContent className={classes.content}>
                                <Typography variant='h6'>Percentage by Rent / Sales</Typography>
                                <Chart
                                    type='donut'
                                    options={percentSales.options}
                                    series={percentSales.series}
                                    height='100%'
                                />
                            </CardContent>
                        </Card>
                    </Grid>

                    {/* Property Type Wise */}
                    <Grid item md={4}>
                        <Card raised className={classes.card}>
                            <CardContent className={classes.content}>
                                <Typography variant='h6'>Percentage by Property Type</Typography>
                                <Chart
                                    type='pie'
                                    options={propTypeChart.options}
                                    series={propTypeChart.series}
                                    height='100%'
                                />
                            </CardContent>
                        </Card>
                    </Grid>

                    {/* State Wise */}
                    <Grid item md={4}>
                        <Card raised className={classes.card}>
                            <CardContent className={classes.content}>
                                <Typography variant='h6'>Percentage by States</Typography>
                                <Chart
                                    type='pie'
                                    options={statePieChart.options}
                                    series={statePieChart.series}
                                    height='100%'
                                />
                            </CardContent>
                        </Card>
                    </Grid>

                    {/* Graph to show sales / rents in past 6 months */}
                    <Grid item md={12}>
                        <Card raised className={classes.card}>
                            <CardContent className={classes.content}>
                                <Chart
                                    type='line'
                                    options={timelineChart.options}
                                    series={timelineChart.series}
                                    height='100%'
                                />
                            </CardContent>
                        </Card>
                    </Grid>

                </Grid>
            </Box>
        );
    }
}

export default withStyles(styles)(Graphs);