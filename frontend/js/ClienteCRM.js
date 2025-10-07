// ClienteCRM.js - Sistema de Chat CRM para clientes
import { 
  obtenerInteraccionesPorCliente, 
  crearInteraccionChat,
  verificarMensajesNuevos 
} from '../Api/consumeApi.js';

class ClienteCRM {
  constructor() {
    this.chatContainer = null;
    this.messagesContainer = null;
    this.messageInput = null;
    this.sendButton = null;
    this.isOpen = false;
    this.idCliente = sessionStorage.getItem('idUsuario');
    this.ultimaFecha = null;
    this.pollingInterval = null;
    this.notificationCount = 0;
    this.mensajesCargados = false;
    this.enviandoMensaje = false; // ✅ Nueva variable para controlar envío
  }

  // ✅ Inicializar el componente de chat
  init() {
    if (!this.idCliente) {
      console.error('No se encontró el ID del usuario en sessionStorage');
      return;
    }

    this.createChatUI();
    this.attachEventListeners();
    this.cargarMensajes();
    this.iniciarPolling();
  }

  // ✅ Crear la interfaz del chat
  createChatUI() {
    // Crear botón flotante
    const floatingBtn = document.createElement('button');
    floatingBtn.id = 'chatFloatingBtn';
    floatingBtn.className = 'chat-floating-btn';
    floatingBtn.innerHTML = `
      <i class="fas fa-comments"></i>
      <span class="chat-notification-badge" id="chatNotificationBadge" style="display: none;">0</span>
    `;
    document.body.appendChild(floatingBtn);

    // Crear contenedor del chat
    const chatWidget = document.createElement('div');
    chatWidget.id = 'chatWidget';
    chatWidget.className = 'chat-widget';
    chatWidget.innerHTML = `
      <div class="chat-header">
        <div class="chat-header-info">
          <i class="fas fa-headset"></i>
          <div>
            <h4>StoreTechnology---Chat</h4>
            <span class="chat-status">En línea</span>
          </div>
        </div>
        <button class="chat-close-btn" id="chatCloseBtn">
          <i class="fas fa-times"></i>
        </button>
      </div>
      
      <div class="chat-messages" id="chatMessages">
        <div class="chat-welcome-message" id="chatWelcomeMessage">
          <i class="fas fa-robot"></i>
          <p>¡Hola! Bienvenido a nuestro chat. ¿En qué podemos ayudarte hoy?</p>
        </div>
      </div>
      
      <div class="chat-input-container">
        <input 
          type="text" 
          id="chatMessageInput" 
          class="chat-input" 
          placeholder="Escribe tu mensaje..."
          maxlength="500"
        />
        <button id="chatSendBtn" class="chat-send-btn">
          <i class="fas fa-paper-plane"></i>
        </button>
      </div>
      
      <div class="chat-typing-indicator" id="chatTypingIndicator" style="display: none;">
        <span></span>
        <span></span>
        <span></span>
      </div>
    `;
    document.body.appendChild(chatWidget);

    // Guardar referencias
    this.chatContainer = chatWidget;
    this.messagesContainer = document.getElementById('chatMessages');
    this.messageInput = document.getElementById('chatMessageInput');
    this.sendButton = document.getElementById('chatSendBtn');
    this.floatingBtn = floatingBtn;
    this.notificationBadge = document.getElementById('chatNotificationBadge');
    this.welcomeMessage = document.getElementById('chatWelcomeMessage');
  }

