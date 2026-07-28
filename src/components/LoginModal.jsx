import React, { useState } from "react";
import { X, Lock, KeyRound } from "lucide-react";

export default function LoginModal({ isOpen, onClose, onLoginSuccess }) {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (password === "Tech0909") {
      onLoginSuccess();
      setPassword("");
      setError("");
      onClose();
    } else {
      setError("Senha incorreta. Acesso negado.");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/60" onClick={onClose} />

      {/* Modal Box */}
      <div className="relative bg-white rounded-2xl max-w-sm w-full p-6 shadow-2xl border border-gray-100 text-left z-10">
        
        {/* Close Button */}
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 bg-[#F5F6F8] hover:bg-gray-200 rounded-full text-text-sec transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Title & Icon */}
        <div className="flex items-center gap-3 mb-6">
          <div className="bg-primary/10 p-2.5 rounded-xl text-primary">
            <Lock className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold font-poppins text-text-main">
              Acesso Restrito
            </h3>
            <p className="text-[10px] font-semibold text-text-sec uppercase tracking-wide font-inter">
              Painel de Gerenciamento
            </p>
          </div>
        </div>

        {/* Password Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-[11px] font-bold text-text-sec uppercase font-inter mb-1.5">
              Senha de Acesso
            </label>
            <div className="relative">
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Digite a senha..."
                className="w-full bg-[#F5F6F8] border border-gray-200 rounded-lg pl-9 pr-3 py-2.5 text-xs font-inter focus:outline-none focus:border-primary font-semibold"
              />
              <KeyRound className="w-4 h-4 text-text-sec absolute left-3 top-3.5" />
            </div>
            {error && (
              <p className="text-[10px] font-semibold text-red-500 font-inter mt-1.5">{error}</p>
            )}
          </div>

          <button
            type="submit"
            className="w-full bg-primary hover:bg-primary-hover text-white py-3 rounded-lg text-xs font-bold font-poppins uppercase tracking-wider transition-colors shadow-xs"
          >
            Confirmar Senha
          </button>
        </form>

      </div>
    </div>
  );
}
