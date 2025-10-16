# Generar imágenes de pasos (guía)

Este proyecto **no** genera imágenes en producción ni a través de una API automática.
Sin embargo, para reproducir las imágenes de pasos (step_1..step_10) localmente se incluyen scripts y una guía para generarlas a partir de una `final.png`.

> Objetivo: crear imágenes `step_1.png` .. `step_10.png` que muestren la evolución del ruido a la imagen final.

Requisitos:
- Python 3.10+
- pip
- Pillow, numpy

Instalación de dependencias:

```powershell
# En PowerShell
python -m pip install --upgrade pip
python -m pip install pillow numpy
```

Scripts incluidos:
- `create_progressive_images.py` — Genera `step_1..step_10.png` en cada carpeta de caso con un `final.png`.
- `generate_noise_images.py` — Genera overlays `noise_step_2..noise_step_9.png` en `frontend/public/static/noise`.

Uso básico:

```powershell
# Generar pasos para todos los casos
python create_progressive_images.py

# Generar pasos para un caso específico
python create_progressive_images.py --case flux-1

# Generar imágenes de ruido (pasos 2-9) en tamaño 1024x1536
python generate_noise_images.py --outdir frontend/public/static/noise --width 1024 --height 1536
```

Estructura de archivos esperada (por caso):
```
frontend/public/static/cases/<case>/
  prompt.txt
  description.txt
  final.png            # Imagen final (or final.webp)
  step_1.png
  step_2.png
  ...
  step_10.png
```

Notas y recomendaciones:
- Los scripts funcionan localmente y **no** envían nada a servicios externos.
- Las imágenes generadas pueden ocupar espacio. Mantén un directorio `frontend/public/static/generated` si deseas guardar GIFs resultantes.
- Si las imágenes originales están en formato `webp`, renómbralas a `final.png` o ajusta el script para aceptar `.webp`.

Opcional: integración con servicios de generación (Replicate, Stable Diffusion)
- Si prefieres regenerar las imágenes finales desde prompts, puedes usar servicios como Replicate o una instancia local de SD. Esa parte no está automatizada en los scripts incluidos.

Ejemplo de snippet para Replicate (solo referencia):

```python
# pseudocode (no incluido como script integrado)
import replicate
client = replicate.Client(api_token="<REPLICATE_TOKEN>")
model = client.models.get("stability-ai/stable-diffusion")
output = model.predict(prompt="...", width=1024, height=1536)
```

Advertencia de privacidad:
- Si usas imágenes con rostros identificables, respeta las leyes locales y la privacidad de las personas.

---

Si quieres, puedo ejecutar los scripts en tu máquina (si das permiso) para generar los pasos y las imágenes de ruido. No subiré nada a GitHub ni a servicios externos sin tu autorización.