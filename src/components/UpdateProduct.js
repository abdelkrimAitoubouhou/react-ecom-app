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
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";

// Define the schema
const schema = z.object({
  model: z
    .string()
    .nonempty({ message: "Model is required" })
    .min(5, { message: "Please type at least 5 letters" }),
  price: z.number().min(0, { message: "Price must be a positive number" }),
  qte: z.number().min(0, { message: "Quantity must be a positive number" }),
  status: z.string().nonempty({ message: "Status is required" }),
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
      <Form className="form-update" onSubmit={handleSubmit(onSubmit)}>
       
        <Box
          component="form"
          sx={{ "& .MuiTextField-root": { m: 1, width: "25ch" } }}
          noValidate
          autoComplete="off"
        >
          <div>
            <TextField
              helperText="Please Product's name"
              id="demo-helper-text-aligned-no-helper"
              {...register("model")}
            />
            {errors.model && (
              <div className="text-red-500">{errors.model.message}</div>
            )}

            <TextField
              helperText="Please Product's price"
              type="number"
              id="demo-helper-text-aligned-no-helper"
              {...register("price", { valueAsNumber: true })}
            />
            {errors.price && (
              <div className="text-red-500">{errors.price.message}</div>
            )}

            <TextField
              helperText="Please Product's quantity"
              type="number"
              id="demo-helper-text-aligned-no-helper"
              {...register("qte", { valueAsNumber: true })}
            />
            {errors.qte && (
              <div className="text-red-500">{errors.qte.message}</div>
            )}

            <TextField
              helperText="Please Product's status"
              type="text"
              id="demo-helper-text-aligned-no-helper"
              {...register("status")}
            />
            {errors.status && (
              <div className="text-red-500">{errors.status.message}</div>
            )}


            <TextField
              helperText="Please Product's features"
              type="text"
              id="demo-helper-text-aligned-no-helper"
              multiline
              {...register("features")}
            />
            {errors.features && (
              <div className="text-red-500">{errors.features.message}</div>
            )}

          </div>
        </Box>

        <Button variant="primary" type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Updating..." : "Update Product"}
        </Button>
        {errors.root && (
          <div className="text-red-500">{errors.root.message}</div>
        )}
      </Form>
    </>
  );
};

export default UpdateProduct;
