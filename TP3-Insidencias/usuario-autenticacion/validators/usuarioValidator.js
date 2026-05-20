const validateRegistro = (req, res, next) => {
    const { email, password, nombre, apellido } = req.body;

    if (!email || !password || !nombre || !apellido) {
        return res.status(400).json({ error: "ERROR_VALIDACION", message: "Todos los campos son requeridos" });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        return res.status(400).json({ error: "ERROR_VALIDACION", message: "Formato de email inválido" });
    }

    if (password.length < 8) {
        return res.status(400).json({ error: "CONTRASEÑA_INVALIDA", message: "La contraseña debe tener mínimo 8 caracteres" });
    }

    if (!/[A-Z]/.test(password)) {
        return res.status(400).json({ error: "CONTRASEÑA_INVALIDA", message: "La contraseña debe contener al menos una mayúscula" });
    }

    if (!/[a-z]/.test(password)) {
        return res.status(400).json({ error: "CONTRASEÑA_INVALIDA", message: "La contraseña debe contener al menos una minúscula" });
    }

    if (!/[0-9]/.test(password)) {
        return res.status(400).json({ error: "CONTRASEÑA_INVALIDA", message: "La contraseña debe contener al menos un número" });
    }

    next();
};

const validateLogin = (req, res, next) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ error: "ERROR_VALIDACION", message: "Email y contraseña son requeridos" });
    }

    next();
};

const validateEdicion = (req, res, next) => {
    const { nombre, apellido, password } = req.body;

    if (!nombre || !apellido) {
        return res.status(400).json({ error: "ERROR_VALIDACION", message: "Nombre y apellido son requeridos" });
    }

    if (password) {
        if (password.length < 8) {
            return res.status(400).json({ error: "CONTRASEÑA_INVALIDA", message: "La contraseña debe tener mínimo 8 caracteres" });
        }
        if (!/[A-Z]/.test(password)) {
            return res.status(400).json({ error: "CONTRASEÑA_INVALIDA", message: "La contraseña debe contener al menos una mayúscula" });
        }
        if (!/[a-z]/.test(password)) {
            return res.status(400).json({ error: "CONTRASEÑA_INVALIDA", message: "La contraseña debe contener al menos una minúscula" });
        }
        if (!/[0-9]/.test(password)) {
            return res.status(400).json({ error: "CONTRASEÑA_INVALIDA", message: "La contraseña debe contener al menos un número" });
        }
    }

    next();
};

module.exports = { validateRegistro, validateLogin, validateEdicion };
