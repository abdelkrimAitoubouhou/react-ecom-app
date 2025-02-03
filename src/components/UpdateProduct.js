import React from 'react';
import {Button, Col, Form, Row} from 'react-bootstrap';
import {useForm} from 'react-hook-form';
import {zodResolver} from '@hookform/resolvers/zod';
import {z} from 'zod';
import {getProductById, updateProduct} from '../axios/App';
import {useNavigate} from 'react-router-dom';
import {useMutation, useQuery, useQueryClient} from 'react-query';
import Spinner from "react-bootstrap/Spinner";

// Define the schema
const schema = z.object(
    {
        model: z.string()
            .nonempty({message: "Model is required"})
            .min(5, {message: "Please type at least 5 letters"}),
        price: z.number().min(0, {message: "Price must be a positive number"}),
        qte: z.number().min(0, {message: "Quantity must be a positive number"}),
        status: z.string().nonempty({message: "Status is required"})
    });

const UpdateProduct = ({productId}) => {
    const navigate = useNavigate();
    const queryClient = useQueryClient();

    // Initialize the form with react-hook-form and zod resolver
    const {
        register,
        handleSubmit,
        setValue,
        setError,
        formState: {
            errors,
            isSubmitting
        }

    } = useForm({
        resolver: zodResolver(schema),
    });

    // Fetch product data and set form values
    const {
        error,
        isLoading,
        isError
    } = useQuery(
        ['productUpdated', productId],
        () => getProductById(productId),
        {
            //cacheTime: 60000,
            //staleTime: 30000,
            onSuccess: (productUpdated) => {
                setValue('model', productUpdated.data.model);
                setValue('price', productUpdated.data.price);
                setValue('qte', productUpdated.data.qte);
                setValue('status', productUpdated.data.status);
            },
            onError: (error) => console.error("Error fetching product: ", error)
        }
    );

    // Create update mutation
    const updateMutation = useMutation(
        updatedProduct => updateProduct(productId, updatedProduct), {
            onSuccess: () => {
                queryClient.invalidateQueries('products');
                console.log("Product updated successfully");
                navigate("/products");
            },
            onError: (error) => {
                console.log("Update product error: ", error);
            }
        }
    );

    const onSubmit = async (data) => {
        try {
            await updateMutation.mutateAsync(data);
        } catch (error) {
            setError("root", {message: "Failed to update product"});
        }
    };


    if (isError) {
        return <div>Error: {error.message}</div>;
    }

    if (isLoading) {
        return (
            <div style={{marginTop: '12rem', marginLeft: '50%'}}>
                <Spinner animation="border" role="status" variant="info">
                    <span className="visually-hidden">Loading...</span>
                </Spinner>
            </div>
        );
    }

    return (
        <Form className="form-update-product"
              style={{width: '70%', marginTop: '3%', marginLeft: '15%'}}
              onSubmit={handleSubmit(onSubmit)}>
            <Row className="mb-3">
                <Form.Group as={Col} controlId="formGridModel">
                    <Form.Label>Product Name</Form.Label>
                    <Form.Control
                        type="text"
                        placeholder="Enter product's name"
                        {...register("model")}
                    />
                    {errors.model && <div className="text-red-500">{errors.model.message}</div>}
                </Form.Group>

                <Form.Group as={Col} controlId="formGridPrice">
                    <Form.Label>Price</Form.Label>
                    <Form.Control
                        type="number"
                        placeholder="Enter product's price"
                        {...register("price", {valueAsNumber: true})}
                    />
                    {errors.price && <div className="text-red-500">{errors.price.message}</div>}
                </Form.Group>
            </Row>

            <Form.Group className="mb-3" controlId="formGridQuantity">
                <Form.Label>Quantity</Form.Label>
                <Form.Control
                    type="number"
                    placeholder="Enter product's quantity"
                    {...register("qte", {valueAsNumber: true})}
                />
                {errors.qte && <div className="text-red-500">{errors.qte.message}</div>}
            </Form.Group>

            <Form.Group className="mb-3" controlId="formGridStatus">
                <Form.Label>Status</Form.Label>
                <Form.Control
                    type="text"
                    placeholder="Update product's status"
                    {...register("status")}
                />
                {errors.status && <div className="text-red-500">{errors.status.message}</div>}
            </Form.Group>

            <Button variant="primary" type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Updating..." : "Update Product"}
            </Button>
            {errors.root && <div className="text-red-500">{errors.root.message}</div>}
        </Form>
    );
}

export default UpdateProduct;
