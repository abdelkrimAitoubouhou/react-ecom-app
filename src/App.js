import './App.css';
import { Navigate, Route, Routes, useLocation, useParams} from "react-router-dom";
import Products from "./components/Products";
import "bootstrap/dist/css/bootstrap.min.css";
import AddProduct from "./components/AddProduct";
import UpdateProduct from "./components/UpdateProduct";
import Login from "./auth/Login";
import {useEffect, useState} from "react";
import {jwtDecode} from 'jwt-decode';
import SignUp from "./auth/SignUp";
import NavBar from "./components/navBar/NavBar";

function App() {
    const [token, setToken] = useState(null);

    useEffect(() => {
        const savedToken = localStorage.getItem('jwt');
        if (savedToken) {
            const {exp} = jwtDecode(savedToken);
            if (Date.now() >= exp * 1000) {
                // Token is expired
                localStorage.removeItem('jwt');
                setToken(null);
            } else {
                setToken(savedToken);
            }
        }
    }, []);

    const handleLogin = (newToken) => {
        localStorage.setItem('jwt', newToken);
        setToken(newToken);
    };

    return (
        <MainApp token={token} handleLogin={handleLogin}/>
    );
}

const MainApp = ({token, handleLogin}) => {
    const location = useLocation();
    const shouldShowNavBar =
        location.pathname !== '/login'
        && location.pathname !== '/cart'
        && location.pathname !== '/sign-up';

    const UpdateProductWrapper = () => {
        const {productId} = useParams();
        return <UpdateProduct productId={productId}/>;
    };

    return (

        <>
                {shouldShowNavBar && <NavBar/>}
                <Routes>
                    <Route path="/home" element={token ? <Products/> : <Navigate to="/login"/>}/>
                    <Route path="/" element={token ? <Products/> : <Navigate to="/login"/>}/>
                    <Route path="/add-product" element={token ? <AddProduct/> : <Navigate to="/login"/>}/>
                    <Route path="/update-product/:productId"
                           element={token ? <UpdateProductWrapper/> : <Navigate to="/login"/>}/>
                    <Route path="/products" element={token ? <Products/> : <Navigate to="/login"/>}/>
                    <Route path="/login" element={<Login onLogin={handleLogin}/>}/>
                    <Route path="/sign-up" element={<SignUp/>}/>
                </Routes>
        </>
    );
}

export default App;
