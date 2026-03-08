"""
Mosaic generator for LinkedIn post.
Usage: python create_mosaic.py

Layout:
  - Title bar
  - 2x2 grid: 4 attack scenario panels
  - Full-width bottom: pedagogical "Behind the Scenes" panel
  - Footer

Supports .png, .jpg, .jpeg, .webp files.
Output: figures/mosaic_linkedin.png
"""

from PIL import Image, ImageDraw, ImageFont
import os

FIGURES_DIR = os.path.join(os.path.dirname(__file__), "figures")
OUTPUT = os.path.join(FIGURES_DIR, "mosaic_linkedin.png")

# --- 4 attack panels (2x2 grid) ---
PANELS = [
    {
        "file": "1_safe_dashboard",
        "label": "1. BASELINE",
        "sublabel": "Dossier HL7 sain — l'IA repond correctement",
        "color": (34, 197, 94),       # green
        "bg": (15, 23, 42),
    },
    {
        "file": "2_corrupted_hl7",
        "label": "2. INJECTION",
        "sublabel": "Payload malveillant cache dans les metadonnees HL7",
        "color": (249, 115, 22),       # orange
        "bg": (30, 15, 10),
    },
    {
        "file": "3_frozen_vitals",
        "label": "3. EXPLOIT",
        "sublabel": "freeze_instruments() execute — bras geles",
        "color": (239, 68, 68),        # red
        "bg": (30, 10, 10),
    },
    {
        "file": "4_ransomware",
        "label": "4. IMPACT",
        "sublabel": "Ransomware chirurgical — 50 BTC, patient en danger",
        "color": (220, 38, 38),        # dark red
        "bg": (40, 5, 5),
    },
]

# --- Bottom pedagogical panel ---
BOTTOM_PANEL = {
    "file": "5_help_modal",
    "label": "BEHIND THE SCENES — Anatomie de l'Attaque par Prompt Injection",
    "sublabel": "Module pedagogique integre : kill chain, vecteurs, defenses multi-agents",
    "color": (139, 92, 246),          # purple
    "bg": (20, 10, 35),
}


def find_image(base_name):
    """Find image file with any supported extension."""
    for ext in [".png", ".jpg", ".jpeg", ".webp"]:
        path = os.path.join(FIGURES_DIR, base_name + ext)
        if os.path.exists(path):
            return path
    return None


# Layout constants
PANEL_W = 960
PANEL_H = 540
PADDING = 8
LABEL_H = 60
BORDER = 3
TITLE_H = 80
FOOTER_H = 40

# Bottom panel: full width, shorter height
BOTTOM_H = 380
BOTTOM_LABEL_H = 50

TOTAL_W = PANEL_W * 2 + PADDING * 3
TOTAL_H = (TITLE_H
           + (PANEL_H + LABEL_H) * 2 + PADDING * 3
           + PADDING
           + BOTTOM_H + BOTTOM_LABEL_H
           + PADDING
           + FOOTER_H)


def get_font(size):
    """Try to get a good font, fallback to default."""
    font_paths = [
        "C:/Windows/Fonts/consola.ttf",
        "C:/Windows/Fonts/segoeui.ttf",
        "C:/Windows/Fonts/arial.ttf",
        "/usr/share/fonts/truetype/dejavu/DejaVuSansMono.ttf",
    ]
    for fp in font_paths:
        if os.path.exists(fp):
            return ImageFont.truetype(fp, size)
    return ImageFont.load_default()


