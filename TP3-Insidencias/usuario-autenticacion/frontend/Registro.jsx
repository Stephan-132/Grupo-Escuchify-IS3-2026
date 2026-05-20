import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";

const Registro = () => {
    const [formData, setFormData] = useState({
        email: "",
        password: "",
        nombre: "",
        apellido: ""
    });
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const validateClient = () => {
        if (!formData.email || !formData.password || !formData.nombre || !formData.apellido) {
            setError("Todos los campos son requeridos");
            return false;
        }
        if (formData.password.length < 8) {
            setError("La contraseña debe tener mínimo 8 caracteres");
            return false;
        }
        return true;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

        if (!validateClient()) return;

        try {
            await api.post("/api/v1/usuarios/registro", formData);
            navigate("/login");
        } catch (err) {
            setError(err.response?.data?.message || "Error al registrar usuario");
        }
    };

    return (
        <div className="registro-container">
            <h2>Registro de Usuario</h2>
            {error && <div className="error-message">{error}</div>}
            <form onSubmit={handleSubmit}>
                <input name="nombre" placeholder="Nombre" value={formData.nombre} onChange={handleChange} />
                <input name="apellido" placeholder="Apellido" value={formData.apellido} onChange={handleChange} />
                <input name="email" type="email" placeholder="Email" value={formData.email} onChange={handleChange} />
                <input name="password" type="password" placeholder="Contraseña" value={formData.password} onChange={handleChange} />
                <button type="submit">Registrarse</button>
            </form>
            <p>¿Ya tienes cuenta? <a href="/login">Inicia sesión</a></p>
        </div>
    );
};

export default Registro;
