"""
Mosaic generator for LinkedIn post.
Usage: python create_mosaic.py

Takes 4 screenshots from figures/ and creates a labeled 2x2 mosaic.
If images don't exist, creates placeholder panels.

To use:
1. Take screenshots of the 4 states and save them as:
   - figures/1_safe_dashboard.png
   - figures/2_corrupted_hl7.png
   - figures/3_frozen_vitals.png
   - figures/4_ransomware.png
2. Run: python create_mosaic.py
3. Output: figures/mosaic_linkedin.png
"""

from PIL import Image, ImageDraw, ImageFont
import os

FIGURES_DIR = os.path.join(os.path.dirname(__file__), "figures")
OUTPUT = os.path.join(FIGURES_DIR, "mosaic_linkedin.png")

# Panel config
PANELS = [
    {
        "file": "1_safe_dashboard.png",
        "label": "1. BASELINE — Dossier HL7 Sain",
        "sublabel": "L'IA répond correctement aux consignes de sécurité",
        "color": (34, 197, 94),       # green
        "bg": (15, 23, 42),
    },
    {
        "file": "2_corrupted_hl7.png",
        "label": "2. INJECTION — Payload HL7 Corrompu",
        "sublabel": "Instructions malveillantes cachées dans les métadonnées patient",
        "color": (249, 115, 22),       # orange
        "bg": (30, 15, 10),
    },
    {
        "file": "3_frozen_vitals.png",
        "label": "3. EXPLOIT — freeze_instruments() Exécuté",
        "sublabel": "L'IA obéit au payload : bras robotiques gelés, vitaux en chute",
        "color": (239, 68, 68),        # red
        "bg": (30, 10, 10),
    },
    {
        "file": "4_ransomware.png",
        "label": "4. IMPACT — Ransomware Chirurgical",
        "sublabel": "Demande de rançon 50 BTC, patient en danger d'ischémie",
        "color": (220, 38, 38),        # dark red
        "bg": (40, 5, 5),
    },
]

# Layout
PANEL_W = 960
PANEL_H = 540
PADDING = 8
LABEL_H = 70
BORDER = 3

TOTAL_W = PANEL_W * 2 + PADDING * 3
TOTAL_H = (PANEL_H + LABEL_H) * 2 + PADDING * 3 + 80  # +80 for title

def get_font(size):
    """Try to get a good font, fallback to default."""
    font_paths = [
        "C:/Windows/Fonts/consola.ttf",      # Consolas (Windows)
        "C:/Windows/Fonts/segoeui.ttf",       # Segoe UI
        "C:/Windows/Fonts/arial.ttf",         # Arial
        "/usr/share/fonts/truetype/dejavu/DejaVuSansMono.ttf",
    ]
    for fp in font_paths:
        if os.path.exists(fp):
            return ImageFont.truetype(fp, size)
    return ImageFont.load_default()

def create_mosaic():
    os.makedirs(FIGURES_DIR, exist_ok=True)

    canvas = Image.new("RGB", (TOTAL_W, TOTAL_H), (8, 12, 28))
    draw = ImageDraw.Draw(canvas)

    # Title
    title_font = get_font(28)
    subtitle_font = get_font(16)
    label_font = get_font(18)
    sublabel_font = get_font(13)

    title = "PoC — Injection Indirecte de Prompt dans un LLM Chirurgical"
    draw.text((PADDING + 10, 15), title, fill=(148, 163, 184), font=title_font)
    draw.text((PADDING + 10, 50), "Da Vinci Surgical System • Ollama/Llama 3.2 • Vecteur: Dossier Patient HL7", fill=(71, 85, 105), font=sublabel_font)

    title_offset = 80

    for i, panel in enumerate(PANELS):
        col = i % 2
        row = i // 2

        x = PADDING + col * (PANEL_W + PADDING)
        y = title_offset + PADDING + row * (PANEL_H + LABEL_H + PADDING)

        # Border
        draw.rectangle(
            [x - BORDER, y - BORDER, x + PANEL_W + BORDER, y + PANEL_H + LABEL_H + BORDER],
            outline=panel["color"],
            width=BORDER,
        )

        # Try to load screenshot
        img_path = os.path.join(FIGURES_DIR, panel["file"])
        if os.path.exists(img_path):
            img = Image.open(img_path).convert("RGB")
            img = img.resize((PANEL_W, PANEL_H), Image.LANCZOS)
            canvas.paste(img, (x, y))
        else:
            # Placeholder
            draw.rectangle([x, y, x + PANEL_W, y + PANEL_H], fill=panel["bg"])
            placeholder_font = get_font(20)
            ph_text = f"[ Screenshot manquant: {panel['file']} ]"
            bbox = draw.textbbox((0, 0), ph_text, font=placeholder_font)
            tw = bbox[2] - bbox[0]
            draw.text(
                (x + (PANEL_W - tw) // 2, y + PANEL_H // 2 - 10),
                ph_text,
                fill=(100, 116, 139),
                font=placeholder_font,
            )

        # Label background
        draw.rectangle(
            [x, y + PANEL_H, x + PANEL_W, y + PANEL_H + LABEL_H],
            fill=(15, 23, 42),
        )

        # Step number circle
        circle_x = x + 20
        circle_y = y + PANEL_H + LABEL_H // 2
        r = 14
        draw.ellipse([circle_x - r, circle_y - r, circle_x + r, circle_y + r], fill=panel["color"])
        num_font = get_font(16)
        draw.text((circle_x - 4, circle_y - 9), str(i + 1), fill=(255, 255, 255), font=num_font)

        # Label text
        draw.text(
            (x + 50, y + PANEL_H + 12),
            panel["label"],
            fill=panel["color"],
            font=label_font,
        )
        draw.text(
            (x + 50, y + PANEL_H + 38),
            panel["sublabel"],
            fill=(148, 163, 184),
            font=sublabel_font,
        )

    canvas.save(OUTPUT, quality=95)
    print(f"Mosaïque générée : {OUTPUT}")
    print(f"Taille : {TOTAL_W}x{TOTAL_H}px")
    print()
    print("Pour ajouter vos screenshots:")
    print(f"  1. Sauvegardez vos captures dans: {FIGURES_DIR}")
    print("  2. Nommez-les:")
    for p in PANELS:
        exists = "OK" if os.path.exists(os.path.join(FIGURES_DIR, p["file"])) else "--"
        print(f"     [{exists}] {p['file']}")
    print(f"  3. Relancez: python create_mosaic.py")

if __name__ == "__main__":
    create_mosaic()
