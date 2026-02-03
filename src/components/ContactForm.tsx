import { useState, useEffect, useRef } from 'react';

// Componente de Modal de Descuento
function DiscountModal({ isOpen, onClose, onConfirm }: { isOpen: boolean; onClose: () => void; onConfirm: () => void }) {
  const [showConfetti, setShowConfetti] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setShowConfetti(true);
      // Confeti automático
      const colors = ["#8B5CF6", "#3B82F6", "#EC4899", "#10B981", "#F59E0B", "#F97316", "#EAB308"];
      const confettiCount = 150;
      
      for (let i = 0; i < confettiCount; i++) {
        setTimeout(() => {
          const confetti = document.createElement("div");
          confetti.style.position = "fixed";
          confetti.style.width = Math.random() * 10 + 8 + "px";
          confetti.style.height = Math.random() * 10 + 8 + "px";
          confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
          confetti.style.left = Math.random() * 100 + "%";
          confetti.style.top = "-20px";
          confetti.style.borderRadius = Math.random() > 0.5 ? "50%" : "0";
          confetti.style.pointerEvents = "none";
          confetti.style.zIndex = "10000";
          confetti.style.opacity = "1";
          
          document.body.appendChild(confetti);
          
          const angle = Math.random() * Math.PI * 2;
          const velocity = 3 + Math.random() * 4;
          const x = Math.cos(angle) * velocity;
          let y = Math.sin(angle) * velocity + 2;
          
          let posX = parseFloat(confetti.style.left);
          let posY = -20;
          
          function animate() {
            posX += x;
            posY += y;
            y += 0.15;
            
            confetti.style.left = posX + "px";
            confetti.style.top = posY + "px";
            confetti.style.opacity = String(Math.max(0, parseFloat(confetti.style.opacity) - 0.008));
            
            if (posY < window.innerHeight + 50 && parseFloat(confetti.style.opacity) > 0) {
              requestAnimationFrame(animate);
            } else {
              confetti.remove();
            }
          }
          
          requestAnimationFrame(animate);
        }, i * 10);
      }
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[10000] flex items-center justify-center p-4" onClick={onClose}>
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
      
      <div 
        className="relative bg-gradient-to-br from-purple-600 via-pink-600 to-blue-600 rounded-3xl p-8 md:p-12 max-w-md w-full shadow-2xl transform transition-all animate-[scaleIn_0.3s_ease-out]"
        onClick={(e) => e.stopPropagation()}
        style={{
          animation: 'scaleIn 0.3s ease-out',
        }}
      >
        <style>{`
          @keyframes scaleIn {
            from {
              transform: scale(0.8);
              opacity: 0;
            }
            to {
              transform: scale(1);
              opacity: 1;
            }
          }
          @keyframes bounce {
            0%, 100% { transform: translateY(0); }
            50% { transform: translateY(-10px); }
          }
          @keyframes pulse {
            0%, 100% { transform: scale(1); }
            50% { transform: scale(1.1); }
          }
        `}</style>
        
        {/* Botón cerrar */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-white/80 hover:text-white transition-colors"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
          </svg>
        </button>

        {/* Contenido */}
        <div className="text-center">
          {/* Emoji grande animado */}
          <div className="text-7xl md:text-8xl mb-4 animate-[bounce_1s_ease-in-out_infinite]">
            🎉
          </div>
          
          {/* Título */}
          <h3 className="text-3xl md:text-4xl font-extrabold text-white mb-3">
            ¡Felicidades!
          </h3>
          
          {/* Descuento destacado */}
          <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-6 mb-6 border-2 border-white/30">
            <div className="text-6xl md:text-7xl font-black text-white mb-2 animate-[pulse_2s_ease-in-out_infinite]">
              20%
            </div>
            <div className="text-xl md:text-2xl font-bold text-white/90">
              DE DESCUENTO
            </div>
            <div className="text-sm md:text-base text-white/80 mt-2">
              Código: <span className="font-bold text-white">SLE20OFF</span>
            </div>
          </div>
          
          {/* Mensaje motivador */}
          <p className="text-white/90 text-lg md:text-xl mb-6 leading-relaxed">
            ¡Estás a un paso de obtener tu descuento! 
            <br />
            <span className="font-semibold">Completa el formulario</span> para aplicar tu código.
          </p>
          
          {/* Botón CTA */}
          <button
            onClick={() => {
              onConfirm();
              onClose();
            }}
            className="bg-white text-purple-600 px-8 py-4 rounded-xl font-bold text-lg hover:scale-105 transition-transform shadow-lg hover:shadow-xl w-full"
          >
            ¡Completar Formulario! 🚀
          </button>
          
          {/* Texto pequeño */}
          <p className="text-white/70 text-sm mt-4">
            El código se aplicará automáticamente al enviar
          </p>
        </div>
      </div>
    </div>
  );
}

