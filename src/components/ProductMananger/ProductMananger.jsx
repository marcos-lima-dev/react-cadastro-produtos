import React, { useState } from "react";
import { PlusCircle, X, Pencil, Save, Upload, Trash } from "lucide-react";

// Mock inicial de produtos
const initialProducts = [
    {
        id: 1,
        name: "Smartphone XYZ",
        price: 999.99,
        imageUrl: "/api/placeholder/200/200",
    },
];

const Notification = ({ message, type, onClose }) => (
    <div
        className={`fixed top-4 right-4 w-72 p-4 rounded-lg shadow-lg ${
            type === "error"
                ? "bg-red-100 text-red-800"
                : "bg-green-100 text-green-800"
        }`}
    >
        <div className="flex justify-between items-center">
            <p>{message}</p>
            <button
                onClick={onClose}
                className="text-gray-500 hover:text-gray-700"
            >
                <X size={16} />
            </button>
        </div>
    </div>
);

const Modal = ({ isOpen, onClose, title, children }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg w-full max-w-md">
                <div className="flex justify-between items-center p-4 border-b">
                    <h2 className="text-xl font-semibold">{title}</h2>
                    <button
                        onClick={onClose}
                        className="text-gray-500 hover:text-gray-700"
                    >
                        <X size={20} />
                    </button>
                </div>
                <div className="p-4">{children}</div>
            </div>
        </div>
    );
};