  // ✅ Adjuntar event listeners
  attachEventListeners() {
    // Abrir/cerrar chat
    this.floatingBtn.addEventListener('click', () => this.toggleChat());
    document.getElementById('chatCloseBtn').addEventListener('click', () => this.toggleChat());

    // Enviar mensaje
    this.sendButton.addEventListener('click', () => this.enviarMensaje());
    this.messageInput.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') {
        this.enviarMensaje();
      }
    });

    // Auto-resize del input
    this.messageInput.addEventListener('input', () => {
      this.adjustInputHeight();
    });
  }

  // ✅ Toggle del chat (abrir/cerrar)
  toggleChat() {
    this.isOpen = !this.isOpen;
    
    if (this.isOpen) {
      this.chatContainer.classList.add('chat-widget-open');
      this.floatingBtn.style.display = 'none';
      this.messageInput.focus();
      this.resetNotifications();
      
      // Scroll al final
      setTimeout(() => {
        this.scrollToBottom();
      }, 300);
    } else {
      this.chatContainer.classList.remove('chat-widget-open');
      this.floatingBtn.style.display = 'flex';
    }
  }

  // ✅ Cargar mensajes desde el servidor
  async cargarMensajes() {
    try {
      // ✅ Solo cargar mensajes si no se han cargado previamente
      if (this.mensajesCargados) {
        return;
      }

      const mensajes = await obtenerInteraccionesPorCliente(this.idCliente);
      
      if (mensajes && mensajes.length > 0) {
        // ✅ Ocultar mensaje de bienvenida cuando hay mensajes previos
        if (this.welcomeMessage) {
          this.welcomeMessage.style.display = 'none';
        }
        
        // ✅ Actualizar última fecha SOLO con mensajes del admin/CRM
        const mensajesAdmin = mensajes.filter(m => m.id_usuario !== null);
        if (mensajesAdmin.length > 0) {
          this.ultimaFecha = mensajesAdmin[mensajesAdmin.length - 1].fecha_interaccion;
        } else if (mensajes.length > 0) {
          // Si no hay mensajes del admin, usar el último mensaje en general
          this.ultimaFecha = mensajes[mensajes.length - 1].fecha_interaccion;
        }
        
        // Mostrar mensajes
        mensajes.forEach(mensaje => {
          this.mostrarMensaje(mensaje.descripcion, mensaje.id_usuario ? 'admin' : 'cliente', false);
        });
        
        this.scrollToBottom();
      }
      
      // ✅ Marcar que los mensajes ya fueron cargados
      this.mensajesCargados = true;
      
    } catch (error) {
      console.error('Error al cargar mensajes:', error);
      this.mostrarError('No se pudieron cargar los mensajes anteriores');
    }
  }

  // ✅ Enviar mensaje
  async enviarMensaje() {
    const mensaje = this.messageInput.value.trim();
    
    if (!mensaje) return;

    // ✅ Prevenir múltiples envíos simultáneos
    if (this.enviandoMensaje) return;
    this.enviandoMensaje = true;

    // Deshabilitar input mientras se envía
    this.messageInput.disabled = true;
    this.sendButton.disabled = true;

    // ✅ Ocultar mensaje de bienvenida cuando el cliente envía su primer mensaje
    if (this.welcomeMessage && this.welcomeMessage.style.display !== 'none') {
      this.welcomeMessage.style.display = 'none';
    }

    // Mostrar mensaje del cliente inmediatamente
    this.mostrarMensaje(mensaje, 'cliente', true);
    const mensajeTemporalFecha = new Date().toISOString(); // ✅ Guardar fecha temporal
    this.messageInput.value = '';
    
    try {
      // Enviar al servidor
      await crearInteraccionChat(this.idCliente, mensaje);
      
      // ✅ Actualizar última fecha SOLO si es más reciente (para evitar que el polling detecte el propio mensaje)
      if (!this.ultimaFecha || new Date(mensajeTemporalFecha) > new Date(this.ultimaFecha)) {
        this.ultimaFecha = mensajeTemporalFecha;
      }
      
      // Simular respuesta automática (opcional)
      setTimeout(() => {
        this.mostrarMensajeAutomatico();
      }, 1500);
      
    } catch (error) {
      console.error('Error al enviar mensaje:', error);
      this.mostrarError('No se pudo enviar el mensaje. Intenta nuevamente.');
    } finally {
      this.messageInput.disabled = false;
      this.sendButton.disabled = false;
      this.enviandoMensaje = false; // ✅ Rehabilitar envío
      this.messageInput.focus();
    }
  }

  // ✅ Mostrar mensaje en el chat
  mostrarMensaje(texto, tipo = 'cliente', animate = true) {
    const messageDiv = document.createElement('div');
    messageDiv.className = `chat-message chat-message-${tipo}`;
    if (animate) messageDiv.classList.add('chat-message-enter');
    
    const time = new Date().toLocaleTimeString('es-CO', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
    
    messageDiv.innerHTML = `
      <div class="chat-message-content">
        <p>${this.escapeHtml(texto)}</p>
        <span class="chat-message-time">${time}</span>
      </div>
    `;
    
    this.messagesContainer.appendChild(messageDiv);
    this.scrollToBottom();
  }

  // ✅ Mostrar mensaje automático de respuesta
  mostrarMensajeAutomatico() {
    const respuestas = [
      "Gracias por contactarnos. Un agente revisará tu mensaje pronto.",
      "Hemos recibido tu mensaje. Te responderemos a la brevedad.",
      "Mensaje recibido. Nuestro equipo te atenderá en breve.",
      "Tu consulta ha sido registrada. Pronto nos pondremos en contacto contigo."
    ];
    
    const respuesta = respuestas[Math.floor(Math.random() * respuestas.length)];
    
    // Mostrar indicador de escritura
    document.getElementById('chatTypingIndicator').style.display = 'flex';
    
    setTimeout(() => {
      document.getElementById('chatTypingIndicator').style.display = 'none';
      this.mostrarMensaje(respuesta, 'admin', true);
    }, 2000);
  }

  // ✅ Mostrar error
  mostrarError(mensaje) {
    const errorDiv = document.createElement('div');
    errorDiv.className = 'chat-error-message';
    errorDiv.innerHTML = `
      <i class="fas fa-exclamation-circle"></i>
      <p>${mensaje}</p>
    `;
    
    this.messagesContainer.appendChild(errorDiv);
    this.scrollToBottom();
    
    // Auto-remover después de 5 segundos
    setTimeout(() => {
      errorDiv.remove();
    }, 5000);
  }

  // ✅ Scroll automático al final
  scrollToBottom() {
    this.messagesContainer.scrollTop = this.messagesContainer.scrollHeight;
  }

  // ✅ Ajustar altura del input
  adjustInputHeight() {
    this.messageInput.style.height = 'auto';
    this.messageInput.style.height = Math.min(this.messageInput.scrollHeight, 100) + 'px';
  }

  // ✅ Escapar HTML para prevenir XSS
  escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }

  // ✅ Iniciar polling para nuevos mensajes
  iniciarPolling() {
    this.pollingInterval = setInterval(async () => {
      try {
        // ✅ No hacer polling si se está enviando un mensaje
        if (this.enviandoMensaje) {
          return;
        }

        const mensajesNuevos = await verificarMensajesNuevos(this.idCliente, this.ultimaFecha);
        
        if (mensajesNuevos && mensajesNuevos.length > 0) {
          console.log('📨 Mensajes nuevos recibidos del admin/CRM:', mensajesNuevos.length);
          
          // ✅ Ocultar mensaje de bienvenida cuando llegan nuevos mensajes
          if (this.welcomeMessage && this.welcomeMessage.style.display !== 'none') {
            this.welcomeMessage.style.display = 'none';
          }
          
          mensajesNuevos.forEach(mensaje => {
            // ✅ Solo mostrar mensajes del admin/CRM (id_usuario no nulo)
            if (mensaje.id_usuario) {
              this.mostrarMensaje(mensaje.descripcion, 'admin', true);
              
              // ✅ Solo incrementar notificaciones si el chat está cerrado
              if (!this.isOpen) {
                this.incrementarNotificaciones();
              }
            }
          });
          
          // ✅ Actualizar última fecha con el mensaje más reciente del admin
          if (mensajesNuevos.length > 0) {
            this.ultimaFecha = mensajesNuevos[mensajesNuevos.length - 1].fecha_interaccion;
            console.log('🕐 Última fecha actualizada:', this.ultimaFecha);
          }
        }
      } catch (error) {
        console.error('Error en polling:', error);
      }
    }, 5000); // Verificar cada 5 segundos
  }

  // ✅ Incrementar contador de notificaciones
  incrementarNotificaciones() {
    this.notificationCount++;
    this.notificationBadge.textContent = this.notificationCount;
    this.notificationBadge.style.display = 'flex';
    
    // Animar el botón flotante
    this.floatingBtn.classList.add('chat-notification-pulse');
    setTimeout(() => {
      this.floatingBtn.classList.remove('chat-notification-pulse');
    }, 1000);
  }

  // ✅ Resetear notificaciones
  resetNotifications() {
    this.notificationCount = 0;
    this.notificationBadge.style.display = 'none';
  }

  // ✅ Destruir el componente
  destroy() {
    if (this.pollingInterval) {
      clearInterval(this.pollingInterval);
    }
    
    if (this.chatContainer) {
      this.chatContainer.remove();
    }
    
    if (this.floatingBtn) {
      this.floatingBtn.remove();
    }
  }
}

// ✅ Inicializar el chat cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
  const chatCRM = new ClienteCRM();
  chatCRM.init();
  
  // Hacer disponible globalmente para debugging
  window.chatCRM = chatCRM;
});

export default ClienteCRM;