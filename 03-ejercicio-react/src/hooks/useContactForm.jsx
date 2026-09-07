import { useState } from 'react';

export function useContactForm() {
  // 1. Los tres estados principales
  const [formData, setFormData] = useState({ nombre: '', email: '', mensaje: '' });
  const [errors, setErrors] = useState({});
  const [isSuccess, setIsSuccess] = useState(false);

  // 2. Handler para cambios en los inputs
  const handleChange = (event) => {
    const { name, value } = event.target;
    
    // Actualiza el valor del campo
    setFormData({ ...formData, [name]: value });
    
    // Si este campo tenía un error, lo limpia al escribir
    if (errors[name]) {
      setErrors({ ...errors, [name]: '' });
    }
  };

  // 3. Handler para el envío del formulario
  const handleSubmit = (event) => {
    event.preventDefault(); // Evita que la página se recargue
    
    const newErrors = {};

    // Validaciones básicas
    if (!formData.nombre.trim()) {
      newErrors.nombre = 'El nombre es obligatorio.';
    }
    
    if (!formData.email.trim()) {
      newErrors.email = 'El correo electrónico es obligatorio.';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Por favor, introduce un correo válido.';
    }
    
    if (!formData.mensaje.trim()) {
      newErrors.mensaje = 'El mensaje no puede estar vacío.';
    }

    // Si hay errores (el objeto no está vacío), los guarda y para aquí
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    // Si llega aquí, todo es válido. 
    // Muestra éxito, limpia formulario y limpia posibles errores previos.
    setIsSuccess(true);
    setFormData({ nombre: '', email: '', mensaje: '' });
    setErrors({});
  };

  return {
    formData,
    errors,
    isSuccess,
    handleChange,
    handleSubmit
  };
}