// Componente del checkbox de descuento que se mueve
function DiscountCheckbox({ hasDiscount, onToggle }: { hasDiscount: boolean; onToggle: (checked: boolean) => void }) {
  const labelRef = useRef<HTMLLabelElement>(null);
  const returnTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const moveToRandomPosition = () => {
    if (hasDiscount || !labelRef.current) return;
    
    const label = labelRef.current;
    const container = label.parentElement;
    if (!container) return;
    
    const rect = label.getBoundingClientRect();
    const containerRect = container.getBoundingClientRect();
    
    // Calcular nueva posición aleatoria (mover mucho)
    const maxX = Math.max(0, containerRect.width - rect.width);
    const maxY = Math.max(0, containerRect.height - rect.height);
    
    const newX = Math.random() * maxX;
    const newY = Math.random() * maxY;
    
    label.style.transform = `translate(${newX}px, ${newY}px)`;
    label.style.position = 'absolute';
    
    // Limpiar timeout anterior si existe
    if (returnTimeoutRef.current) {
      clearTimeout(returnTimeoutRef.current);
    }
    
    // Después de 1.5 segundos, volver al origen
    returnTimeoutRef.current = setTimeout(() => {
      if (!hasDiscount && labelRef.current) {
        labelRef.current.style.transform = 'translate(0, 0)';
        labelRef.current.style.position = 'static';
      }
    }, 1500);
  };

  const handleMouseEnter = () => {
    if (!hasDiscount) {
      moveToRandomPosition();
    }
  };

  useEffect(() => {
    return () => {
      if (returnTimeoutRef.current) {
        clearTimeout(returnTimeoutRef.current);
      }
    };
  }, []);

  return (
    <div className="mt-6 relative" style={{ minHeight: '60px' }}>
      <label 
        ref={labelRef}
        className="discount-checkbox-label flex items-center gap-2 cursor-pointer group relative transition-transform duration-300 ease-out"
        onMouseEnter={handleMouseEnter}
        style={{
          transition: 'transform 0.3s ease-out',
        }}
      >
        <div className="relative flex-shrink-0">
          <input
            type="checkbox"
            checked={hasDiscount}
            onChange={(e) => onToggle(e.target.checked)}
            className="w-5 h-5 rounded border-2 border-purple-400 text-purple-600 focus:ring-2 focus:ring-purple-500 focus:ring-offset-1 cursor-pointer transition-all appearance-none checked:bg-purple-600 checked:border-purple-600"
          />
          {hasDiscount && (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
            </div>
          )}
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm font-semibold text-purple-700 whitespace-nowrap">
            🎁 20% OFF
          </span>
          {hasDiscount && (
            <span className="px-2 py-0.5 bg-purple-600 text-white text-xs font-bold rounded-full animate-[pulse_2s_ease-in-out_infinite]">
              ✓
            </span>
          )}
        </div>
      </label>
    </div>
  );
}

const interests = [
  "Sitios Web",
  "E-Commerce",
  "Apps y Software a Medida",
  "Bots con IA",
  "Automatización de Procesos",
  "Marketing Digital",
  "Gestión de Redes Sociales",
];

const budgets = [
  "$500.000 COP    -    $2.000.000 COP",
  "$2.000.000 COP  -    $5.000.000 COP",
  "$5.000.000 COP  -    $10.000.000 COP",
  "$10.000.000 COP -    $50.000.000 COP",
];

