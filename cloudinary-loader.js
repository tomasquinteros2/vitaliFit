export default function cloudinaryLoader({ src, width, quality }) {
  const cloudName = 'f399qaca'; // TODO: Configurar con la cuenta de Cloudinary
  const params = ['f_auto', 'c_limit', `w_${width}`, `q_${quality || 'auto'}`];

  // Intercepta la URL pública de Firebase Storage y la pasa por Cloudinary
  return `https://res.cloudinary.com/${cloudName}/image/fetch/${params.join(',')}/${src}`;
}
