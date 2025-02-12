import React from "react";
import { Button, Form } from "react-bootstrap";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { addProduct } from "../axios/App";
import { useMutation, useQueryClient } from "react-query";
import "../css/addProduct.css";
import InputGroup from "react-bootstrap/InputGroup";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";

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

const AddProduct = () => {
  const queryClient = useQueryClient();

  // Initialize the form with react-hook-form and zod resolver
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(schema),
  });

  const addMutation = useMutation((newProduct) => addProduct(newProduct), {
    onSuccess: () => {
      queryClient.invalidateQueries("products");
      console.log("Product has been saved successfully");
    },
    onError: (error) => {
      console.log("Error saving this product: ", error);
    },
  });

  const onSubmit = async (data) => {
    try {
      await addMutation.mutateAsync(data);
      data.model = "";
      data.price = "";
      data.qte = "";
      data.features = "";
      console.log(data);
    } catch (error) {
      setError("root", { message: "Failed to add product" });
    }
  };

  return (
    <div className="form-container">
      <Form
        className="form-add-product"
        noValidate
        onSubmit={handleSubmit(onSubmit)}
      >
        <h2 className="add-title">
          <b>Add Products</b>
        </h2>
        <br></br>
        <br></br>

        <Row className="mb-3 addRow">
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
                placeholder="qte"
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
        <Row className="mb-3 addRow">
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
        <Button variant="success" type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Adding..." : "Add"}
        </Button>
      </Form>
    </div>
  );
};

export default AddProduct;
