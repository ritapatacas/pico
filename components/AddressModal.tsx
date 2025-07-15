import { useState } from "react";
import Modal from "@/components/ui/Modal";

interface AddressModalProps {
  open: boolean;
  onClose: () => void;
  onSave: (data: {
    address: string;
    postal_code: string;
    city: string;
    is_primary: boolean;
  }) => Promise<void> | void;
  initialData?: {
    address?: string;
    postal_code?: string;
    city?: string;
    is_primary?: boolean;
  };
}

export default function AddressModal({ open, onClose, onSave, initialData }: AddressModalProps) {
  const [address, setAddress] = useState(initialData?.address || "");
  const [postalCode, setPostalCode] = useState(initialData?.postal_code || "");
  const [city, setCity] = useState(initialData?.city || "");
  const [isPrimary, setIsPrimary] = useState(initialData?.is_primary || false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await onSave({
        address,
        postal_code: postalCode,
        city,
        is_primary: isPrimary,
      });
      onClose();
    } catch (err: any) {
      setError(err.message || "Erro ao guardar morada");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal open={open} onClose={onClose}>
      <form onSubmit={handleSubmit} className="space-y-4 w-full max-w-md mx-auto">
        <h2 className="text-xl font-bold mb-2">Adicionar Morada</h2>
        <label className="block">
          <span className="text-gray-700 font-medium">Morada</span>
          <input
            type="text"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500"
            value={address}
            onChange={e => setAddress(e.target.value)}
            required
          />
        </label>
        <label className="block">
          <span className="text-gray-700 font-medium">Código Postal</span>
          <input
            type="text"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500"
            value={postalCode}
            onChange={e => setPostalCode(e.target.value)}
            required
          />
        </label>
        <label className="block">
          <span className="text-gray-700 font-medium">Cidade</span>
          <input
            type="text"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500"
            value={city}
            onChange={e => setCity(e.target.value)}
            required
          />
        </label>
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={isPrimary}
            onChange={e => setIsPrimary(e.target.checked)}
          />
          <span>Tornar esta a morada principal</span>
        </label>
        {error && <p className="text-red-600 text-sm">{error}</p>}
        <div className="flex gap-2 mt-4">
          <button
            type="button"
            className="flex-1 bg-gray-200 text-gray-700 px-4 py-2 rounded hover:bg-gray-300"
            onClick={onClose}
            disabled={loading}
          >
            Cancelar
          </button>
          <button
            type="submit"
            className="flex-1 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
            disabled={loading}
          >
            {loading ? "A guardar..." : "Guardar Morada"}
          </button>
        </div>
      </form>
    </Modal>
  );
} 