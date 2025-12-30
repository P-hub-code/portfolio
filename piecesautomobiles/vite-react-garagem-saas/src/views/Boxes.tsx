import { useEffect, useState } from "react";
import axiosClient from "../axios-client";
import { Link } from "react-router-dom";
import { userStateContext } from "../contexts/ContextProvider";

interface Boxes {
    id: number;
    number: number;
    model: string;
    brand: string;
    name: string;
    description: string;
    created_at: string;
}

function Boxes() {
    const [boxes, setBoxes] = useState<Boxes[]>([]);
    const [loading, setLoading] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const { setNotification } = userStateContext();

    useEffect(() => {
        getBoxes(currentPage);
    }, [currentPage]); // Fetch data when the currentPage changes

    const onDelete = (p: Boxes) => {
        if (!window.confirm("Deseja realmente excluir?")) {
            return;
        }

        axiosClient.delete(`/boxes/${p.id}`).then(() => {
            setNotification("Peça excluída com sucesso!");
            // Update the list of boxes after deleting
            getBoxes(currentPage); // Refetch data for the current page after deletion
        });
    };

    const getBoxes = (page: number) => {
        setLoading(true);
        axiosClient
            .get(`/boxes?page=${page}`)
            .then(({ data }) => {
                setLoading(false);
                setBoxes(data.data);
                setTotalPages(data.meta.last_page); // Set the total number of pages from the response
            })
            .catch(() => {
                setLoading(false);
            });
    };

    const nextPage = () => {
        if (currentPage < totalPages) {
            setCurrentPage((prevPage) => prevPage + 1);
        }
    };

    const prevPage = () => {
        if (currentPage > 1) {
            setCurrentPage((prevPage) => prevPage - 1);
        }
    };

    return (
        <div>
            <div
                style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                }}
            >
                <h1>Caixas</h1>
                <Link to="/boxes/create" className="btn-add">
                    Adicionar
                </Link>
            </div>
            <div className="card animated fadeInDown">
                <table>
                    <thead>
                        <tr>
                            <th>Número</th>
                            <th>Nome</th>
                            <th className="hide-on-mobile">Descrição</th>
                            <th className="hide-on-mobile">Criado em</th>
                            <th className="hide-on-mobile">Ações</th>
                        </tr>
                    </thead>
                    {loading && (
                        <tbody>
                            <tr>
                                <td colSpan={7} className="text-center">
                                    Carregando...
                                </td>
                            </tr>
                        </tbody>
                    )}
                    {!loading && (
                        <tbody>
                            {boxes.map((p) => (
                                <tr key={p.id}>
                                    {" "}
                                    {/* Add a unique key */}
                                    <td>{p.number}</td>
                                    <td>{p.name}</td>
                                    <td className="hide-on-mobile">
                                        {p.description}
                                    </td>
                                    <td className="hide-on-mobile">
                                        {p.created_at}
                                    </td>
                                    <td className="hide-on-mobile">
                                        <Link
                                            to={`/boxes/${p.id}/edit`}
                                            className="btn-edit"
                                        >
                                            Editar
                                        </Link>
                                        &nbsp;
                                        <button
                                            onClick={() => onDelete(p)}
                                            className="btn-delete"
                                        >
                                            Excluir
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    )}
                </table>
            </div>
            <div>
                <button onClick={prevPage} disabled={currentPage === 1}>
                    Previous
                </button>
                <button
                    onClick={nextPage}
                    disabled={currentPage === totalPages}
                >
                    Next
                </button>
            </div>
        </div>
    );
}

export default Boxes;