const ProductManager = () => {
    const [products, setProducts] = useState(initialProducts);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingProduct, setEditingProduct] = useState(null);
    const [notification, setNotification] = useState(null);

    const [newProduct, setNewProduct] = useState({
        name: "",
        price: "",
        imageUrl: "/api/placeholder/200/200",
    });

    const showNotification = (message, type = "success") => {
        setNotification({ message, type });
        setTimeout(() => setNotification(null), 3000);
    };

    const handleInputChange = (e) => {
        const { name, value, files } = e.target;
        if (name === "image" && files && files[0]) {
            setNewProduct((prev) => ({
                ...prev,
                imageUrl: URL.createObjectURL(files[0]),
            }));
        } else {
            setNewProduct((prev) => ({
                ...prev,
                [name]: value,
            }));
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!newProduct.name || !newProduct.price) {
            showNotification("Por favor, preencha todos os campos", "error");
            return;
        }

        const productToAdd = {
            ...newProduct,
            id: products.length + 1,
            price: parseFloat(newProduct.price),
        };

        setProducts((prev) => [...prev, productToAdd]);
        setNewProduct({
            name: "",
            price: "",
            imageUrl: "/api/placeholder/200/200",
        });
        showNotification("Produto adicionado com sucesso!");
    };

    const startEdit = (product) => {
        setEditingProduct({ ...product });
        setIsModalOpen(true);
    };

    const handleEdit = (e) => {
        e.preventDefault();
        if (!editingProduct.name || !editingProduct.price) {
            showNotification("Por favor, preencha todos os campos", "error");
            return;
        }
        setProducts((prev) =>
            prev.map((p) => (p.id === editingProduct.id ? editingProduct : p))
        );
        setIsModalOpen(false);
        showNotification("Produto atualizado com sucesso!");
    };

    const handleDelete = (id) => {
        setProducts((prev) => prev.filter((p) => p.id !== id));
        showNotification("Produto excluído com sucesso!");
    };

    const handleEditImageChange = (e) => {
        const files = e.target.files;
        if (files && files[0]) {
            const newImageUrl = URL.createObjectURL(files[0]);
            setEditingProduct((prev) => ({
                ...prev,
                imageUrl: newImageUrl,
            }));
        }
    };

    return (
        <div className="min-h-screen bg-[#000814] p-8">
            {notification && (
                <Notification
                    message={notification.message}
                    type={notification.type}
                    onClose={() => setNotification(null)}
                />
            )}

            <div className="max-w-6xl mx-auto space-y-8">
                {/* Formulário de Cadastro */}
                <div className="bg-white rounded-lg shadow-md">
                    <div className="p-6">
                        <h2 className="text-2xl font-bold mb-6">
                            Cadastrar Novo Produto
                        </h2>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium mb-1">
                                        Nome do Produto
                                    </label>
                                    <input
                                        type="text"
                                        name="name"
                                        value={newProduct.name}
                                        onChange={handleInputChange}
                                        className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        placeholder="Digite o nome do produto"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-1">
                                        Preço
                                    </label>
                                    <input
                                        type="number"
                                        name="price"
                                        value={newProduct.price}
                                        onChange={handleInputChange}
                                        className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        placeholder="0.00"
                                        step="0.01"
                                    />
                                </div>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium mb-1">
                                        Imagem do Produto
                                    </label>
                                    <div className="flex items-center">
                                        <label
                                            htmlFor="image"
                                            className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 cursor-pointer"
                                        >
                                            <Upload size={20} />
                                            Carregar Imagem
                                        </label>
                                        <input
                                            type="file"
                                            id="image"
                                            name="image"
                                            accept="image/*"
                                            className="hidden"
                                            onChange={handleInputChange}
                                        />
                                    </div>
                                    {newProduct.imageUrl !==
                                        "/api/placeholder/200/200" && (
                                        <img
                                            src={newProduct.imageUrl}
                                            alt="Product"
                                            className="mt-2 w-32 h-32 object-cover rounded-md"
                                        />
                                    )}
                                </div>
                            </div>
                            <div className="flex justify-end">
                                <button
                                    type="submit"
                                    className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
                                >
                                    <PlusCircle size={20} />
                                    Cadastrar Produto
                                </button>
                            </div>
                        </form>
                    </div>
                </div>

                {/* Lista de Produtos */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {products.map((product) => (
                        <div
                            key={product.id}
                            className="bg-white rounded-lg shadow-md overflow-hidden"
                        >
                            <div className="p-4">
                                <img
                                    src={product.imageUrl}
                                    alt={product.name}
                                    className="w-full h-48 object-cover rounded-md mb-4"
                                />
                                <h3 className="font-semibold text-lg">
                                    {product.name}
                                </h3>
                                <p className="text-green-600 font-medium">
                                    R$ {product.price.toFixed(2)}
                                </p>
                                <div className="flex justify-between items-center mt-4">
                                    <button
                                        onClick={() => startEdit(product)}
                                        className="flex items-center gap-2 text-blue-600 hover:text-blue-800 transition-colors"
                                    >
                                        <Pencil size={16} />
                                        Editar
                                    </button>
                                    <button
                                        onClick={() => handleDelete(product.id)}
                                        className="flex items-center gap-2 text-red-600 hover:text-red-800 transition-colors"
                                    >
                                        <Trash size={16} />
                                        Excluir
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Modal de Edição */}
                <Modal
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                    title="Editar Produto"
                >
                    {editingProduct && (
                        <form onSubmit={handleEdit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium mb-1">
                                    Nome do Produto
                                </label>
                                <input
                                    type="text"
                                    name="name"
                                    value={editingProduct.name}
                                    onChange={(e) =>
                                        setEditingProduct({
                                            ...editingProduct,
                                            name: e.target.value,
                                        })
                                    }
                                    className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">
                                    Preço
                                </label>
                                <input
                                    type="number"
                                    name="price"
                                    value={editingProduct.price}
                                    onChange={(e) =>
                                        setEditingProduct({
                                            ...editingProduct,
                                            price:
                                                parseFloat(e.target.value) || 0,
                                        })
                                    }
                                    className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    step="0.01"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">
                                    Imagem do Produto
                                </label>
                                <div className="flex items-center">
                                    <label
                                        htmlFor="edit-image"
                                        className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 cursor-pointer"
                                    >
                                        <Upload size={20} />
                                        Carregar Imagem
                                    </label>
                                    <input
                                        type="file"
                                        id="edit-image"
                                        name="edit-image"
                                        accept="image/*"
                                        className="hidden"
                                        onChange={handleEditImageChange}
                                    />
                                </div>
                                <img
                                    src={editingProduct.imageUrl}
                                    alt="Product"
                                    className="mt-2 w-32 h-32 object-cover rounded-md"
                                />
                            </div>
                            <div className="flex justify-between gap-2 mt-6">
                                <button
                                    type="button"
                                    onClick={() => setIsModalOpen(false)}
                                    className="flex items-center gap-2 bg-gray-200 px-4 py-2 rounded-md hover:bg-gray-300 transition-colors"
                                >
                                    <X size={20} />
                                    Cancelar
                                </button>
                                <button
                                    type="submit"
                                    className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
                                >
                                    <Save size={20} />
                                    Salvar
                                </button>
                            </div>
                        </form>
                    )}
                </Modal>
            </div>
        </div>
    );
};

export default ProductManager;
