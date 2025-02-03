import React from 'react';
import Box from '@mui/material/Box';
import Avatar from '@mui/material/Avatar';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import PersonAdd from '@mui/icons-material/PersonAdd';
import Settings from '@mui/icons-material/Settings';
import Logout from '@mui/icons-material/Logout';
import {faUser} from "@fortawesome/free-solid-svg-icons";
import {faCartShopping} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import Paper from '@mui/material/Paper';
import InputBase from '@mui/material/InputBase';
import SearchIcon from '@mui/icons-material/Search';
import {useNavigate} from "react-router-dom";

const Navbar = () => {

    const [anchorEl, setAnchorEl] = React.useState(null);
    const open = Boolean(anchorEl);
    const navigate = useNavigate();

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };

 const handleLogOut= () => {
        localStorage.removeItem('jwt');
        navigate('/login')
    };

    const handleSignUp = () => {
        setAnchorEl(null);
        navigate('/sign-up');
    };



    return (
        <React.Fragment>
            <div style={{
                position: 'fixed',
                top: 13,
            }}>
                <Paper
                    component="form"
                    sx={{
                        p: '2px 4px',
                        display: 'flex',
                        alignItems: 'center',
                        width: '350px',
                        height: '35px',
                        marginLeft: '15px',
                        borderRadius: '20px',
                        border: '1.3px solid',
                        borderColor: '#899499'
                    }}
                >

                    <InputBase
                        sx={{ml: 1, flex: 1, marginLeft: '8px !important'}}
                        placeholder="Search Product "
                        inputProps={{'aria-label': 'search products'}}
                    />
                    <IconButton type="button" sx={{p: '10px', backgroundColor: 'light'}} aria-label="search">
                        <SearchIcon/>
                    </IconButton>

                </Paper>
            </div>

            <Box style={{
                position: 'fixed',
                marginLeft: '92%',
                top: '7px',
                marginBottom: '20px'
            }}>
                <Tooltip title="Account settings">
                    <IconButton
                        onClick={handleClick}
                        size="small"
                        sx={{ml: 2}}
                        aria-controls={open ? 'account-menu' : undefined}
                        aria-haspopup="true"
                        aria-expanded={open ? 'true' : undefined}
                    >
                        <Avatar sx={{width: 40, height: 40}}>
                            <FontAwesomeIcon icon={faUser}/>
                        </Avatar>
                    </IconButton>
                </Tooltip>

            </Box>
            <Box style={{
                position: 'fixed',
                marginLeft: '88%',
                top: '7px',
                marginBottom: '20px'
            }}>
                <Tooltip title="Cart">
                    <IconButton
                        onClick={() => navigate('/cart')}
                        size="small"
                        sx={{ml: 2}}
                        //aria-controls={open ? 'account-menu' : undefined}
                        //aria-haspopup="true"
                        //aria-expanded={open ? 'true' : undefined}
                    >
                        <Avatar sx={{width: 40, height: 40}}>
                            <FontAwesomeIcon icon={faCartShopping} />
                        </Avatar>
                    </IconButton>
                </Tooltip>
            </Box>
            <Menu
                anchorEl={anchorEl}
                id="account-menu"
                open={open}
                onClose={handleClose}
                onClick={handleClose}
                slotProps={{
                    paper: {
                        elevation: 0,
                        sx: {
                            overflow: 'visible',
                            filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
                            mt: 1.5,
                            '& .MuiAvatar-root': {
                                width: 32,
                                height: 32,
                                ml: -0.5,
                                mr: 1,
                            },
                            '&::before': {
                                content: '""',
                                display: 'block',
                                position: 'absolute',
                                top: 0,
                                right: 14,
                                width: 10,
                                height: 10,
                                bgcolor: 'background.paper',
                                transform: 'translateY(-50%) rotate(45deg)',
                                zIndex: 0,
                            },
                        },
                    },
                }}
                transformOrigin={{horizontal: 'right', vertical: 'top'}}
                anchorOrigin={{horizontal: 'right', vertical: 'bottom'}}
            >
                <MenuItem onClick={handleClose}>
                    <Avatar/> Profile
                </MenuItem>

                <Divider/>
                <MenuItem onClick={handleSignUp}>
                    <ListItemIcon>
                        <PersonAdd fontSize="small"/>
                    </ListItemIcon>
                    Sign up
                </MenuItem>
                <MenuItem onClick={handleClose}>
                    <ListItemIcon>
                        <Settings fontSize="small"/>
                    </ListItemIcon>
                    Settings
                </MenuItem>
                <MenuItem onClick={handleLogOut}>
                    <ListItemIcon>
                        <Logout fontSize="small"/>
                    </ListItemIcon>
                    Logout
                </MenuItem>
            </Menu>

        </React.Fragment>

    )
};

export default Navbar;
