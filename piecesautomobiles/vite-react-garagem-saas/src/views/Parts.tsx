import { useEffect, useState } from "react";
import axiosClient from "../axios-client";
import { Link } from "react-router-dom";
import { userStateContext } from "../contexts/ContextProvider";

interface Parts {
    id: number;
    box_id: number;
    box_number: number;
    quantity: number;
    number: number;
    model: string;
    brand: string;
    name: string;
    year: string;
    description: string;
    created_at: string;
}

function Parts() {
    const [parts, setParts] = useState<Parts[]>([]);
    const [loading, setLoading] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const { setNotification } = userStateContext();
    const [searchQuery, setSearchQuery] = useState("");

    useEffect(() => {
        getParts(currentPage);
    }, [currentPage, searchQuery.length >= 2]); // Fetch data when the currentPage changes or the searchQuery changes

    const onDelete = (p: Parts) => {
        if (!window.confirm("Deseja realmente excluir?")) {
            return;
        }
        axiosClient.delete(`/parts/${p.id}`).then(() => {
            setNotification("Peça excluída com sucesso!");
            // Update the list of parts after deleting
            getParts(currentPage); // Refetch data for the current page after deletion
        });
    };

    const getParts = (page: number) => {
        setLoading(true);
        axiosClient
            .get(`/parts?page=${page}&search=${searchQuery}`)
            .then(({ data }) => {
                setLoading(false);
                setParts(data.data);
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
                <h1>Peças</h1>
                <Link to="/parts/create" className="btn-add">
                    Adicionar
                </Link>
            </div>
            <div
                style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    borderRadius: "10px",
                    marginTop: "10px",
                }}
                className="search"
            >
                <input
                    type="text"
                    placeholder="Procurar peças..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
            </div>
            <div className="card animated fadeInDown">
                <table>
                    <thead>
                        <tr>
                            <th className="hide-on-mobile">Id</th>
                            <th className="hide-on-mobile">Marca</th>
                            <th>Modelo</th>
                            <th>Ano</th>
                            <th>Nome</th>
                            <th>Caixa</th>
                            <th>Quantidade</th>
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
                            {parts
                                .filter(
                                    (p) =>
                                        p.brand
                                            .toLowerCase()
                                            .includes(
                                                searchQuery.toLowerCase()
                                            ) ||
                                        p.model
                                            .toLowerCase()
                                            .includes(
                                                searchQuery.toLowerCase()
                                            ) ||
                                        p.name
                                            .toLowerCase()
                                            .includes(
                                                searchQuery.toLowerCase()
                                            ) ||
                                        p.year
                                            .toLowerCase()
                                            .includes(searchQuery.toLowerCase())
                                )
                                .map((p) => (
                                    <tr key={p.id}>
                                        {" "}
                                        {/* Add a unique key */}
                                        <td className="hide-on-mobile">
                                            {p.id}
                                        </td>
                                        <td className="hide-on-mobile">
                                            {p.brand}
                                        </td>
                                        <td>{p.model}</td>
                                        <td>{p.year}</td>
                                        <td>{p.name}</td>
                                        <td>{p.box_number}</td>
                                        <td>{p.quantity}</td>
                                        <td className="hide-on-mobile">
                                            {p.created_at}
                                        </td>
                                        <td className="hide-on-mobile">
                                            {p.quantity > 0 && (
                                                <Link
                                                    to={`/sales/create?parts=${p.id}`}
                                                    className="btn-add"
                                                >
                                                    Vender
                                                </Link>
                                            )}
                                            &nbsp;
                                            <Link
                                                to={`/parts/${p.id}/edit`}
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

export default Parts;
