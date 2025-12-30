import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axiosClient from "../axios-client";
import { userStateContext } from "../contexts/ContextProvider";

interface Boxes {
    id: number;
    model: string;
    brand: string;
    name: string;
    description: string;
    created_at: string;
}

function PartsForm() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState(false);
    const { setNotification } = userStateContext();
    const listMake = [
        "Audi",
        "BMW",
        "Chevrolet",
        "Chrysler",
        "Citroën",
        "Fiat",
        "Ford",
        "Honda",
        "Hyundai",
        "JAC",
        "Jeep",
        "Kia",
        "Land Rover",
        "Lexus",
        "Mercedes-Benz",
        "Mitsubishi",
        "Nissan",
        "Peugeot",
        "Porsche",
        "Renault",
        "Subaru",
        "Suzuki",
        "Toyota",
        "Volkswagen",
        "Volvo",
    ];

    const [boxes, setBoxes] = useState<Boxes[]>([]);
    useEffect(() => {
        getBoxes();
    }, []);

    const getBoxes = () => {
        axiosClient
            .get(`/boxes`)
            .then(({ data }) => {
                setLoading(false);
                setBoxes(data.data);
            })
            .catch(() => {
                setLoading(false);
            });
    };

    const listBoxes = boxes.map((box) => (
        <option key={box.id} value={box.id}>
            {box.name}
        </option>
    ));

    const [parts, setPart] = useState({
        id: null,
        box_id: null, // Initialize box_id as null
        sku: "",
        name: "",
        description: "",
        brand: "",
        model: "",
        year: "",
        price: "",
        image: "",
        quantity: "",
    });

    const handleInputChange = (
        ev: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
    ) => {
        const { name, value } = ev.target;
        setPart((prevParts: any) => ({
            ...prevParts,
            [name]: value,
        }));
    };

    // Loading the parts data if the id is present in the URL
    if (id) {
        useEffect(() => {
            setLoading(true);
            axiosClient
                .get(`/parts/${id}`)
                .then(({ data }) => {
                    setLoading(false);
                    setPart(data.data);
                })
                .catch(() => {
                    setLoading(false);
                });
        }, []);
    }

    // Handle the form input changes, update the state accordingly
    const onSubmit = (ev: React.FormEvent<HTMLFormElement>) => {
        ev.preventDefault();
        if (parts.id) {
            axiosClient
                .put(`/parts/${parts.id}`, parts)
                .then(() => {
                    setNotification("Peça atualizada com sucesso!");
                    navigate("/parts");
                })
                .catch((err) => {
                    const response = err.response;
                    if (response && response.status === 422) {
                        setErrors(response.data.errors);
                    }
                });
        } else {
            axiosClient
                .post("/parts", parts)
                .then(() => {
                    setNotification("Peça criada com sucesso!");
                    navigate("/parts");
                })
                .catch((err) => {
                    const response = err.response;
                    if (response && response.status === 422) {
                        setErrors(response.data.errors);
                    }
                });
        }
    };

    return (
        <>
            {parts.id && <h1>Editar Peça: {parts.name}</h1>}
            {!parts.id && <h1>Nova Peça</h1>}
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
                            <label htmlFor="sku">Caixa</label>
                            <select
                                className="form-control"
                                name="box_id"
                                value={parts.box_id || ""}
                                onChange={handleInputChange}
                            >
                                <option value="">Selecione uma caixa</option>
                                {listBoxes}
                            </select>

                            <label htmlFor="sku">SKU</label>
                            <input
                                type="text"
                                id="sku"
                                name="sku"
                                placeholder="SKU"
                                value={parts.sku}
                                onChange={(ev) => {
                                    setPart({
                                        ...parts,
                                        sku: ev.target.value,
                                    });
                                }}
                            />

                            <label htmlFor="nome">Nome</label>
                            <input
                                type="text"
                                id="nome"
                                name="nome"
                                placeholder="Nome"
                                value={parts.name}
                                onChange={(ev) => {
                                    setPart({
                                        ...parts,
                                        name: ev.target.value,
                                    });
                                }}
                            />

                            <label htmlFor="description">Descrição</label>
                            <input
                                type="text"
                                id="description"
                                name="description"
                                placeholder="Descrição"
                                value={parts.description}
                                onChange={(ev) => {
                                    setPart({
                                        ...parts,
                                        description: ev.target.value,
                                    });
                                }}
                            />

                            <label htmlFor="brand">Fabricante</label>
                            <select
                                className="form-control"
                                id="brand"
                                name="brand"
                                value={parts.brand}
                                onChange={(ev) => {
                                    setPart({
                                        ...parts,
                                        brand: ev.target.value,
                                    });
                                }}
                            >
                                <option value="">Selecione a Fabricante</option>
                                {listMake.map((make) => (
                                    <option key={make} value={make}>
                                        {make}
                                    </option>
                                ))}
                            </select>

                            <label htmlFor="model">Modelo</label>
                            <input
                                type="text"
                                id="model"
                                name="model"
                                placeholder="model"
                                value={parts.model}
                                onChange={(ev) => {
                                    setPart({
                                        ...parts,
                                        model: ev.target.value,
                                    });
                                }}
                            />

                            <label htmlFor="year">Ano</label>
                            <input
                                type="text"
                                id="year"
                                name="year"
                                placeholder="year"
                                value={parts.year}
                                onChange={(ev) => {
                                    setPart({
                                        ...parts,
                                        year: ev.target.value,
                                    });
                                }}
                            />

                            <label htmlFor="price">Preço</label>
                            <input
                                type="text"
                                id="price"
                                name="price"
                                placeholder="price"
                                value={parts.price}
                                onChange={(ev) => {
                                    setPart({
                                        ...parts,
                                        price: ev.target.value,
                                    });
                                }}
                            />

                            <label htmlFor="image">Imagem</label>
                            <input
                                type="text"
                                id="image"
                                name="image"
                                placeholder="image"
                                value={parts.image}
                                onChange={(ev) => {
                                    setPart({
                                        ...parts,
                                        image: ev.target.value,
                                    });
                                }}
                            />

                            <label htmlFor="quantity">Quantidade</label>
                            <input
                                type="text"
                                id="quantity"
                                name="quantity"
                                placeholder="quantity"
                                value={parts.quantity}
                                onChange={(ev) => {
                                    setPart({
                                        ...parts,
                                        quantity: ev.target.value,
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

export default PartsForm;