def draw_panel(draw, canvas, x, y, w, h, label_h, panel, index, label_font, sublabel_font):
    """Draw a single panel with border, image, and label."""
    # Border
    draw.rectangle(
        [x - BORDER, y - BORDER, x + w + BORDER, y + h + label_h + BORDER],
        outline=panel["color"],
        width=BORDER,
    )

    # Image
    img_path = find_image(panel["file"])
    if img_path:
        img = Image.open(img_path).convert("RGB")
        img = img.resize((w, h), Image.LANCZOS)
        canvas.paste(img, (x, y))
    else:
        draw.rectangle([x, y, x + w, y + h], fill=panel["bg"])
        ph_font = get_font(18)
        ph_text = f"[ Screenshot manquant: {panel['file']}.* ]"
        bbox = draw.textbbox((0, 0), ph_text, font=ph_font)
        tw = bbox[2] - bbox[0]
        draw.text(
            (x + (w - tw) // 2, y + h // 2 - 10),
            ph_text, fill=(100, 116, 139), font=ph_font,
        )

    # Label background
    draw.rectangle(
        [x, y + h, x + w, y + h + label_h],
        fill=(15, 23, 42),
    )

    # Step number circle
    if index is not None:
        cx = x + 20
        cy = y + h + label_h // 2
        r = 12
        draw.ellipse([cx - r, cy - r, cx + r, cy + r], fill=panel["color"])
        num_font = get_font(14)
        draw.text((cx - 4, cy - 8), str(index), fill=(255, 255, 255), font=num_font)
        text_x = x + 44
    else:
        # No circle, use a colored bar instead
        draw.rectangle([x, y + h, x + 4, y + h + label_h], fill=panel["color"])
        text_x = x + 16

    # Label text
    draw.text(
        (text_x, y + h + 8),
        panel["label"],
        fill=panel["color"],
        font=label_font,
    )
    draw.text(
        (text_x, y + h + 30),
        panel["sublabel"],
        fill=(148, 163, 184),
        font=sublabel_font,
    )


def create_mosaic():
    os.makedirs(FIGURES_DIR, exist_ok=True)

    canvas = Image.new("RGB", (TOTAL_W, TOTAL_H), (8, 12, 28))
    draw = ImageDraw.Draw(canvas)

    # Fonts
    title_font = get_font(26)
    subtitle_font = get_font(14)
    label_font = get_font(16)
    sublabel_font = get_font(12)

    # ---- TITLE BAR ----
    title = "PoC : Injection Indirecte de Prompt dans un LLM Chirurgical"
    draw.text((PADDING + 10, 15), title, fill=(148, 163, 184), font=title_font)
    draw.text(
        (PADDING + 10, 48),
        "Da Vinci Surgical System  |  Ollama / Llama 3.2  |  Vecteur : Dossier Patient HL7 v2.3",
        fill=(71, 85, 105), font=subtitle_font,
    )

    # Thin separator line
    draw.line(
        [(PADDING, TITLE_H - 4), (TOTAL_W - PADDING, TITLE_H - 4)],
        fill=(30, 41, 59), width=1,
    )

    # ---- 2x2 ATTACK PANELS ----
    y_start = TITLE_H

    for i, panel in enumerate(PANELS):
        col = i % 2
        row = i // 2
        x = PADDING + col * (PANEL_W + PADDING)
        y = y_start + PADDING + row * (PANEL_H + LABEL_H + PADDING)
        draw_panel(draw, canvas, x, y, PANEL_W, PANEL_H, LABEL_H, panel, i + 1, label_font, sublabel_font)

    # ---- ARROW / SEPARATOR between attack grid and bottom panel ----
    grid_bottom = y_start + PADDING + 2 * (PANEL_H + LABEL_H + PADDING)
    sep_y = grid_bottom + PADDING // 2

    # Draw a subtle "how it works" separator
    sep_label_font = get_font(13)
    sep_text = "--- MODULE PEDAGOGIQUE INTEGRE ---"
    bbox = draw.textbbox((0, 0), sep_text, font=sep_label_font)
    tw = bbox[2] - bbox[0]
    sx = (TOTAL_W - tw) // 2
    draw.line([(PADDING + 20, sep_y + 7), (sx - 10, sep_y + 7)], fill=(139, 92, 246, 80), width=1)
    draw.text((sx, sep_y), sep_text, fill=(139, 92, 246), font=sep_label_font)
    draw.line([(sx + tw + 10, sep_y + 7), (TOTAL_W - PADDING - 20, sep_y + 7)], fill=(139, 92, 246, 80), width=1)

    # ---- BOTTOM PANEL: BEHIND THE SCENES ----
    bottom_y = sep_y + 20
    bottom_w = TOTAL_W - PADDING * 2
    draw_panel(
        draw, canvas,
        PADDING, bottom_y, bottom_w, BOTTOM_H, BOTTOM_LABEL_H,
        BOTTOM_PANEL, None, label_font, sublabel_font,
    )

    # ---- FOOTER ----
    footer_y = TOTAL_H - FOOTER_H + 5
    footer_font = get_font(11)
    draw.text(
        (PADDING + 10, footer_y),
        "github.com/your-repo  |  PoC Educatif  |  Sensibilisation RSSI & Ingenieurs Biomedicaux",
        fill=(51, 65, 85), font=footer_font,
    )
    draw.text(
        (TOTAL_W - 280, footer_y),
        "Version Alpha — Open Source & Collaboration",
        fill=(51, 65, 85), font=footer_font,
    )

    # ---- SAVE ----
    canvas.save(OUTPUT, quality=95)
    print(f"Mosaique generee : {OUTPUT}")
    print(f"Taille : {TOTAL_W}x{TOTAL_H}px")
    print()
    print("Panels:")
    for p in PANELS + [BOTTOM_PANEL]:
        found = find_image(p["file"])
        status = f"OK ({os.path.basename(found)})" if found else "MANQUANT"
        print(f"  [{status}] {p['file']}.*")


if __name__ == "__main__":
    create_mosaic()
