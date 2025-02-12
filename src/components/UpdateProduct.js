import React from "react";
import "../css/updateProduct.css";
import { Button, Col, Form, Row } from "react-bootstrap";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { getProductById, updateProduct } from "../axios/App";
import { useNavigate } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "react-query";
import Spinner from "react-bootstrap/Spinner";
import InputGroup from "react-bootstrap/InputGroup";

// Define the schema
const schema = z.object({
  model: z
    .string()
    .nonempty({ message: "Product's name is required" })
    .min(5, { message: "Please type at least 5 letters" }),
  price: z
    .string()
    .nonempty({ message: "Price is required" })
    .transform((val) => parseFloat(val))
    .refine((val) => val > 0, { message: "Price must be positive" }),
  qte: z
    .string()
    .nonempty({ message: "Quantity is required" })
    .transform((val) => parseInt(val))
    .refine((val) => val > 0, {
      message: "Quantity must be positive",
    }),
  features: z
    .string()
    .nonempty({ message: "Features are required" })
    .min(5, { message: "Please type at least 5 letters" }),
});

const UpdateProduct = ({ productId }) => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  // Initialize the form with react-hook-form and zod resolver
  const {
    register,
    handleSubmit,
    setValue,
    setError,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(schema),
  });

  // Fetch product data and set form values
  const { error, isLoading, isError } = useQuery(
    ["productUpdated", productId],
    () => getProductById(productId),
    {
      //cacheTime: 60000,
      //staleTime: 30000,
      onSuccess: (productUpdated) => {
        setValue("model", productUpdated.data.model);
        setValue("price", productUpdated.data.price);
        setValue("qte", productUpdated.data.qte);
        setValue("status", productUpdated.data.status);
        setValue("features", productUpdated.data.features);
      },
      onError: (error) => console.error("Error fetching product: ", error),
    }
  );

  // Create update mutation
  const updateMutation = useMutation(
    (updatedProduct) => updateProduct(productId, updatedProduct),
    {
      onSuccess: () => {
        queryClient.invalidateQueries("products");
        console.log("Product updated successfully");
        navigate("/products");
      },
      onError: (error) => {
        console.log("Update product error: ", error);
      },
    }
  );

  const onSubmit = async (data) => {
    try {
      await updateMutation.mutateAsync(data);
    } catch (error) {
      setError("root", { message: "Failed to update product" });
    }
  };

  if (isError) {
    return <div>Error: {error.message}</div>;
  }

  if (isLoading) {
    return (
      <div style={{ marginTop: "12rem", marginLeft: "50%" }}>
        <Spinner animation="border" role="status" variant="info">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
      </div>
    );
  }

  return (
    <>
      <div className="form-container">
        <Form
          className="form-update-product"
          noValidate
          onSubmit={handleSubmit(onSubmit)}
        >
          <h2 className="title">
            <b>Edit Products</b>
          </h2>
          <br></br>
          <br></br>

          <Row className="mb-3 upd-row">
            <Form.Group as={Col} md="4" controlId="validationCustom01">
              <Form.Label>Model</Form.Label>
              <Form.Control
                type="text"
                placeholder=" Product's name"
                {...register("model")}
                isInvalid={!!errors.model}
              />
              <Form.Control.Feedback type="invalid">
                {errors.model?.message}
              </Form.Control.Feedback>
            </Form.Group>
            <Form.Group as={Col} md="4" controlId="">
              <Form.Label>Price</Form.Label>
              <Form.Control
                type="number"
                placeholder=" Product's price"
                {...register("price")}
                isInvalid={!!errors.price}
              />
              <Form.Control.Feedback type="invalid">
                {errors.price?.message}
              </Form.Control.Feedback>
            </Form.Group>
            <Form.Group as={Col} md="4" controlId="">
              <Form.Label>Quantity</Form.Label>
              <InputGroup hasValidation style={{ width: "48%" }}>
                <Form.Control
                  type="number"
                  placeholder=" Product's quantity"
                  aria-describedby="inputGroupPrepend"
                  {...register("qte")}
                  isInvalid={!!errors.qte}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.qte?.message}
                </Form.Control.Feedback>
              </InputGroup>
            </Form.Group>
          </Row>
          <Row className="mb-3">
            <Form.Group as={Col} md="6" controlId="validationCustom03">
              <Form.Label>Features</Form.Label>

              <Form.Control
                type="text"
                placeholder=" Product's features"
                {...register("features")}
                isInvalid={!!errors.features}
              />
              <Form.Control.Feedback type="invalid">
                {errors.features?.message}
              </Form.Control.Feedback>
            </Form.Group>
          </Row>
          <Button variant="primary" type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Updating..." : "Edit"}
          </Button>
          {errors.root && (
            <div className="text-red-500">{errors.root.message}</div>
          )}
        </Form>
      </div>
    </>
  );
};

export default UpdateProduct;
