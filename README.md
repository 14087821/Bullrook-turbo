# 🐂 BULLROOK POWER - Plataforma de Minería en dYdX Chain

![License](https://img.shields.io/badge/License-MIT-blue.svg)
![Status](https://img.shields.io/badge/Status-Production%20Ready-brightgreen.svg)
![Blockchain](https://img.shields.io/badge/Blockchain-dYdX%20Chain-orange.svg)

**Bullrook Power** es una aplicación web profesional de minería y staking en la blockchain de **dYdX Chain**. Permite a los usuarios conectar sus carteras Keplr, delegar fondos DYDX a validadores y ganar recompensas automáticas de forma segura.

## 🚀 Características Principales

### ✅ Funcionalidades Core
- **Conexión Keplr Wallet** - Integración segura con Keplr para todas las transacciones
- **Lectura de Balances en Tiempo Real** - Visualiza tus saldos de DYDX y USDC directamente de la blockchain
- **Staking Delegación** - Delega fondos DYDX a validadores de la red dYdX
- **Retiro de Recompensas** - Cobra todas tus ganancias acumuladas en un solo clic
- **Dashboard de Stats** - Panel visual con balances, delegaciones y recompensas

### 📊 Análisis y Visualización
- **Gráficas de Evolución** - Visualiza la evolución de tus balances en tiempo real
- **Historial de Recompensas** - Seguimiento de ganancias diarias
- **Actualización Periódica** - Los datos se actualizan automáticamente cada 30 segundos

### 🎨 Experiencia de Usuario
- **Diseño Responsive** - Funciona perfectamente en desktop, tablet y móvil
- **Tema Claro/Oscuro** - Alterna entre modo oscuro y claro según preferencia
- **Interfaz Intuitiva** - Navegación clara y botones de acción obvios
- **Validaciones de Seguridad** - Previene errores de entrada y transacciones inválidas
- **Mensajes de Error Detallados** - Feedback claro en cada acción

## 📋 Requisitos Previos

Antes de usar Bullrook Power, necesitas:

1. **Keplr Wallet** - [Descarga la extensión](https://www.keplr.app/)
2. **DYDX Tokens** - Fondos en tu cartera para delegar
3. **Navegador Moderno** - Chrome, Firefox, Safari o Edge (versiones recientes)
4. **Conexión a Internet** - Conexión estable para transacciones blockchain

## 🛠️ Instalación y Configuración

### Opción 1: Usar Directamente Online
Si despliegas en un servidor, simplemente abre `index.html` en tu navegador.

### Opción 2: Instalación Local para Desarrollo

```bash
# 1. Clona el repositorio
git clone https://github.com/14087821/Bullrook-turbo.git
cd Bullrook-turbo

# 2. Inicia un servidor local (Python 3)
python -m http.server 8000

# 3. Abre en tu navegador
# http://localhost:8000
```

**Con Node.js:**
```bash
npx http-server
```

**Con PHP:**
```bash
php -S localhost:8000
```

## 📖 Guía de Uso

### 1️⃣ Conectar tu Cartera

```
1. Haz clic en el botón "🚀 CONECTAR CARTERA"
2. Se abrirá Keplr pidiéndote permiso
3. Aprueba la conexión
4. Tu dirección aparecerá en el estado de la cartera
```

### 2️⃣ Ver Tus Balances

Una vez conectado:
- **Balance DYDX** - Fondos disponibles para delegar
- **Balance USDC** - Stablecoins disponibles
- **Delegado** - Cantidad total delegada a validadores
- **Recompensas** - Ganancias acumuladas sin cobrar

### 3️⃣ Delegar Fondos

```
1. Ve a la sección "🔒 MINERÍA Y STAKING"
2. Selecciona un validador de la lista
3. Ingresa la cantidad de DYDX a delegar
4. Haz clic en "✅ DELEGAR Y GANAR"
5. Aprueba la transacción en Keplr
6. ¡Espera confirmación! Recibirás recompensas automáticamente
```

### 4️⃣ Cobrar Recompensas

```
1. Ve a la sección "💰 TUS GANANCIAS"
2. Verás el total de DYDX acumulados
3. Haz clic en "💎 COBRAR TODO"
4. Aprueba la transacción en Keplr
5. ¡Las recompensas se transferirán a tu cartera!
```

## 🔧 Configuración Técnica

### Variables de Configuración (en `app.js`)

```javascript
const CONFIG = {
    chainId: 'dydx-mainnet-1',           // ID de la red
    rpcEndpoint: 'https://rpc.dydx.nodex.one:443',  // RPC oficial
    nativeDenom: 'adydx',                // Denominación nativa
    usdcDenom: 'ibc/295548A...',         // IBC USDC
    gasPrice: '12.5',                    // Precio gas
    gasLimit: 300000                     // Límite gas
};
```

## 🛡️ Seguridad

### Características de Seguridad Implementadas

✅ **Validación de Direcciones** - Verifica formato correcto de direcciones blockchain
✅ **Validación de Montos** - Previene valores negativos o excesivos
✅ **Manejo de Errores** - Captura y reporta errores claramente
✅ **Almacenamiento Local** - Tema guardado en localStorage (sin datos sensibles)
✅ **Sin Almacenamiento de Claves** - Las claves nunca se guardan localmente
✅ **Transacciones Firmadas** - Todas las transacciones requieren firma Keplr

### Recomendaciones de Seguridad

⚠️ **Nunca compartas tu seed phrase** - Solo se ingresa en Keplr
⚠️ **Usa HTTPS** - Si despliegas en producción, siempre usa HTTPS
⚠️ **Verifica URLs** - Solo accede desde dominios confiables
⚠️ **Actualiza Keplr** - Mantén la extensión actualizada

## 🐛 Solución de Problemas

### "Keplr no está instalado"
**Solución:** [Descarga Keplr](https://www.keplr.app/) e instálalo en tu navegador

### "Error: Dirección no válida"
**Solución:** Asegúrate de estar conectado a dYdX Chain en Keplr
```
1. Abre Keplr
2. Ve a Configuración → Redes
3. Busca y activa "dYdX Chain"
4. Recarga la página
```

### "Transacción rechazada"
**Soluciones:**
- Verifica tener fondos suficientes para gas
- Intenta nuevamente en unos minutos
- Comprueba el monto a delegar

### "No veo mis recompensas"
**Soluciones:**
- Las recompensas tardan ~5 minutos en acumularse
- Recarga la página (Ctrl+F5)
- Espera a que se actualicen automáticamente (cada 30s)

### "El navegador se congela"
**Solución:** Limpia el caché y localStorage
```javascript
// Abre la consola (F12) y ejecuta:
localStorage.clear();
location.reload();
```

## 📱 Compatibilidad

| Navegador | Desktop | Mobile |
|-----------|---------|--------|
| Chrome    | ✅ 90+  | ✅ 90+ |
| Firefox   | ✅ 88+  | ✅ 88+ |
| Safari    | ✅ 14+  | ✅ 14+ |
| Edge      | ✅ 90+  | ✅ 90+ |

## 🚀 Roadmap Futuro

- [ ] **Integración Binance API** - Traduce directamente en Binance
- [ ] **Historial de Transacciones** - Registro completo de operaciones
- [ ] **Notificaciones Push** - Alertas en tiempo real
- [ ] **PWA (Progressive Web App)** - Aplicación instalable
- [ ] **Multi-validador** - Delega a varios validadores simultáneamente
- [ ] **Análisis Avanzado** - Dashboards de ROI y APY
- [ ] **Soporte móvil nativo** - Apps iOS/Android
- [ ] **API de Trading dYdX** - Trading completo en cadena

## 📊 Métricas de Rendimiento

| Métrica | Valor |
|---------|-------|
| Tiempo Carga | < 2s |
| Respuesta UI | < 100ms |
| Actualización Balance | 30s |
| Confirmación Transacción | 10-30s |

## 🤝 Contribuir

Las contribuciones son bienvenidas. Por favor:

1. Fork el proyecto
2. Crea una rama (`git checkout -b feature/AmazingFeature`)
3. Commit cambios (`git commit -m 'Add AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Ver `LICENSE` para más detalles.

## 📞 Soporte

¿Preguntas o problemas?

- 📧 **Email**: i14087821@gmail.com
- 💬 **Issues**: [GitHub Issues](https://github.com/14087821/Bullrook-turbo/issues)
- 🐦 **Twitter**: [@BullrookPower](https://twitter.com)

## ⭐ Agradecimientos

- **dYdX Chain** - Por la infraestructura blockchain
- **Cosmos SDK** - Por el ecosistema
- **Keplr** - Por la billetera segura
- **CosmJS** - Por las librerías blockchain

## ⚠️ Disclaimer Legal

**Bullrook Power se proporciona "tal cual"** sin garantías expresas o implícitas. El usuario asume todos los riesgos asociados con el uso de esta aplicación.

- No somos responsables de pérdida de fondos
- Realiza tus propias investigaciones (DYOR)
- Las recompensas de staking varían según condiciones de red
- Consulta con un asesor financiero si es necesario

---

**Versión:** 2.0.0  
**Última Actualización:** Mayo 22, 2026  
**Estado:** ✅ Producción

🚀 **¡Comienza a minar con el poder del Toro!**
