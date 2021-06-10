import React from 'react';
import Head from 'next/head';
import Link from 'next/link';
import {withRouter} from 'next/router'
import axios from 'axios';
import {
    Avatar,
    Button,
    Box,
    Typography,
    TextField,
    Container,
    Select,
    InputLabel,
    MenuItem,
    FormControl,
    Snackbar,
    Card,
    CardContent,
    Link as MuiLink,
    withStyles
} from "@material-ui/core";
import Alert from '@material-ui/lab/Alert';
import LockOutlinedIcon from "@material-ui/icons/LockOutlined";
import styles from '../styles/home';


class Home extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            snackbar: {
                isOpen: false,
                message: '',
            },
            input: {
                phone: '',
                password: '',
                userType: '',
            },
            user: {
                id: null,
                name: '',
                phone: ''
            }
        };
        //Instance Variables
        this.router = this.props.router;
        //Method Bindings
        this.handleSnackbar = this.handleSnackbar.bind(this);
        this.handleInput = this.handleInput.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.hashPassword = this.hashPassword.bind(this);
    }

    handleSnackbar(event, reason) {
        if (reason !== 'clickaway') {
            this.setState({
                snackbar: {
                    isOpen: false,
                    message: '',
                },
            });
        }
    }

    handleInput(event, field) {
        const { input } = this.state;
        input[field] = event.target.value;
        this.setState({
            input
        });
    }

    handleSubmit(e) {
        e.preventDefault();
        const { input } = this.state;
        let flag = false;
        const errors = [];

        if (input.phone === '') {
            errors.push('Phone');
            flag = true;
        }
        if (input.password === '') {
            errors.push('Password');
            flag = true;
        }
        if (input.userType === '') {
            errors.push('User Type');
            flag = true;
        }

        if (flag) {
            let message = 'Please enter ';
            errors.forEach((item, idx) => {
                message += `${item}`;
                if (idx !== errors.length - 1) {
                    message += ', ';
                }
            });

            this.setState({
                snackbar: {
                    message,
                    isOpen: true,
                }
            });
        }
        else {
            const hash = this.hashPassword(input.password);
            axios.get('/api/auth', {
                params: {
                    userPassword: hash,
                    userPhone: input.phone,
                    userType: input.userType,
                },
            })
                .then(res => {
                    let {data} = res;
                    data = data[0];
                    let x = input.userType;
                    console.log(data[`${x}_id`]);
                    this.setState({user: {
                        id: data[`${x}_id`],
                        name: data[`${x}_name`],
                        phone: data[`${x}_phone`]
                    }})
                    console.log(this.state.user);
                    switch(input.userType){
                        case 'admin': this.router.push('/office'); break;
                        case 'agent': this.router.push(`/agent/${this.state.user.id}`); break;
                        case 'buyer': this.router.push('/buyer'); break;
                        case 'seller': this.router.push(`/seller/${this.state.user.id}`); break;
                    }
                })
                .catch(err => {
                    console.log("Log in Failed", err);
                });
        }
    }


    //Hash Password then call API to check if the user is valid
    hashPassword(ascii) {
        function rightRotate(value, amount) {
            return (value >>> amount) | (value << (32 - amount));
        };

        let mathPow = Math.pow;
        let maxWord = mathPow(2, 32);
        let lengthProperty = 'length';
        let i, j;
        let result = '';

        let words = [];
        let asciiBitLength = ascii[lengthProperty] * 8;

        let hash = this.hashPassword.h = this.hashPassword.h || [];
        let k = this.hashPassword.k = this.hashPassword.k || [];
        let primeCounter = k[lengthProperty];

        let isComposite = {};
        for (let candidate = 2; primeCounter < 64; candidate++) {
            if (!isComposite[candidate]) {
                for (i = 0; i < 313; i += candidate) {
                    isComposite[i] = candidate;
                }
                hash[primeCounter] = (mathPow(candidate, .5) * maxWord) | 0;
                k[primeCounter++] = (mathPow(candidate, 1 / 3) * maxWord) | 0;
            }
        }

        ascii += '\x80';
        while (ascii[lengthProperty] % 64 - 56) ascii += '\x00';
        for (i = 0; i < ascii[lengthProperty]; i++) {
            j = ascii.charCodeAt(i);
            if (j >> 8) return;
            words[i >> 2] |= j << ((3 - i) % 4) * 8;
        }
        words[words[lengthProperty]] = ((asciiBitLength / maxWord) | 0);
        words[words[lengthProperty]] = (asciiBitLength);

        for (j = 0; j < words[lengthProperty];) {
            let w = words.slice(j, j += 16);
            let oldHash = hash;
            hash = hash.slice(0, 8);

            for (i = 0; i < 64; i++) {
                let i2 = i + j;
                let w15 = w[i - 15], w2 = w[i - 2];

                let a = hash[0], e = hash[4];
                let temp1 = hash[7]
                    + (rightRotate(e, 6) ^ rightRotate(e, 11) ^ rightRotate(e, 25))
                    + ((e & hash[5]) ^ ((~e) & hash[6]))
                    + k[i]
                    + (w[i] = (i < 16) ? w[i] : (
                        w[i - 16]
                        + (rightRotate(w15, 7) ^ rightRotate(w15, 18) ^ (w15 >>> 3))
                        + w[i - 7]
                        + (rightRotate(w2, 17) ^ rightRotate(w2, 19) ^ (w2 >>> 10))
                    ) | 0
                    );

                let temp2 = (rightRotate(a, 2) ^ rightRotate(a, 13) ^ rightRotate(a, 22))
                    + ((a & hash[1]) ^ (a & hash[2]) ^ (hash[1] & hash[2]));

                hash = [(temp1 + temp2) | 0].concat(hash);
                hash[4] = (hash[4] + temp1) | 0;
            }

            for (i = 0; i < 8; i++) {
                hash[i] = (hash[i] + oldHash[i]) | 0;
            }
        }

        for (i = 0; i < 8; i++) {
            for (j = 3; j + 1; j--) {
                var b = (hash[i] >> (j * 8)) & 255;
                result += ((b < 16) ? 0 : '') + b.toString(16);
            }
        }
        return result;
    };

    render() {
        const { classes } = this.props;
        const { input, snackbar } = this.state;

        return (
            <React.Fragment>
                <Head>
                    <title>Login</title>
                </Head>
                <Container maxWidth={false} className={classes.container}>
                    <Container maxWidth='xs'>
                        <Card raised>
                            <CardContent>
                                <Avatar className={classes.avatar}>
                                    <LockOutlinedIcon />
                                </Avatar>

                                <Typography component="h1" variant="h5" align="center" style={{ marginBottom: '5vh' }}>
                                    Sign in
                                </Typography>

                                <TextField
                                    variant="outlined"
                                    required
                                    fullWidth
                                    label="Phone Number"
                                    autoComplete="Phone Number"
                                    value={input.phone}
                                    onChange={(e) => { this.handleInput(e, 'phone') }}
                                    style={{ marginBottom: '5vh' }}
                                />

                                <TextField
                                    variant="outlined"
                                    required
                                    fullWidth
                                    label="Password"
                                    type="password"
                                    autoComplete="current-password"
                                    value={input.password}
                                    onChange={(e) => { this.handleInput(e, 'password') }}
                                    style={{ marginBottom: '3vh' }}
                                />

                                <FormControl fullWidth style={{ marginBottom: '5vh' }}>
                                    <InputLabel id='dropdown'>Who are you?</InputLabel>
                                    <Select
                                        id='dropdown'
                                        onChange={(e) => {
                                            const { input } = this.state;
                                            input['userType'] = e.target.value;
                                            this.setState({
                                                input
                                            });
                                        }}
                                        value={input.userType}
                                        autoWidth
                                    >
                                        <MenuItem value='admin'>Admin</MenuItem>
                                        <MenuItem value='agent'>Agent</MenuItem>
                                        <MenuItem value='buyer'>Buyer</MenuItem>
                                        <MenuItem value='seller'>Seller</MenuItem>
                                    </Select>
                                </FormControl>

                                <Button
                                    fullWidth
                                    variant="contained"
                                    color="primary"
                                    onClick={this.handleSubmit}
                                    style={{ marginBottom: '2vh' }}
                                >
                                    Sign In
                                </Button>

                                <Typography>
                                    Not already an user? &nbsp;
                                    <Link href='/register' passHref>
                                        <MuiLink>
                                            Click here!
                                        </MuiLink>
                                    </Link>
                                </Typography>

                            </CardContent>
                        </Card>
                    </Container>

                    <Snackbar
                        open={snackbar.isOpen}
                        autoHideDuration={2000}
                        onClose={this.handleSnackbar}
                        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
                    >
                        <Alert onClose={this.handleSnackbar} variant='filled' severity="error" elevation={6}>
                            {snackbar.message}
                        </Alert>
                    </Snackbar>

                </Container>
            </React.Fragment >
        );
    }
};

export default withStyles(styles)(withRouter(Home));