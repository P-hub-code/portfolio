import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axiosClient from "../axios-client";
import { userStateContext } from "../contexts/ContextProvider";

function PartsForm() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState(false);
    const { setNotification } = userStateContext();

    const [boxes, setBoxes] = useState({
        id: null,
        reference: "",
        name: "",
        number: "",
        description: "",
        shelf_id: "",
    });

    // Loading the boxes data if the id is present in the URL
    if (id) {
        useEffect(() => {
            setLoading(true);
            axiosClient
                .get(`/boxes/${id}`)
                .then(({ data }) => {
                    setLoading(false);
                    setBoxes(data.data);
                })
                .catch(() => {
                    setLoading(false);
                });
        }, []);
    }

    // Handle the form input changes, update the state accordingly
    const onSubmit = (ev: React.FormEvent<HTMLFormElement>) => {
        ev.preventDefault();
        if (boxes.id) {
            axiosClient
                .put(`/boxes/${boxes.id}`, boxes)
                .then(() => {
                    setNotification("Caixa atualizada com sucesso!");
                    navigate("/boxes");
                })
                .catch((err) => {
                    const response = err.response;
                    if (response && response.status === 422) {
                        setErrors(response.data.errors);
                    }
                });
        } else {
            axiosClient
                .post("/boxes", boxes)
                .then(() => {
                    setNotification("Caixa criada com sucesso!");
                    navigate("/boxes");
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
            {boxes.id && <h1>Editar Caixa: {boxes.name}</h1>}
            {!boxes.id && <h1>Nova Caixa</h1>}
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
                            <label htmlFor="nome">Referencia</label>
                            <input
                                type="text"
                                id="reference"
                                name="reference"
                                placeholder="Referencia"
                                value={boxes.reference}
                                onChange={(ev) => {
                                    setBoxes({
                                        ...boxes,
                                        reference: ev.target.value,
                                    });
                                }}
                            />

                            <label htmlFor="nome">Nome</label>
                            <input
                                type="text"
                                id="nome"
                                name="nome"
                                placeholder="Nome"
                                value={boxes.name}
                                onChange={(ev) => {
                                    setBoxes({
                                        ...boxes,
                                        name: ev.target.value,
                                    });
                                }}
                            />

                            <label htmlFor="nome">Número</label>
                            <input
                                type="text"
                                id="number"
                                name="number"
                                placeholder="Número"
                                value={boxes.number}
                                onChange={(ev) => {
                                    setBoxes({
                                        ...boxes,
                                        number: ev.target.value,
                                    });
                                }}
                            />

                            <label htmlFor="description">Descrição</label>
                            <input
                                type="text"
                                id="description"
                                name="description"
                                placeholder="Descrição"
                                value={boxes.description}
                                onChange={(ev) => {
                                    setBoxes({
                                        ...boxes,
                                        description: ev.target.value,
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
