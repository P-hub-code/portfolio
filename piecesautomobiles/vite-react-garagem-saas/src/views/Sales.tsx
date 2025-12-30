import { useEffect, useState } from "react";
import axiosClient from "../axios-client";
import { Link } from "react-router-dom";
import { userStateContext } from "../contexts/ContextProvider";

interface Sale {
    id: number;
    part_id: number;
    date: string;
    price: number;
    quantity: number;
    notes: string;
    created_at: string;
    part: {
        id: number;
        sku: string;
        name: string;
        description: string;
        brand: string;
        model: string;
        year: string;
        price: number;
        image: string;
        quantity: number;
        box_id: number;
        box_number: string;
    };
}

function Sales() {
    const [sales, setSales] = useState<Sale[]>([]);
    const [loading, setLoading] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const { setNotification } = userStateContext();

    useEffect(() => {
        getSales(currentPage);
    }, [currentPage]); // Fetch data when the currentPage changes

    const onDelete = (p: Sale) => {
        if (!window.confirm("Deseja realmente excluir?")) {
            return;
        }

        axiosClient.delete(`/sales/${p.id}`).then(() => {
            setNotification("Registro da venda excluída com sucesso!");
            // Update the list of sales after deleting
            getSales(currentPage); // Refetch data for the current page after deletion
        });
    };

    const getSales = (page: number) => {
        setLoading(true);
        axiosClient
            .get(`/sales?page=${page}&include=part`)
            .then(({ data }) => {
                setLoading(false);
                setSales(data.data);
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
                <h1>Vendas</h1>
            </div>
            <div className="card animated fadeInDown">
                <table>
                    <thead>
                        <tr>
                            <th>Pedido #</th>
                            <th>Marca</th>
                            <th>Peça</th>
                            <th>Vendido em</th>
                            <th>Valor</th>
                            <th>Ações</th>
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
                            {sales.map((p) => (
                                <tr key={p.id}>
                                    {" "}
                                    {/* Add a unique key */}
                                    <td>{p.id}</td>
                                    <td>{p.part.brand}</td>
                                    <td>{p.part.name}</td>
                                    <td>{p.date}</td>
                                    <td>R${p.price}</td>
                                    <td>
                                        <Link
                                            to={`/sales/${p.id}/edit`}
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

export default Sales;
