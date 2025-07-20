export default function Contact() {
  return (
    <>
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Page Contact</h1>
      <p className="text-lg text-gray-600 mb-8">
        Contactez-nous pour discuter de votre projet.
      </p>
      
      <div className="bg-white rounded-lg shadow-sm p-8">
        <h2 className="text-xl font-semibold mb-4">Informations de contact</h2>
        <div className="space-y-3">
          <p className="text-gray-600">
            <strong>Email:</strong> contact@liconodule.com
          </p>
          <p className="text-gray-600">
            <strong>Téléphone:</strong> +33 1 23 45 67 89
          </p>
          <p className="text-gray-600">
            <strong>Adresse:</strong> 123 Rue de la Technologie, 75001 Paris
          </p>
        </div>
      </div>
    </>
  );
} 