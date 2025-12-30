import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axiosClient from "../axios-client";
import { userStateContext } from "../contexts/ContextProvider";

function SalesForm() {
    const { id } = useParams();
    const part = new URLSearchParams(location.search).get("parts");
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState(false);
    const { setNotification } = userStateContext();

    const [sales, setSales] = useState({
        id: null,
        part_id: 0,
        date: "",
        price: 0,
        quantity: 0,
        notes: "",
        created_at: "",
        part: {
            id: 0,
            sku: "",
            name: "",
            description: "",
            brand: "",
            model: "",
            year: "",
            price: 0,
            image: "",
            quantity: 0,
            box_id: 0,
            box_number: "",
        },
    });

    const [parts, setParts] = useState({
        id: 0,
        sku: "",
        name: "",
        description: "",
        brand: "",
        model: "",
        year: "",
        price: 0,
        image: "",
        quantity: 0,
        box_id: 0,
        box_number: "",
    });

    const getParts = () => {
        setLoading(true);
        axiosClient
            .get(`/parts/${part}`)
            .then(({ data }) => {
                setLoading(false);
                setParts(data.data);
            })
            .catch(() => {
                setLoading(false);
            });
    };

    useEffect(() => {
        getParts();
    }, []);

    // Loading the sales data if the id is present in the URL
    if (id) {
        useEffect(() => {
            setLoading(true);
            axiosClient
                .get(`/sales/${id}&include=part`)
                .then(({ data }) => {
                    setLoading(false);
                    setSales(data.data);
                })
                .catch(() => {
                    setLoading(false);
                });
        }, []);
    }

    // Handle the form input changes, update the state accordingly
    const onSubmit = (ev: React.FormEvent<HTMLFormElement>) => {
        ev.preventDefault();
        if (sales.id) {
            axiosClient
                .put(`/sales/${sales.id}`, sales)
                .then(() => {
                    setNotification("Venda atualizada com sucesso!");
                    navigate("/sales");
                })
                .catch((err) => {
                    const response = err.response;
                    if (response && response.status === 422) {
                        setErrors(response.data.errors);
                    }
                });
        } else {
            // Include the part_id in the sales object before making the POST request
            sales.part_id = parts.id;
            axiosClient
                .post("/sales", sales)
                .then(() => {
                    setNotification("Venda criada com sucesso!");
                    navigate("/sales");
                })
                .catch((err) => {
                    const response = err.response;
                    if (response && response.status === 422) {
                        setErrors(response.data.errors);
                    }
                    if (response && response.status === 400) {
                        setErrors(response.data);
                    }
                });
        }
    };

    return (
        <>
            {sales.id && (
                <h1>
                    Editar Venda: #{sales.id} | {sales.part.name}
                </h1>
            )}
            {!sales.id && <h1>Registrar Venda: {parts.name}</h1>}
            <div className="card animated fadeInDown">
                {errors && (
                    <div className="alert alert-danger">
                        <ul>
                            {Object.entries(errors).map(([key, value]) => (
                                <li key={key}>{value}</li>
                            ))}
                        </ul>
                    </div>
                )}
                {loading && <div className="text-center">Carregando...</div>}
                {!loading && (
                    <form onSubmit={onSubmit}>
                        <div className="form-group">
                            <label htmlFor="date">Data</label>
                            <input
                                type="date"
                                id="date"
                                name="date"
                                placeholder="Data"
                                value={sales.date}
                                onChange={(ev) => {
                                    setSales({
                                        ...sales,
                                        date: ev.target.value,
                                    });
                                }}
                            />

                            <label htmlFor="price">Preço</label>
                            <input
                                type="number"
                                id="price"
                                name="price"
                                placeholder="Preço"
                                value={sales.price}
                                onChange={(ev) => {
                                    setSales({
                                        ...sales,
                                        price: Number(ev.target.value),
                                    });
                                }}
                            />

                            <label htmlFor="quantity">Quantidade</label>
                            <input
                                type="number"
                                id="quantity"
                                name="quantity"
                                placeholder="Quantidade"
                                value={sales.quantity}
                                onChange={(ev) => {
                                    setSales({
                                        ...sales,
                                        quantity: Number(ev.target.value),
                                    });
                                }}
                            />
                        </div>
                        <button type="submit" className="btn btn-primary">
                            Salvar
                        </button>
                    </form>
                )}
            </div>
        </>
    );
}

export default SalesForm;
