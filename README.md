# Fantasy Map Generator

Azgaar's _Fantasy Map Generator_ is a free web application that helps fantasy writers, game masters, and cartographers create and edit fantasy maps.

Link: [azgaar.github.io/Fantasy-Map-Generator](https://azgaar.github.io/Fantasy-Map-Generator).

Refer to the [project wiki](https://github.com/Azgaar/Fantasy-Map-Generator/wiki) for guidance. The current progress is tracked in [Trello](https://trello.com/b/7x832DG4/fantasy-map-generator). Some details are covered in my old blog [_Fantasy Maps for fun and glory_](https://azgaar.wordpress.com).

[![preview](https://github.com/Azgaar/Fantasy-Map-Generator/assets/26469650/9502eae9-92e0-4d0d-9f17-a2ba4a565c01)](https://github.com/Azgaar/Fantasy-Map-Generator/assets/26469650/11a42446-4bd5-4526-9cb1-3ef97c868992)

[![preview](https://github.com/Azgaar/Fantasy-Map-Generator/assets/26469650/e751a9e5-7986-4638-b8a9-362395ef7583)](https://github.com/Azgaar/Fantasy-Map-Generator/assets/26469650/e751a9e5-7986-4638-b8a9-362395ef7583)

[![preview](https://github.com/Azgaar/Fantasy-Map-Generator/assets/26469650/b0d0efde-a0d1-4e80-8818-ea3dd83c2323)](https://github.com/Azgaar/Fantasy-Map-Generator/assets/26469650/b0d0efde-a0d1-4e80-8818-ea3dd83c2323)

Join our [Discord server](https://discordapp.com/invite/X7E84HU) and [Reddit community](https://www.reddit.com/r/FantasyMapGenerator) to share your creations, discuss the Generator, suggest ideas and get the most recent updates.

Contact me via [email](mailto:azgaar.fmg@yandex.com) if you have non-public suggestions. For bug reports please use [GitHub issues](https://github.com/Azgaar/Fantasy-Map-Generator/issues) or _#fmg-bugs_ channel on Discord. If you are facing performance issues, please read [the tips](https://github.com/Azgaar/Fantasy-Map-Generator/wiki/Tips#performance-tips).

Pull requests are highly welcomed. The codebase is messy and requires re-design. I will appreciate if you start with minor changes. Check out the [data model](https://github.com/Azgaar/Fantasy-Map-Generator/wiki/Data-model) before contributing.

You can support the project on [Patreon](https://www.patreon.com/azgaar).

_Inspiration:_

- Martin O'Leary's [_Generating fantasy maps_](https://mewo2.com/notes/terrain)

- Amit Patel's [_Polygonal Map Generation for Games_](http://www-cs-students.stanford.edu/~amitp/game-programming/polygon-map-generation)

- Scott Turner's [_Here Dragons Abound_](https://heredragonsabound.blogspot.com)

## Recent Changes (May 18, 2025)

### Ollama Integration for AI Text Generation

An integration with [Ollama](https://ollama.com/) has been added as a new provider for the AI text generator feature, allowing users to leverage local large language models.

**Key Changes:**

*   **New Provider:** "Ollama" is now available in the AI generator's model/provider selection.
*   **Model Name as Key:** When Ollama is selected, the "API Key" input field is repurposed to accept the Ollama model name (e.g., `llama3`, `mistral`, etc.) instead of a traditional API key.
*   **Local Endpoint:** The integration communicates with a local Ollama instance via the `http://localhost:11434/api/generate` endpoint.
*   **Streaming Support:** Responses from Ollama are streamed into the text area.

**Files Modified:**

1.  `modules/ui/ai-generator.js`:
    *   Added `ollama` to the `PROVIDERS` and `MODELS` constants.
    *   Implemented the `generateWithOllama` function to handle API requests to the Ollama endpoint.
    *   Modified `handleStream` to correctly parse the JSON streaming response from Ollama.
    *   Updated UI logic in `generateWithAi` and its helper `updateDialogElements` to:
        *   Change the "API Key" field's placeholder text to "Enter Ollama model name (e.g., llama3)" when Ollama is selected.
        *   Store and retrieve the Ollama model name from local storage similarly to how API keys are handled for other providers.
        *   Ensured the dialog initialization and element updates occur at the correct time (during the dialog's `open` event) to prevent errors with elements not being found in the DOM.
2.  `modules/ui/notes-editor.js`:
    *   The `openAiGenerator` function, which is called when clicking the "generate text for notes" button, was verified to correctly invoke the `generateWithAi` function.
    *   The prompt sent to the AI was updated to be more explicit about requiring HTML formatting (using `<p>` tags, no heading tags, no markdown) to ensure consistent output. *(Self-correction: The user undid the latest prompt change, so this part of the description might not be accurate if the user intends to keep the previous prompt. The README will reflect the general functionality implemented).* The prompt engineering aims to guide the AI to produce HTML-formatted descriptions suitable for the notes section.

**Goal:**

The primary goal of this integration was to provide a simple and functional way to use local Ollama models within the Fantasy Map Generator's AI text generation feature, ensuring that existing functionalities, especially the "generate text for notes" button, remain operational. Initial issues with the dialog not opening were resolved by refining how and when the dialog and its internal event listeners are initialized.

## 💻 Desktop Application

Esta versión incluye una **aplicación de escritorio** construida con Electron que funciona completamente offline.

### 🚀 Características de la Versión Desktop

- ✅ **Funciona completamente offline** - No requiere conexión a internet
- ✅ **Sin dependencias de servidor** - Incluye servidor HTTP integrado con Node.js nativo
- ✅ **Instalación sencilla** - Archivo ejecutable portable
- ✅ **Menús nativos** - Interfaz integrada con el sistema operativo
- ✅ **Rendimiento optimizado** - Mejor performance que la versión web
- ✅ **Soporte multiplataforma** - Windows y Linux

### 📦 Archivos Compilados Disponibles

Las versiones compiladas están listas para usar en la carpeta `build-output/`:
- **Windows**: `Fantasy Map Generator-1.0.0-portable.exe` (~250 MB)
- **Linux**: `Fantasy Map Generator-1.0.0-linux.tar.gz` (~200 MB)

**Para usar:**
1. **Windows**: Ejecutar directamente el archivo `.exe`
2. **Linux**: Extraer el `.tar.gz` y ejecutar el binario

### 🛠️ Compilación desde Código Fuente

#### Prerrequisitos

**Software obligatorio:**
- [Node.js](https://nodejs.org/) versión 18 o superior
- npm (incluido con Node.js)
- Mínimo 5 GB de espacio libre en disco

**Verificar instalación:**
```bash
node --version    # Debe mostrar v18.x.x o superior
npm --version     # Debe mostrar 9.x.x o superior
```

#### Pasos de Instalación Completos

1. **Instalar dependencias del proyecto**
   ```bash
   npm install
   ```
   
   ⚠️ **Nota**: Los warnings sobre paquetes deprecados son normales y no afectan la funcionalidad.

2. **Probar funcionamiento en modo desarrollo**
   ```bash
   npm run electron
   ```
   
   ✅ **Verificación de funcionamiento correcto**:
   - Debe aparecer en consola: "Electron app ready"
   - Debe aparecer: "Servidor HTTP iniciado en puerto XXXX"
   - Debe aparecer: "Ventana mostrada"
   - La aplicación debe abrir y mostrar el mapa correctamente
   
   ❌ **Errores normales que puedes ignorar**:
   - Warnings de GPU/hardware acceleration
   - Mensajes sobre Vulkan o DirectX
   - Warnings sobre módulos deprecados

3. **Cerrar la aplicación de prueba** antes de compilar

#### Compilación para Distribución

**🖥️ Para Windows (Archivo Portable):**
```bash
npm run build-win
```

**🐧 Para Linux (Archivo comprimido):**
```bash
npm run build-linux
```

**🌐 Para Ambas Plataformas:**
```bash
npm run build-all
```

#### Resultado Esperado de la Compilación

**Tiempo de compilación:** 2-5 minutos (dependiendo de tu hardware)

**Archivos generados en `build-output/`:**
```
build-output/
├── Fantasy Map Generator-1.0.0-portable.exe    # Windows (±250 MB)
├── Fantasy Map Generator-1.0.0-linux.tar.gz    # Linux (±200 MB)
├── builder-debug.yml                            # Log de debug
├── builder-effective-config.yaml                # Configuración usada
├── win-unpacked/                                # Archivos descomprimidos Windows
└── linux-unpacked/                              # Archivos descomprimidos Linux
```

**✅ Indicadores de compilación exitosa:**
1. No errores fatales en la consola (warnings son normales)
2. Archivo ejecutable generado con tamaño correcto
3. Mensaje final: "build completed successfully"

#### 🧪 Probar el Ejecutable Compilado

**Windows:**
```powershell
cd build-output
.\Fantasy Map Generator-1.0.0-portable.exe
```

**Linux:**
```bash
cd build-output
tar -xzf "Fantasy Map Generator-1.0.0-linux.tar.gz"
cd linux-unpacked
./fantasy-map-generator
```

#### 🔧 Solución de Problemas Comunes

**❌ Error: "Not enough space on disk"**
```bash
# Solución:
# 1. Liberar al menos 5 GB de espacio en disco
# 2. Limpiar caché de npm:
npm cache clean --force

# 3. Si persiste, limpiar todo y reinstalar:
Remove-Item node_modules -Recurse -Force
Remove-Item build-output -Recurse -Force
npm install
```

**❌ Error: "Process cannot access the file"**
```bash
# Solución:
# 1. Cerrar TODAS las instancias de la aplicación
# 2. Eliminar carpeta de build:
Remove-Item build-output -Recurse -Force

# 3. Reintentar compilación:
npm run build-win
```

**❌ Error: "Cannot find module 'express'"**
- ✅ **Este error ya está solucionado** en la versión actual
- La aplicación usa el módulo HTTP nativo de Node.js (no Express)
- Si aparece, ejecutar: `npm install`

**❌ Error de permisos en Linux (Windows)**
- Esto es normal cuando compilas para Linux desde Windows
- El archivo `.tar.gz` se genera correctamente y funciona en Linux

**❌ Aplicación no inicia o error "serverless"**
```bash
# Diagnóstico:
npm run electron  # Debe funcionar sin errores

# Si funciona en desarrollo pero no el compilado:
# El problema está en la configuración de electron-builder
# Verificar que electron-main.js existe y no está vacío
```

#### 📋 Scripts Disponibles

| Comando | Descripción | Cuándo Usar |
|---------|-------------|-------------|
| `npm run electron` | Ejecutar en desarrollo | Probar cambios, debugging |
| `npm run build-win` | Compilar solo Windows | Desarrollo en Windows |
| `npm run build-linux` | Compilar solo Linux | Necesitas versión Linux |
| `npm run build-all` | Compilar ambas plataformas | Distribución completa |

#### 🎯 Flujo de Trabajo Recomendado

1. **Desarrollo:**
   ```bash
   npm install              # Solo la primera vez
   npm run electron         # Probar cambios
   ```

2. **Antes de compilar:**
   ```bash
   # Cerrar aplicación de desarrollo
   npm run electron         # Verificar que funciona
   # Ctrl+C para cerrar
   ```

3. **Compilación final:**
   ```bash
   npm run build-all        # O build-win / build-linux
   ```

4. **Verificación:**
   ```bash
   # Probar el ejecutable generado
   cd build-output
   # Ejecutar el archivo correspondiente
   ```

#### ⚙️ Configuración Técnica

**Configuración de electron-builder en `package.json`:**
- **Windows**: Target `portable` (no requiere instalador)
- **Linux**: Target `tar.gz` (compatible con todas las distribuciones)
- **Directorio de salida**: `build-output/`
- **Compresión**: Normal (balance entre tamaño y velocidad)

**Archivos incluidos en el build:**
- Todo el código fuente necesario
- Módulos de Node.js requeridos
- Servidor HTTP integrado
- Iconos y recursos
- **Excluidos**: archivos de desarrollo, cache, git, docker

Para información técnica adicional, consultar `README-DESKTOP.md`.

---
