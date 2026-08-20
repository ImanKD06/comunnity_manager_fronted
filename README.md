<<<<<<< HEAD
# Community Manager — Frontend (React + Vite)

Frontend en blanco y verde para tu API de FastAPI, con las 5 pantallas que pediste:
Dashboard, Communities, Neighbors, Payments y Expenses, cada una con su CRUD completo (GET → POST → PUT → DELETE).

## 🚀 Cómo arrancarlo

```bash
cd community-manager
npm install
npm run dev
```

Se abrirá en `http://localhost:5173`. Tu API de FastAPI debe estar corriendo en `http://127.0.0.1:8000` (como ya tienes en tu `app.jsx` original).

## ⚠️ Importante: CORS en FastAPI

Como el frontend (puerto 5173) y el backend (puerto 8000) son orígenes distintos, el navegador bloqueará las peticiones si no añades el middleware de CORS. En tu `main.py`:

```python
from fastapi.middleware.cors import CORSMiddleware

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

Sin esto, verás errores de tipo "Failed to fetch" o "CORS policy" en la consola aunque el backend funcione bien en Swagger.

## ⚠️ Importante: ruta de Payments

En tu `payments.py` el router está montado como:

```python
router = APIRouter(prefix="/payment", tags=["Payments"])  # singular
```

Pero en tu especificación la pantalla se llama "Payments" y la ruta del frontend es `/payments`. Esto **no es un error** — son cosas distintas:

- **Ruta del frontend** (React Router): `/payments` → así se pidió en el enunciado.
- **Endpoints de la API** (FastAPI): `/payment/...` → así está en tu backend real.

En `src/services/api.js` ya está todo apuntando correctamente a `/payment/...`. Si en el futuro cambias el prefix del router a `/payments`, solo tienes que actualizar `BASE_URL`/rutas en ese archivo.

## 🤖 Funciones con IA (Incidencias y Actas)

Estas pantallas incluyen generación asistida por IA usando tu endpoint `/ai/...` (Llama 3.1 vía Ollama):

- **Incidents**: botón "✨ Analizar con IA" junto al campo Descripción. Llama a `POST /ai/analyze-incident` y muestra categoría, prioridad sugerida y una recomendación de la IA. Si la prioridad sugerida coincide con una de las opciones del desplegable, aparece un botón "Usar esta prioridad" para aplicarla directamente.
- **Actas**: dentro del formulario hay dos botones para el contenido:
  - "📝 Plantilla rápida" → usa `POST /actas/generate` (plantilla simple, sin IA, instantánea).
  - "✨ Generar con IA" → usa `POST /ai/generate-minute` (Llama 3.1 redacta el acta completa, puede tardar varios segundos).

**Importante:** para que estos botones funcionen, además de tu API de FastAPI, necesitas tener **Ollama corriendo** en tu máquina con el modelo `llama3.1:8b` descargado:

```powershell
ollama pull llama3.1:8b
ollama serve
```

Si Ollama no está corriendo, verás un mensaje de error en el formulario ("No se pudo analizar/generar... comprueba que Ollama esté corriendo") en vez de que la app se rompa.

## 📁 Estructura

```
src/
├── components/
│   ├── Navbar.jsx
│   ├── CommunityForm.jsx
│   ├── NeighborForm.jsx
│   ├── PaymentForm.jsx
│   └── ExpenseForm.jsx
├── pages/
│   ├── Dashboard.jsx
│   ├── Communities.jsx
│   ├── Neighbors.jsx
│   ├── Payments.jsx
│   └── Expenses.jsx
├── services/
│   └── api.js
├── App.jsx
└── main.jsx
```

## 🎨 Diseño

- Sidebar fijo en verde oscuro con los 5 accesos (Dashboard, Communities, Neighbors, Payments, Expenses).
- Fondo blanco/verde muy claro, tarjetas con bordes suaves y sombra ligera.
- Formularios de creación/edición como modal (mismo componente sirve para crear y editar, según si recibe `initialData`).
- Estados vacíos, loading y errores manejados en cada pantalla.
- Pagos: badge verde "Pagado" / ámbar "Pendiente", y botón directo "Marcar como pagado" que llama a `PUT /payment/{id}/pay`.

## 🔜 Siguiente paso sugerido

Tal y como planteaste: ya tienes las 5 pantallas completas. Te recomiendo:
1. Levantar el backend con CORS activado.
2. Probar `Communities` primero (es el CRUD que ya dominas).
3. Ir a `Neighbors`, luego `Payments`, luego `Expenses`.
=======
# comunnity_manager_fronted
>>>>>>> eff8adb628bf411e130a990cad0c8d69d8c78e9c
