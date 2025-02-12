import React, { useState } from "react";
import "../App.css";
import "../css/productList.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import AddShoppingCartIcon from "@mui/icons-material/AddShoppingCart";
import {
  faPlus,
  faTrash,
  faEdit,

} from "@fortawesome/free-solid-svg-icons";
import { deleteProduct, getProducts } from "../axios/App";
import { useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "react-query";
import { ReactQueryDevtools } from "react-query/devtools";
import Spinner from "react-bootstrap/Spinner";
import {
  MDBCard,
  MDBCardImage,
  MDBCardBody,
  MDBCardTitle,
  MDBCardText,
  MDBRow,
  MDBCol,
} from "mdb-react-ui-kit";
import { IconButton } from "@mui/material";

const Products = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [cartItems, setCartItems] = useState([]);

  // Fetch products using useQuery
  const {
    data: products = [],
    error,
    isLoading,
    isError,
  } = useQuery(["products"], getProducts, {
    refetchOnWindowFocus: false, //do not re-send getProducts request to database when I close the window
    refetchOnMount: true, //do not re-send getProducts request when im accessing to another component
    retry: 0, //if there is a fetching error set a number of retrying
    cacheTime: 2000, // 60000ms ==> 60s ==> 1min
    //staleTime: 1000, //set a time to make a request and use the data in cache instead of making request to DB
    refetchInterval: 6000, //set time to refetch data
  });

  // Delete product mutation with useMutation
  const deleteMutation = useMutation((id) => deleteProduct(id), {
    onSuccess: () => {
      queryClient.invalidateQueries("products"); // this make the date of products updated
      console.log("product has been deleted..");
    },

    onError: (err) => {
      console.log("delete product error : ", err);
    },
  });

  const handleDeleteButton = (id) => {
    deleteMutation.mutate(id);
  };

  const handleAddButton = () => {
    navigate("/add-product");
  };

  const handleUpdateButton = (productId) => {
    navigate(`/update-product/${productId}`);
  };

  if (isLoading)
    return (
      <div style={{ marginTop: "12rem", marginLeft: "50%" }}>
        <Spinner animation="border" role="status" variant="info">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
      </div>
    );

  if (isError)
    return (
      <div
        className="alert-danger"
        style={{ textAlign: "center", color: "darkred", paddingTop: "20%" }}
      >
        <h3>{error.message}</h3>
      </div>
    );

  const handleAddToCart = (product) => {
    setCartItems((prevItems) => {
      const existingItem = prevItems.find((item) => item.id === product.id);
      if (existingItem) {
        return prevItems.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      } else {
        return [...prevItems, { ...product, quantity: 1 }];
      }
    });
  };

  return (
    <div className="product-list" style={{ backgroundColor: "#ced2e1" }}>
      <ReactQueryDevtools />

      <div className="product-list">
      <h2 className="list-title">
          <b> Products List</b>
        </h2>
        <br></br>
        <MDBRow className="g-4">
          {products.map((product) => (
            <MDBCol md="4" key={product.id} style={{ maxWidth: "24%" }}>
              <MDBCard className="">
                <MDBCardImage
                  style={{ height: "247px" }}
                  src="https://images.unsplash.com/photo-1710023038502-ba80a70a9f53?q=80&w=1964&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                  alt="..."
                  position="top"
                />
                <MDBCardBody>
                  <MDBCardTitle
                    style={{ position: "relative", bottom: "13px" }}
                  >
                    {product.model}
                  </MDBCardTitle>
                  <MDBCardText>
                    <p style={{ position: "relative", bottom: "17px" }}>
                      {product.features}
                      <br></br>
                      <b>{product.price}$ </b>
                    </p>
                  </MDBCardText>
                  <IconButton
                    style={{
                      position: "relative",
                      bottom: "60px",
                      left: "88%",
                    }}
                  >
                    <AddShoppingCartIcon fontSize="small"></AddShoppingCartIcon>
                  </IconButton>
                </MDBCardBody>
              </MDBCard>
            </MDBCol>
          ))}
        </MDBRow>
      </div>

      <table className="table table-striped">
        <thead className="table-header">
          <tr>
            <th scope="col">Name</th>
            <th scope="col">Price</th>
            <th scope="col">Quantity</th>
            <th scope="col">Status</th>
            <th scope="col">Features</th>
            <th scope="col">Action</th>
          </tr>
        </thead>
        <tbody className="table-body">
          {products.map((product) => (
            <tr key={product.id}>
              <td style={{ width: "100px" }}>{product.model}</td>
              <td style={{ width: "100px" }}>{product.price + " $"}</td>
              <td style={{ width: "100px" }}>{product.qte}</td>
              <td style={{ width: "100px" }}>{product.status}</td>
              <td style={{ width: "100px" }}>{product.features}</td>
              <td style={{ width: "50px" }}>
                <button
                  style={{ position: "relative", right: "5px" }}
                  onClick={() => handleDeleteButton(product.id)}
                  className="btn btn-outline-danger"
                >
                  <FontAwesomeIcon icon={faTrash} />
                </button>

                <button
                  onClick={() => handleUpdateButton(product.id)}
                  className="btn btn-outline-primary"
                >
                  <FontAwesomeIcon icon={faEdit} />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div>
        <button
          style={{ width: "50px" }}
          onClick={() => handleAddButton()}
          className="btn btn-success"
        >
          <FontAwesomeIcon icon={faPlus} />
        </button>
        <br />
        <br />
        <br />
        <br />
        <br />
        <br />
        <br />
      </div>
    </div>
  );
};

export default Products;
