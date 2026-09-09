import { useContactForm } from '../hooks/useContactForm';

export default function Contact() {
  // Extrae toda la lógica de nuestro custom hook
  const { formData, errors, isSuccess, handleChange, handleSubmit } = useContactForm();

  return (
    <div style={{ maxWidth: '600px', margin: '0 auto', padding: '2rem' }}>
      <h1>📧 Contacto</h1>
      <p>¿Tienes alguna pregunta? Contáctanos.</p>

      {/* Si es éxito, muestra el mensaje. Si no, mostramos el formulario */}
      {isSuccess ? (
        <div style={{ background: 'green', color: 'white', padding: '1rem', borderRadius: '5px' }}>
          ¡Mensaje enviado con éxito! Pronto nos podremos en contacto contigo. 
        </div>
      ) : (
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          
          <div>
            <label htmlFor="nombre" style={{ display: 'block' }}>Nombre:</label>
            <input 
              type="text" 
              id="nombre" 
              name="nombre" 
              value={formData.nombre} 
              onChange={handleChange}
              style={{ width: '100%', padding: '0.5rem' }}
            />
            {/* Si existe un error para 'nombre', lo muestra */}
            {errors.nombre && <span style={{ color: 'red', fontSize: '0.875rem' }}>{errors.nombre}</span>}
          </div>

          <div>
            <label htmlFor="email" style={{ display: 'block' }}>Email:</label>
            <input 
              type="text" 
              id="email" 
              name="email" 
              value={formData.email} 
              onChange={handleChange}
              style={{ width: '100%', padding: '0.5rem' }}
            />
            {errors.email && <span style={{ color: 'red', fontSize: '0.875rem' }}>{errors.email}</span>}
          </div>

          <div>
            <label htmlFor="mensaje" style={{ display: 'block' }}>Mensaje:</label>
            <textarea 
              id="mensaje" 
              name="mensaje" 
              value={formData.mensaje} 
              onChange={handleChange}
              rows="4"
              style={{ width: '100%', padding: '0.5rem' }}
            />
            {errors.mensaje && <span style={{ color: 'red', fontSize: '0.875rem' }}>{errors.mensaje}</span>}
          </div>

          <button type="submit" style={{ padding: '0.75rem', background: '#09f', color: 'white', border: 'none', cursor: 'pointer' }}>
            Enviar mensaje
          </button>
        </form>
      )}
    </div>
  );
}