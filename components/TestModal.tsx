"use client";

interface TestModalProps {
  open: boolean;
  onClose: () => void;
}

export default function TestModal({ open, onClose }: TestModalProps) {
  console.log('TestModal render - open:', open);
  
  if (!open) return null;

  return (
    <div 
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 99999
      }}
      onClick={onClose}
    >
      <div
        style={{
          backgroundColor: 'red',
          color: 'white',
          padding: '2rem',
          borderRadius: '8px',
          fontSize: '2rem',
          fontWeight: 'bold',
          maxWidth: '400px',
          textAlign: 'center'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        🎉 MODAL DE TESTE FUNCIONANDO! 🎉
        <br />
        <button 
          onClick={onClose}
          style={{
            marginTop: '1rem',
            padding: '0.5rem 1rem',
            backgroundColor: 'white',
            color: 'red',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          Fechar
        </button>
      </div>
    </div>
  );
} 