// Componente del botón de descuento que se mueve (DEPRECADO - ahora usamos checkbox con modal)
function DiscountButton_DEPRECATED({ onSelect }: { onSelect: () => void }) {
  const buttonRef = useRef<HTMLButtonElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [clickCount, setClickCount] = useState(0);
  const [isMoving, setIsMoving] = useState(false);
  const [isSelected, setIsSelected] = useState(false);
  const returnTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isMouseNearRef = useRef(false);

  const triggerConfetti = () => {
    const colors = ["#8B5CF6", "#3B82F6", "#EC4899", "#10B981", "#F59E0B"];
    const confettiCount = 100;
    
    for (let i = 0; i < confettiCount; i++) {
      const confetti = document.createElement("div");
      confetti.style.position = "fixed";
      confetti.style.width = "10px";
      confetti.style.height = "10px";
      confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
      confetti.style.left = Math.random() * 100 + "%";
      confetti.style.top = "-10px";
      confetti.style.borderRadius = "50%";
      confetti.style.pointerEvents = "none";
      confetti.style.zIndex = "9999";
      confetti.style.opacity = "1";
      
      document.body.appendChild(confetti);
      
      const angle = Math.random() * Math.PI * 2;
      const velocity = 2 + Math.random() * 3;
      const x = Math.cos(angle) * velocity;
      let y = Math.sin(angle) * velocity + 2;
      
      let posX = parseFloat(confetti.style.left);
      let posY = -10;
      
      function animate() {
        posX += x;
        posY += y;
        y += 0.1;
        
        confetti.style.left = posX + "px";
        confetti.style.top = posY + "px";
        confetti.style.opacity = String(Math.max(0, parseFloat(confetti.style.opacity) - 0.01));
        
        if (posY < window.innerHeight && parseFloat(confetti.style.opacity) > 0) {
          requestAnimationFrame(animate);
        } else {
          confetti.remove();
        }
      }
      
      requestAnimationFrame(animate);
    }
  };

  const getRandomPosition = () => {
    if (!containerRef.current || !buttonRef.current) return { x: 0, y: 0 };
    const containerRect = containerRef.current.getBoundingClientRect();
    const buttonRect = buttonRef.current.getBoundingClientRect();
    
    const maxX = containerRect.width - buttonRect.width;
    const maxY = containerRect.height - buttonRect.height;
    
    return {
      x: Math.max(0, Math.random() * Math.max(0, maxX)),
      y: Math.max(0, Math.random() * Math.max(0, maxY)),
    };
  };

  const moveButton = () => {
    if (isMoving || clickCount > 0 || isSelected) return;
    setIsMoving(true);
    isMouseNearRef.current = true;

    if (returnTimeoutRef.current) {
      clearTimeout(returnTimeoutRef.current);
      returnTimeoutRef.current = null;
    }

    const position = getRandomPosition();
    if (buttonRef.current) {
      buttonRef.current.style.position = "absolute";
      buttonRef.current.style.transform = `translate(${position.x}px, ${position.y}px)`;
    }
    
    setTimeout(() => {
      setIsMoving(false);
      returnTimeoutRef.current = setTimeout(() => {
        if (!isMouseNearRef.current && clickCount === 0 && !isSelected) {
          if (buttonRef.current) {
            buttonRef.current.style.position = "static";
            buttonRef.current.style.transform = "translate(0, 0)";
          }
          isMouseNearRef.current = false;
        }
      }, 1500);
    }, 300);
  };

  const handleClick = (e: React.MouseEvent) => {
    const newClickCount = clickCount + 1;
    setClickCount(newClickCount);
    
    if (newClickCount >= 3) {
      if (returnTimeoutRef.current) {
        clearTimeout(returnTimeoutRef.current);
        returnTimeoutRef.current = null;
      }
      
      if (buttonRef.current) {
        buttonRef.current.style.position = "static";
        buttonRef.current.style.transform = "translate(0, 0)";
        buttonRef.current.style.cursor = "pointer";
      }
      
      setIsSelected(true);
      triggerConfetti();
      onSelect();
      
      setTimeout(() => {
        alert("¡Felicidades! Has obtenido un 20% de descuento. Usa el código: SLE20OFF");
      }, 500);
    } else {
      e.preventDefault();
      moveButton();
    }
  };

  useEffect(() => {
    const button = buttonRef.current;
    const container = containerRef.current;
    if (!button || !container) return;

    const handleMouseEnter = () => {
      isMouseNearRef.current = true;
      if (returnTimeoutRef.current) {
        clearTimeout(returnTimeoutRef.current);
        returnTimeoutRef.current = null;
      }
      if (clickCount === 0 && !isSelected) {
        moveButton();
      }
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (clickCount > 0 || isMoving || isSelected) return;

      const buttonRect = button.getBoundingClientRect();
      const buttonCenterX = buttonRect.left + buttonRect.width / 2;
      const buttonCenterY = buttonRect.top + buttonRect.height / 2;
      
      const distance = Math.sqrt(
        Math.pow(e.clientX - buttonCenterX, 2) + Math.pow(e.clientY - buttonCenterY, 2)
      );
      
      if (distance < 80) {
        isMouseNearRef.current = true;
        if (returnTimeoutRef.current) {
          clearTimeout(returnTimeoutRef.current);
          returnTimeoutRef.current = null;
        }
        moveButton();
      } else {
        isMouseNearRef.current = false;
      }
    };

    button.addEventListener("mouseenter", handleMouseEnter);
    container.addEventListener("mousemove", handleMouseMove);

    return () => {
      button.removeEventListener("mouseenter", handleMouseEnter);
      container.removeEventListener("mousemove", handleMouseMove);
      if (returnTimeoutRef.current) {
        clearTimeout(returnTimeoutRef.current);
      }
    };
  }, [clickCount, isMoving, isSelected]);

  return (
    <div ref={containerRef} className="relative inline-block">
      <button
        ref={buttonRef}
        type="button"
        onClick={handleClick}
        className={`discount-button px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 cursor-pointer bg-gradient-to-r from-purple-600 to-blue-600 text-white hover:shadow-lg whitespace-nowrap ${
          isSelected ? 'ring-2 ring-purple-500' : ''
        }`}
        style={{ left: 0, top: 0, transform: 'translate(0, 0)' }}
      >
        🎁 20% OFF
      </button>
    </div>
  );
}

