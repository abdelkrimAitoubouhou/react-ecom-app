import React, {useState} from 'react';
import '../App.css';
import '../css/ProductList.css';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faPlus, faTrash, faEdit, faShoppingCart} from '@fortawesome/free-solid-svg-icons';
import {deleteProduct, getProducts} from '../axios/App';
import {useNavigate} from 'react-router-dom';
import {useQuery, useMutation, useQueryClient} from 'react-query';
import {ReactQueryDevtools} from "react-query/devtools";
import Spinner from 'react-bootstrap/Spinner';
import {
    MDBCard, MDBCardImage, MDBCardBody, MDBCardTitle, MDBCardText, MDBRow, MDBCol, MDBBtn
} from 'mdb-react-ui-kit';


const Products = () => {
    const navigate = useNavigate();
    const queryClient = useQueryClient();

    const [cartItems, setCartItems] = useState([]);

    // Fetch products using useQuery
    const {

        data: products = [], error, isLoading, isError,
    } = useQuery(['products'], getProducts, {

        refetchOnWindowFocus: false, //do not re-send getProducts request to database when I close the window
        refetchOnMount: true, //do not re-send getProducts request when im accessing to another component
        retry: 0, //if there is a fetching error set a number of retrying
        cacheTime: 2000, // 60000ms ==> 60s ==> 1min
        //staleTime: 1000, //set a time to make a request and use the data in cache instead of making request to DB
        refetchInterval: 6000 //set time to refetch data

    });

    // Delete product mutation with useMutation
    const deleteMutation = useMutation(id => deleteProduct(id), {

        onSuccess: () => {
            queryClient.invalidateQueries('products'); // this make the date of products updated
            console.log("product has been deleted..")
        },

        onError: (err) => {
            console.log("delete product error : ", err)
        }
    });


    const handleDeleteButton = (id) => {
        deleteMutation.mutate(id);
    };

    const handleAddButton = () => {
        navigate('/add-product');
    };

    const handleUpdateButton = (productId) => {
        navigate(`/update-product/${productId}`);
    };


    if (isLoading) return (<div style={{marginTop: '12rem', marginLeft: '50%'}}>
        <Spinner animation="border" role="status" variant="info">
            <span className="visually-hidden">Loading...</span>
        </Spinner>
    </div>);


    if (isError) return (<div
        className="alert-danger"
        style={{textAlign: 'center', color: 'darkred', paddingTop: '20%'}}>
        <h3>
            {error.message}

        </h3>
    </div>);


    const handleAddToCart = (product) => {
        setCartItems((prevItems) => {
            const existingItem = prevItems.find(item => item.id === product.id);
            if (existingItem) {
                return prevItems.map(item =>
                    item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
                );
            } else {
                return [...prevItems, { ...product, quantity: 1 }];
            }
        });
    };

    return (<div className="product-list">
        <ReactQueryDevtools/>

        <div className='product-list'>
        <MDBRow className='g-4'>
            {products.map(product => (
                <MDBCol md='4' key={product.id} style={{maxWidth: '25%'}}>
                    <MDBCard className='h-100'>
                        <MDBCardImage
                            src='https://mdbootstrap.com/img/new/standard/city/041.webp'
                            alt='...'
                            position='top'
                        />
                        <MDBCardBody>
                            <MDBCardTitle>{product.model}</MDBCardTitle>
                            <MDBCardText>
                                This is a longer card with supporting text below as a natural lead-in to additional
                                content. This content is a little bit longer.
                            </MDBCardText>
                            <MDBBtn color="primary" onClick={() => handleAddToCart(product)}>
                                <FontAwesomeIcon icon={faShoppingCart} /> Add to Cart
                            </MDBBtn>
                        </MDBCardBody>
                    </MDBCard>
                </MDBCol>
            ))}
        </MDBRow>
    </div>)


<table className="table table-striped">
    <thead className="table-header">
    <tr>
        <th scope="col">Name</th>
        <th scope="col">Price</th>
        <th scope="col">Quantity</th>
        <th scope="col">Status</th>
        <th scope="col">Action</th>
    </tr>
    </thead>
    <tbody className="table-body">
    {products.map(product => (<tr key={product.id}>
        <td style={{width: '100px'}}>{product.model}</td>
        <td style={{width: '100px'}}>{product.price + ' $'}</td>
        <td style={{width: '100px'}}>{product.qte}</td>
        <td style={{width: '100px'}}>{product.status}</td>
        <td style={{width: '50px'}}>
            <button
                style={{position: 'relative', right: '5px'}}
                onClick={() => handleDeleteButton(product.id)}
                className="btn btn-outline-danger">
                <FontAwesomeIcon icon={faTrash}/>
            </button>

            <button
                onClick={() => handleUpdateButton(product.id)}
                className="btn btn-outline-primary">
                <FontAwesomeIcon icon={faEdit}/>
            </button>
        </td>
    </tr>))}
    </tbody>
</table>
<div>
    <button
        style={{width: '50px'}}
        onClick={() => handleAddButton()}
        className="btn btn-success"
    >
        <FontAwesomeIcon icon={faPlus}/>
    </button>
    <br/><br/><br/><br/><br/><br/><br/>
</div>
</div>
)
;
}

export default Products;
