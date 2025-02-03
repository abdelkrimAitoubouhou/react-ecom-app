import React from 'react';
import {Button, Col, Form, Row} from 'react-bootstrap';
import {useForm} from 'react-hook-form';
import {zodResolver} from '@hookform/resolvers/zod';
import {z} from 'zod';
import {addProduct} from '../axios/App';
import {useMutation, useQueryClient} from 'react-query';

// Define the schema
const schema = z.object({
    model: z.string()
        .nonempty({message: "Model is required"})
        .min(5, {message: "Please type at least 5 letters"}),
    price: z.number().min(0, {message: "Price must be a positive number"}),
    qte: z.number().min(0, {message: "Quantity must be a positive number"}),
});

const AddProduct = () => {
    const queryClient = useQueryClient();

    // Initialize the form with react-hook-form and zod resolver
    const {
        register,
        handleSubmit,
        setError,
        formState: {errors, isSubmitting}
    } = useForm({
        resolver: zodResolver(schema),
    });

    const addMutation = useMutation(
        newProduct => addProduct(newProduct), {
            onSuccess: () => {
                queryClient.invalidateQueries('products');
                console.log("Product has been saved successfully");
            },
            onError: (error) => {
                console.log("Error saving this product: ", error);
            }
        }
    );

    const onSubmit = async (data) => {
        try {
            await addMutation.mutateAsync(data);
        } catch (error) {
            setError("root", {message: "Failed to add product"});
        }
    };

    return (
        <Form className="form-add-product" onSubmit={handleSubmit(onSubmit)}>
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

            <Button variant="success" type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Adding..." : "Add"}
            </Button>
        </Form>
    );
}

export default AddProduct;