export default function ContactForm() {
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);
  const [selectedBudget, setSelectedBudget] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    company: '',
    email: '',
    phone: '',
    project: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);
  const [showDiscountModal, setShowDiscountModal] = useState(false);
  const [hasDiscount, setHasDiscount] = useState(false);

  // Preseleccionar interés desde URL
  useEffect(() => {
    const preselectInterest = () => {
      let interestParam = null;
      
      // Intentar desde hash primero (formato: #contact?interest=...)
      const hash = window.location.hash;
      if (hash) {
        const hashMatch = hash.match(/[?&]interest=([^&]+)/);
        if (hashMatch) {
          interestParam = decodeURIComponent(hashMatch[1].replace(/\+/g, ' '));
        }
      }
      
      // Si no está en hash, intentar desde query params
      if (!interestParam) {
        const urlParams = new URLSearchParams(window.location.search);
        interestParam = urlParams.get('interest');
      }
      
      if (interestParam && interests.includes(interestParam)) {
        setSelectedInterests([interestParam]);
      }
    };

    // Ejecutar inmediatamente y después de delays
    preselectInterest();
    const timeout1 = setTimeout(preselectInterest, 100);
    const timeout2 = setTimeout(preselectInterest, 500);
    const timeout3 = setTimeout(preselectInterest, 1000);

    // Escuchar cambios en el hash
    const handleHashChange = () => {
      setTimeout(preselectInterest, 100);
    };

    // Escuchar cuando se hace scroll
    const handleScroll = () => {
      const hash = window.location.hash;
      if (hash && hash.includes('interest=')) {
        setTimeout(preselectInterest, 100);
      }
    };

    window.addEventListener('hashchange', handleHashChange);
    window.addEventListener('scroll', handleScroll, { passive: true });
    
    // Observer para cuando el componente se hace visible
    const contactSection = document.getElementById('contact');
    let observer: IntersectionObserver | null = null;
    
    if (contactSection) {
      observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            setTimeout(preselectInterest, 100);
          }
        });
      }, { threshold: 0.1 });
      observer.observe(contactSection);
    }
    
    return () => {
      clearTimeout(timeout1);
      clearTimeout(timeout2);
      clearTimeout(timeout3);
      window.removeEventListener('hashchange', handleHashChange);
      window.removeEventListener('scroll', handleScroll);
      if (observer && contactSection) {
        observer.unobserve(contactSection);
      }
    };
  }, []);

  const toggleInterest = (interest: string) => {
    console.log('🖱️ toggleInterest llamado con:', interest);
    console.log('📊 Estado anterior de selectedInterests:', selectedInterests);
    setSelectedInterests(prev => {
      const newState = prev.includes(interest)
        ? prev.filter(i => i !== interest)
        : [...prev, interest];
      console.log('📊 Nuevo estado de selectedInterests:', newState);
      return newState;
    });
  };

  const handleBudgetSelect = (budget: string) => {
    console.log('💰 handleBudgetSelect llamado con:', budget);
    setSelectedBudget(budget);
  };

  const handleDiscountToggle = (checked: boolean) => {
    if (checked) {
      setShowDiscountModal(true);
    } else {
      setHasDiscount(false);
      if (selectedBudget === 'Descuento 20%') {
        setSelectedBudget(null);
      }
    }
  };

  const handleDiscountConfirm = () => {
    setHasDiscount(true);
    setSelectedBudget('Descuento 20%');
    setShowDiscountModal(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitMessage(null);

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          interests: selectedInterests,
          budget: selectedBudget,
          discountCode: hasDiscount ? 'SLE20OFF' : null,
        }),
      });

      if (response.ok) {
        setSubmitMessage({ type: 'success', text: '¡Mensaje enviado! Te contactaremos pronto.' });
        setFormData({
          name: '',
          company: '',
          email: '',
          phone: '',
          project: '',
        });
        setSelectedInterests([]);
        setSelectedBudget(null);
      } else {
        throw new Error('Error al enviar el formulario');
      }
    } catch (error) {
      setSubmitMessage({ type: 'error', text: 'Error al enviar el mensaje. Por favor intenta de nuevo.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Contact Information */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
        <div>
          <label
            htmlFor="name"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Nombre
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            className="w-full border-0 border-b border-gray-300 focus:border-gray-900 focus:ring-0 pb-2 text-base md:text-lg bg-transparent transition-colors"
            required
          />
        </div>
        
        <div>
          <label
            htmlFor="company"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Empresa
          </label>
          <input
            type="text"
            id="company"
            name="company"
            value={formData.company}
            onChange={handleInputChange}
            className="w-full border-0 border-b border-gray-300 focus:border-gray-900 focus:ring-0 pb-2 text-base md:text-lg bg-transparent transition-colors"
          />
        </div>
        
        <div>
          <label
            htmlFor="email"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Tu Email
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            className="w-full border-0 border-b border-gray-300 focus:border-gray-900 focus:ring-0 pb-2 text-base md:text-lg bg-transparent transition-colors"
            required
          />
        </div>
        
        <div>
          <label
            htmlFor="phone"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Tu Teléfono
          </label>
          <input
            type="tel"
            id="phone"
            name="phone"
            value={formData.phone}
            onChange={handleInputChange}
            className="w-full border-0 border-b border-gray-300 focus:border-gray-900 focus:ring-0 pb-2 text-base md:text-lg bg-transparent transition-colors placeholder:text-gray-400"
            placeholder=""
          />
        </div>
      </div>

      {/* Interests */}
      <div>
        <h4 className="text-lg font-semibold text-gray-900 mb-4">
          Estoy interesado en...
        </h4>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
          {interests.map((interest) => {
            const isSelected = selectedInterests.includes(interest);
            return (
              <button
                key={interest}
                type="button"
                onClick={() => toggleInterest(interest)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  isSelected
                    ? 'bg-gray-900 text-white'
                    : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
                }`}
              >
                {interest}
              </button>
            );
          })}
        </div>
      </div>

      {/* Budget */}
      <div>
        <h4 className="text-lg font-semibold text-gray-900 mb-4">
          Presupuesto del Proyecto (COP)
        </h4>
        <div className="flex flex-wrap gap-3 relative" style={{ minHeight: '50px' }} id="budget-container">
          {budgets.map((budget) => (
            <button
              key={budget}
              type="button"
              onClick={() => handleBudgetSelect(budget)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                selectedBudget === budget
                  ? 'bg-gray-900 text-white'
                  : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
              }`}
            >
              {budget}
            </button>
          ))}
        </div>
        
        {/* Input de descuento separado - Botón pequeño que se mueve */}
        <DiscountCheckbox 
          hasDiscount={hasDiscount}
          onToggle={handleDiscountToggle}
        />
        
        <DiscountModal 
          isOpen={showDiscountModal} 
          onClose={() => setShowDiscountModal(false)}
          onConfirm={handleDiscountConfirm}
        />
      </div>

      {/* Project Description */}
      <div>
        <h4 className="text-lg font-semibold text-gray-900 mb-4">
          Cuéntanos sobre tu proyecto.
        </h4>
        <textarea
          id="project"
          name="project"
          value={formData.project}
          onChange={handleInputChange}
          rows={4}
          className="w-full border-0 border-b border-gray-300 focus:border-gray-900 focus:ring-0 pb-2 text-base md:text-lg bg-transparent resize-none transition-colors placeholder:text-gray-400"
          placeholder="Escribe algo conciso..."
        />
      </div>

      {/* Submit Message */}
      {submitMessage && (
        <div className={`p-4 rounded-lg ${
          submitMessage.type === 'success'
            ? 'bg-green-50 text-green-800'
            : 'bg-red-50 text-red-800'
        }`}>
          {submitMessage.text}
        </div>
      )}

      {/* Submit Button */}
      <div className="flex justify-end pt-4">
        <button
          type="submit"
          disabled={isSubmitting}
          className="bg-gradient-to-r from-[#082347] to-blue-600 text-white px-8 py-3 rounded-lg font-semibold transition-all hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? 'Enviando...' : 'Enviar'}
        </button>
      </div>
    </form>
  );
}

