"""
LoveDrop Official Motion Graphics Promo Reel Generator (v2 - Pixel Perfect)
Output: 1080x1920 (9:16 Vertical Video for Instagram Reels / Shorts / TikTok)
Audio: Synced background music with smooth fade in/out
"""

import os
import math
import random
import time
import numpy as np
from PIL import Image, ImageDraw, ImageFont, ImageFilter
import av

# -------------------------------------------------------------
# Configuration
# -------------------------------------------------------------
WIDTH = 1080
HEIGHT = 1920
FPS = 30
DURATION_SEC = 16.5
TOTAL_FRAMES = int(DURATION_SEC * FPS) # 495 frames
OUTPUT_DIR = "public/videos"
OUTPUT_FILE = os.path.join(OUTPUT_DIR, "lovedrop-promo-reel.mp4")
AUDIO_FILE = "public/music/love-bgm.mp3"

os.makedirs(OUTPUT_DIR, exist_ok=True)

# Typography setup (Segoe UI Bold & Regular)
FONTS_DIR = "C:/Windows/Fonts"
font_bold_huge = ImageFont.truetype(os.path.join(FONTS_DIR, "segoeuib.ttf"), 68)
font_bold_large = ImageFont.truetype(os.path.join(FONTS_DIR, "segoeuib.ttf"), 50)
font_bold_med = ImageFont.truetype(os.path.join(FONTS_DIR, "segoeuib.ttf"), 38)
font_bold_small = ImageFont.truetype(os.path.join(FONTS_DIR, "segoeuib.ttf"), 28)
font_bold_micro = ImageFont.truetype(os.path.join(FONTS_DIR, "segoeuib.ttf"), 22)
font_regular_med = ImageFont.truetype(os.path.join(FONTS_DIR, "segoeui.ttf"), 34)
font_regular_small = ImageFont.truetype(os.path.join(FONTS_DIR, "segoeui.ttf"), 26)

# Load Brand Assets
logo_img = Image.open("public/logo.png").convert("RGBA")
cat_sticker = Image.open("public/stickers/intro_sticker.webp").convert("RGBA")
cat_runaway = Image.open("public/stickers/no1_sticker.webp").convert("RGBA")
sample1 = Image.open("public/images/sample1.jpg").convert("RGB")
sample2 = Image.open("public/images/sample2.jpg").convert("RGB")
sample3 = Image.open("public/images/sample3.jpg").convert("RGB")

# Pre-generate floating particles for smooth determinism
random.seed(42)
PARTICLES = [
    {
        "x": random.randint(50, WIDTH - 50),
        "y": random.randint(100, HEIGHT + 200),
        "speed": random.uniform(1.2, 2.8),
        "size": random.randint(20, 50),
        "phase": random.uniform(0, math.pi * 2),
        "type": random.choice(["heart", "sparkle", "orb"])
    }
    for _ in range(35)
]

# Confetti particles for celebrations
CONFETTI = [
    {
        "x": WIDTH // 2 + random.randint(-40, 40),
        "y": HEIGHT // 2 + 100 + random.randint(-40, 40),
        "vx": random.uniform(-14, 14),
        "vy": random.uniform(-25, -8),
        "color": random.choice([
            (255, 77, 99), (255, 182, 193), (255, 215, 0),
            (255, 105, 180), (147, 112, 219), (255, 255, 255)
        ]),
        "size": random.randint(10, 22),
        "rot": random.uniform(0, 360),
        "vrot": random.uniform(-15, 15)
    }
    for _ in range(80)
]

def draw_heart(draw, cx, cy, size, color):
    """Draw a vector heart at cx, cy"""
    half = size / 2
    pts = []
    steps = 28
    for i in range(steps):
        t = i / steps * 2 * math.pi
        x = 16 * (math.sin(t) ** 3)
        y = -(13 * math.cos(t) - 5 * math.cos(2*t) - 2 * math.cos(3*t) - math.cos(4*t))
        pts.append((cx + x * (half / 16), cy + y * (half / 16)))
    draw.polygon(pts, fill=color)

def draw_star(draw, cx, cy, size, color):
    """Draw a 4-point sparkle star"""
    pts = [
        (cx, cy - size),
        (cx + size * 0.25, cy - size * 0.25),
        (cx + size, cy),
        (cx + size * 0.25, cy + size * 0.25),
        (cx, cy + size),
        (cx - size * 0.25, cy + size * 0.25),
        (cx - size, cy),
        (cx - size * 0.25, cy - size * 0.25),
    ]
    draw.polygon(pts, fill=color)

def draw_pill(draw, box, fill, outline=None, width=1):
    """Draw a rounded pill button"""
    draw.rounded_rectangle(box, radius=(box[3] - box[1]) // 2, fill=fill, outline=outline, width=width)

def draw_card(draw, box, radius, fill, outline=None, width=1):
    """Draw a smooth rounded card"""
    draw.rounded_rectangle(box, radius=radius, fill=fill, outline=outline, width=width)

def make_gradient():
    base = Image.new("RGB", (WIDTH, HEIGHT), (255, 255, 255))
    draw = ImageDraw.Draw(base)
    for y in range(HEIGHT):
        f = y / HEIGHT
        if f < 0.5:
            t = f / 0.5
            r = int(255 * (1 - t) + 255 * t)
            g = int(240 * (1 - t) + 200 * t)
            b = int(245 * (1 - t) + 220 * t)
        else:
            t = (f - 0.5) / 0.5
            r = int(255 * (1 - t) + 244 * t)
            g = int(200 * (1 - t) + 85 * t)
            b = int(220 * (1 - t) + 115 * t)
        draw.line([(0, y), (WIDTH, y)], fill=(r, g, b))
    return base.convert("RGBA")

STATIC_BG = make_gradient()

def render_frame(frame_idx):
    """Render a single frame of the motion graphic video"""
    t = frame_idx / FPS

    # 1. Background
    img = STATIC_BG.copy()
    draw = ImageDraw.Draw(img)

    # 2. Ambient Floating Hearts & Sparkles in Background
    for p in PARTICLES:
        cur_y = int((p["y"] - (t * p["speed"] * 60)) % (HEIGHT + 200)) - 100
        cur_x = int(p["x"] + math.sin(t * 2 + p["phase"]) * 35)
        alpha = int(100 + math.sin(t * 3 + p["phase"]) * 40)
        heart_color = (255, 140, 165, alpha)

        if p["type"] == "heart":
            draw_heart(draw, cur_x, cur_y, p["size"], heart_color)
        elif p["type"] == "sparkle":
            draw_star(draw, cur_x, cur_y, p["size"] // 2, (255, 255, 255, alpha))
        elif p["type"] == "orb":
            draw.ellipse(
                (cur_x - p["size"]//2, cur_y - p["size"]//2, cur_x + p["size"]//2, cur_y + p["size"]//2),
                fill=(255, 255, 255, int(alpha * 0.6))
            )

    # Top Brand Sticky Pill on All Scenes
    brand_pill_y = 65
    draw_pill(draw, (WIDTH//2 - 200, brand_pill_y, WIDTH//2 + 200, brand_pill_y + 58), fill=(255, 255, 255, 235), outline=(255, 180, 195, 255), width=2)
    mini_logo = logo_img.resize((38, 38), Image.Resampling.LANCZOS)
    img.paste(mini_logo, (WIDTH//2 - 180, brand_pill_y + 10), mini_logo)
    draw.text((WIDTH//2 - 130, brand_pill_y + 12), "LoveDrop.online", fill=(225, 29, 72), font=font_bold_small)

    # ---------------------------------------------------------
    # SCENE 1: THE VIRAL HOOK (0s - 2.8s, Frames 0 to 84)
    # ---------------------------------------------------------
    if frame_idx < 85:
        st = frame_idx / 30.0 # 0 to 2.8s
        scale = min(1.0, st * 3.5)
        hook_y = int(450 - (1.0 - scale) * 80)

        # Alert Badge
        badge_box = (WIDTH//2 - 290, hook_y - 120, WIDTH//2 + 290, hook_y - 65)
        draw_pill(draw, badge_box, fill=(255, 241, 242, 245), outline=(244, 63, 94, 255), width=2)
        draw.text((WIDTH//2 - 265, hook_y - 110), "TIRED OF BORING GIFTS?", fill=(225, 29, 72), font=font_bold_small)

        # Main Bold Problem Headline
        draw.text((WIDTH//2 - 380, hook_y), "Chocolates & Flowers", fill=(30, 41, 59), font=font_bold_huge)
        draw.text((WIDTH//2 - 340, hook_y + 85), "Get Forgotten in 2 Days.", fill=(100, 116, 139), font=font_bold_large)

        # Red Animated Cross-out Line
        if st > 0.8:
            cross_prog = min(1.0, (st - 0.8) * 4.0)
            x_start = WIDTH//2 - 390
            x_end = x_start + int(780 * cross_prog)
            draw.line([(x_start, hook_y + 45), (x_end, hook_y + 45)], fill=(225, 29, 72), width=8)

        # Transition Solution Card (Slides in from bottom)
        if st > 1.2:
            card_prog = min(1.0, (st - 1.2) * 3.0)
            sol_y = int(1200 - card_prog * 350)
            card_box = (WIDTH//2 - 440, sol_y, WIDTH//2 + 440, sol_y + 360)
            draw_card(draw, card_box, 36, fill=(255, 255, 255, 250), outline=(255, 200, 215, 255), width=3)

            # Sparkle Badge
            draw.text((WIDTH//2 - 300, sol_y + 40), "GIVE THEM SOMETHING REAL", fill=(225, 29, 72), font=font_bold_small)
            draw.text((WIDTH//2 - 380, sol_y + 95), "A Personal Romantic Website", fill=(15, 23, 42), font=font_bold_large)
            draw.text((WIDTH//2 - 300, sol_y + 165), "Made specifically for them", fill=(71, 85, 105), font=font_bold_med)
            draw_heart(draw, WIDTH//2 + 215, sol_y + 185, 26, (225, 29, 72))

            # Feature bullets preview
            draw_pill(draw, (WIDTH//2 - 380, sol_y + 250, WIDTH//2 + 380, sol_y + 315), fill=(255, 241, 242), outline=(244, 63, 94), width=1)
            draw.text((WIDTH//2 - 350, sol_y + 268), "Wax-Seal Letter  •  Runaway 'NO'  •  Polaroids", fill=(190, 24, 93), font=font_bold_small)

    # ---------------------------------------------------------
    # SCENE 2: THE DIGITAL WAX-SEAL SURPRISE (2.8s - 5.8s, Frames 85 to 174)
    # ---------------------------------------------------------
    elif frame_idx < 175:
        st = (frame_idx - 85) / 30.0 # 0 to 3.0s

        # Chapter Pill
        chap_y = 170
        draw_pill(draw, (WIDTH//2 - 270, chap_y, WIDTH//2 + 270, chap_y + 56), fill=(255, 255, 255, 245), outline=(244, 63, 94), width=2)
        draw.text((WIDTH//2 - 240, chap_y + 11), "CHAPTER 1: WAX-SEAL LETTER", fill=(225, 29, 72), font=font_bold_small)

        # Big 3D Phone Screen Mockup
        phone_w, phone_h = 760, 1300
        phone_x = WIDTH//2 - phone_w // 2
        phone_y = 260
        # Phone body
        draw_card(draw, (phone_x - 12, phone_y - 12, phone_x + phone_w + 12, phone_y + phone_h + 12), 48, fill=(30, 41, 59), outline=(71, 85, 105), width=3)
        # Phone screen
        draw_card(draw, (phone_x, phone_y, phone_x + phone_w, phone_y + phone_h), 40, fill=(253, 248, 246))

        # Dynamic Island
        draw_pill(draw, (WIDTH//2 - 80, phone_y + 16, WIDTH//2 + 80, phone_y + 44), fill=(15, 23, 42))

        # Envelope
        env_w, env_h = 640, 440
        env_x = WIDTH//2 - env_w // 2
        env_y = phone_y + 180

        draw_card(draw, (env_x, env_y, env_x + env_w, env_y + env_h), 24, fill=(255, 253, 249), outline=(230, 205, 185), width=3)
        draw.text((env_x + 50, env_y + 50), "SPECIAL AIR MAIL", fill=(180, 150, 130), font=font_bold_micro)
        draw.line([(env_x + 50, env_y + 80), (env_x + 220, env_y + 80)], fill=(200, 175, 155), width=2)

        draw.text((env_x + 50, env_y + 130), "To: My Soulmate Sarah", fill=(140, 40, 60), font=font_bold_med)
        draw_heart(draw, env_x + 470, env_y + 150, 26, (225, 29, 72))
        draw.text((env_x + 50, env_y + 185), "From: Michael (Forever Yours)", fill=(100, 116, 139), font=font_regular_small)

        # Wax Seal in Center
        seal_cx, seal_cy = WIDTH//2, env_y + 290
        seal_r = 54

        if st < 1.0:
            draw.ellipse((seal_cx - seal_r, seal_cy - seal_r, seal_cx + seal_r, seal_cy + seal_r), fill=(225, 29, 72), outline=(159, 18, 57), width=4)
            draw_heart(draw, seal_cx, seal_cy, 44, (255, 255, 255))
            draw.text((WIDTH//2 - 145, phone_y + 720), "TAP TO BREAK SEAL", fill=(225, 29, 72), font=font_bold_small)
        else:
            letter_prog = min(1.0, (st - 1.0) * 2.2)
            letter_y = int((phone_y + 650) - letter_prog * 380)

            # Sparkles
            for i in range(12):
                sp_ang = i * (math.pi / 6)
                sp_dist = 65 + letter_prog * 45
                sx = seal_cx + int(math.cos(sp_ang) * sp_dist)
                sy = seal_cy + int(math.sin(sp_ang) * sp_dist)
                draw.ellipse((sx-5, sy-5, sx+5, sy+5), fill=(255, 215, 0))

            # Letter sliding up
            let_w, let_h = 600, 480
            let_x = WIDTH//2 - let_w // 2
            draw_card(draw, (let_x, letter_y, let_x + let_w, letter_y + let_h), 20, fill=(255, 255, 255), outline=(244, 114, 182), width=3)

            draw.text((let_x + 40, letter_y + 40), "My Dearest Sarah", fill=(190, 24, 93), font=font_bold_med)
            draw_heart(draw, let_x + 360, letter_y + 60, 24, (225, 29, 72))
            draw.line([(let_x + 40, letter_y + 90), (let_x + 560, letter_y + 90)], fill=(253, 164, 175), width=2)

            letter_lines = [
                "From the moment I met you,",
                "my whole world became brighter.",
                "Your laugh is my favorite sound.",
                "I built this entire website just to tell",
                "you how deeply I love you..."
            ]
            for idx, line in enumerate(letter_lines):
                draw.text((let_x + 40, letter_y + 115 + idx * 46), line, fill=(51, 65, 85), font=font_regular_small)

        # Bottom Caption Pill
        draw_pill(draw, (WIDTH//2 - 360, HEIGHT - 180, WIDTH//2 + 360, HEIGHT - 95), fill=(255, 255, 255, 245), outline=(225, 29, 72), width=2)
        draw.text((WIDTH//2 - 325, HEIGHT - 150), "Handwritten Digital Wax-Seal Letter", fill=(190, 24, 93), font=font_bold_med)

    # ---------------------------------------------------------
    # SCENE 3: THE RUNAWAY 'NO' BUTTON (5.8s - 9.2s, Frames 175 to 275)
    # ---------------------------------------------------------
    elif frame_idx < 276:
        st = (frame_idx - 175) / 30.0 # 0 to 3.3s

        # Chapter Pill
        chap_y = 170
        draw_pill(draw, (WIDTH//2 - 270, chap_y, WIDTH//2 + 270, chap_y + 56), fill=(255, 255, 255, 245), outline=(244, 63, 94), width=2)
        draw.text((WIDTH//2 - 240, chap_y + 11), "CHAPTER 2: PROPOSAL QUESTION", fill=(225, 29, 72), font=font_bold_small)

        # Phone Frame
        phone_w, phone_h = 760, 1300
        phone_x = WIDTH//2 - phone_w // 2
        phone_y = 260
        draw_card(draw, (phone_x - 12, phone_y - 12, phone_x + phone_w + 12, phone_y + phone_h + 12), 48, fill=(30, 41, 59), outline=(71, 85, 105), width=3)
        draw_card(draw, (phone_x, phone_y, phone_x + phone_w, phone_y + phone_h), 40, fill=(255, 245, 247))
        draw_pill(draw, (WIDTH//2 - 80, phone_y + 16, WIDTH//2 + 80, phone_y + 44), fill=(15, 23, 42))

        # Cute Cat Sticker
        cur_cat = cat_runaway if st > 1.2 else cat_sticker
        cat_resized = cur_cat.resize((240, int(240 * cur_cat.height / cur_cat.width)), Image.Resampling.LANCZOS)
        img.paste(cat_resized, (WIDTH//2 - 120, phone_y + 130), cat_resized)

        # Question text
        draw.text((WIDTH//2 - 250, phone_y + 430), "Will You Be Mine Forever?", fill=(15, 23, 42), font=font_bold_large)
        draw_heart(draw, WIDTH//2 + 270, phone_y + 455, 30, (225, 29, 72))
        draw.text((WIDTH//2 - 170, phone_y + 505), "(Ek baar soch lo na please...)", fill=(100, 116, 139), font=font_regular_small)

        # YES & NO Button Animation
        yes_scale = 1.0 + min(0.45, max(0.0, (st - 1.0) * 0.35))
        yes_w, yes_h = int(240 * yes_scale), int(80 * yes_scale)
        yes_x = WIDTH//2 - yes_w - 30
        yes_y = phone_y + 640

        # Runaway NO Button Position
        if st < 0.9:
            no_x = WIDTH//2 + 30
            no_y = phone_y + 640
        elif st < 1.8:
            no_x = WIDTH//2 + 80 + int(math.sin(st * 15) * 40)
            no_y = phone_y + 800 + int(math.cos(st * 15) * 30)
        else:
            no_x = WIDTH//2 + 110 + int(math.sin(st * 18) * 30)
            no_y = phone_y + 530 + int(math.cos(st * 18) * 20)

        # Draw YES Button
        draw_pill(draw, (yes_x, yes_y, yes_x + yes_w, yes_y + yes_h), fill=(225, 29, 72), outline=(159, 18, 57), width=3)
        draw.text((yes_x + (yes_w - 110)//2, yes_y + (yes_h - 40)//2), "YES!", fill=(255, 255, 255), font=font_bold_large)
        draw_heart(draw, yes_x + (yes_w - 110)//2 + 135, yes_y + yes_h//2, 24, (255, 255, 255))

        # Draw Runaway NO Button
        no_w, no_h = 160, 68
        draw_pill(draw, (no_x, no_y, no_x + no_w, no_y + no_h), fill=(241, 245, 249), outline=(203, 213, 225), width=2)
        draw.text((no_x + 45, no_y + 16), "No", fill=(100, 116, 139), font=font_bold_small)

        # Confetti on YES tap
        if st > 1.8:
            c_prog = min(1.0, (st - 1.8) * 1.5)
            for c in CONFETTI[:50]:
                cx = int(c["x"] + c["vx"] * (c_prog * 25))
                cy = int(c["y"] + c["vy"] * (c_prog * 25) + 0.5 * 38 * (c_prog ** 2))
                draw.rectangle((cx, cy, cx + c["size"], cy + c["size"]//2), fill=c["color"])

        # Bottom Caption Pill
        draw_pill(draw, (WIDTH//2 - 380, HEIGHT - 180, WIDTH//2 + 380, HEIGHT - 95), fill=(255, 255, 255, 245), outline=(225, 29, 72), width=2)
        draw.text((WIDTH//2 - 335, HEIGHT - 150), "Hilarious Runaway 'NO' Button!", fill=(190, 24, 93), font=font_bold_med)

    # ---------------------------------------------------------
    # SCENE 4: POLAROID MEMORIES & QUIZ (9.2s - 12.0s, Frames 276 to 360)
    # ---------------------------------------------------------
    elif frame_idx < 361:
        st = (frame_idx - 276) / 30.0 # 0 to 2.8s

        chap_y = 170
        draw_pill(draw, (WIDTH//2 - 270, chap_y, WIDTH//2 + 270, chap_y + 56), fill=(255, 255, 255, 245), outline=(244, 63, 94), width=2)
        draw.text((WIDTH//2 - 235, chap_y + 11), "CHAPTER 4: POLAROID MEMORIES", fill=(225, 29, 72), font=font_bold_small)

        pol_w, pol_h = 360, 440

        def create_polaroid(img_src, caption, angle):
            card = Image.new("RGBA", (pol_w, pol_h), (255, 255, 255, 255))
            cdraw = ImageDraw.Draw(card)
            photo_cropped = img_src.resize((310, 310), Image.Resampling.LANCZOS)
            card.paste(photo_cropped, (25, 25))
            cdraw.rectangle((24, 24, 336, 336), outline=(230, 230, 230), width=1)
            cdraw.text((35, 360), caption, fill=(50, 50, 50), font=font_bold_small)
            draw_pill(cdraw, (pol_w//2 - 45, 8, pol_w//2 + 45, 24), fill=(255, 180, 195, 200))
            return card.rotate(angle, expand=True, resample=Image.Resampling.BICUBIC)

        pol1 = create_polaroid(sample1, "First Date", 9)
        pol2 = create_polaroid(sample2, "Our Vacation", -4)
        pol3 = create_polaroid(sample3, "Under Stars", -12)

        p_prog = min(1.0, st * 2.5)
        base_y = int(380 + (1.0 - p_prog) * 120)

        img.paste(pol1, (WIDTH//2 - 420, base_y + 40), pol1)
        img.paste(pol3, (WIDTH//2 + 60, base_y + 60), pol3)
        img.paste(pol2, (WIDTH//2 - 180, base_y), pol2)

        # Love Quiz Card Below Polaroids
        quiz_y = 1000
        quiz_box = (WIDTH//2 - 420, quiz_y, WIDTH//2 + 420, quiz_y + 360)
        draw_card(draw, quiz_box, 32, fill=(255, 255, 255, 245), outline=(244, 63, 94), width=3)

        draw.text((WIDTH//2 - 370, quiz_y + 35), "LOVE QUIZ CHALLENGE", fill=(225, 29, 72), font=font_bold_small)
        draw.text((WIDTH//2 - 370, quiz_y + 90), "What's my favorite memory with you?", fill=(30, 41, 59), font=font_bold_med)

        draw_pill(draw, (WIDTH//2 - 370, quiz_y + 170, WIDTH//2 + 370, quiz_y + 240), fill=(240, 253, 244), outline=(74, 222, 128), width=2)
        draw.text((WIDTH//2 - 330, quiz_y + 185), "Correct: Stargazing in the hills", fill=(22, 101, 52), font=font_bold_small)

        draw_pill(draw, (WIDTH//2 - 370, quiz_y + 260, WIDTH//2 + 370, quiz_y + 330), fill=(248, 250, 252), outline=(226, 232, 240), width=1)
        draw.text((WIDTH//2 - 330, quiz_y + 275), "Watching movies together", fill=(100, 116, 139), font=font_regular_small)

        draw_pill(draw, (WIDTH//2 - 380, HEIGHT - 180, WIDTH//2 + 380, HEIGHT - 95), fill=(255, 255, 255, 245), outline=(225, 29, 72), width=2)
        draw.text((WIDTH//2 - 340, HEIGHT - 150), "Polaroid Memories + Love Quizzes", fill=(190, 24, 93), font=font_bold_med)

    # ---------------------------------------------------------
    # SCENE 5: REAL-TIME WHATSAPP NOTIFICATION (12.0s - 14.0s, Frames 361 to 420)
    # ---------------------------------------------------------
    elif frame_idx < 421:
        st = (frame_idx - 361) / 30.0 # 0 to 2.0s

        # Phone Frame in Center
        phone_w, phone_h = 760, 1300
        phone_x = WIDTH//2 - phone_w // 2
        phone_y = 260
        draw_card(draw, (phone_x - 12, phone_y - 12, phone_x + phone_w + 12, phone_y + phone_h + 12), 48, fill=(30, 41, 59), outline=(71, 85, 105), width=3)
        draw_card(draw, (phone_x, phone_y, phone_x + phone_w, phone_y + phone_h), 40, fill=(248, 250, 252))
        draw_pill(draw, (WIDTH//2 - 80, phone_y + 16, WIDTH//2 + 80, phone_y + 44), fill=(15, 23, 42))

        # Spring drop down for WhatsApp notification banner inside phone
        drop_prog = min(1.0, st * 3.5)
        bounce = math.sin(drop_prog * math.pi * 0.5)
        notif_y = int(phone_y + 100 + bounce * 50)

        notif_w, notif_h = 700, 220
        notif_x = WIDTH//2 - notif_w // 2

        # Outer Shadow
        draw_card(draw, (notif_x - 4, notif_y - 4, notif_x + notif_w + 4, notif_y + notif_h + 4), 32, fill=(200, 200, 210, 80))
        # Main Notification Pill
        draw_card(draw, (notif_x, notif_y, notif_x + notif_w, notif_y + notif_h), 28, fill=(255, 255, 255, 255), outline=(226, 232, 240), width=2)

        # Green WhatsApp Icon circle
        draw.ellipse((notif_x + 30, notif_y + 30, notif_x + 85, notif_y + 85), fill=(37, 211, 102))
        draw.text((notif_x + 48, notif_y + 38), "W", fill=(255, 255, 255), font=font_bold_small)

        draw.text((notif_x + 105, notif_y + 35), "WHATSAPP", fill=(71, 85, 105), font=font_bold_small)
        draw.text((notif_x + notif_w - 110, notif_y + 38), "now", fill=(148, 163, 184), font=font_regular_small)

        draw.text((notif_x + 105, notif_y + 82), "Sarah Just Opened Your Website!", fill=(15, 23, 42), font=font_bold_med)
        draw_heart(draw, notif_x + 590, notif_y + 102, 22, (225, 29, 72))
        draw.text((notif_x + 105, notif_y + 138), "She clicked YES! Ringing your bell...", fill=(37, 99, 235), font=font_bold_small)

        # Feature highlights below phone
        info_y = phone_y + 440
        draw_card(draw, (phone_x + 40, info_y, phone_x + phone_w - 40, info_y + 400), 28, fill=(255, 241, 242), outline=(244, 63, 94), width=2)
        draw.text((phone_x + 75, info_y + 45), "INSTANT REACTION ALERT", fill=(225, 29, 72), font=font_bold_small)
        draw.text((phone_x + 75, info_y + 105), "Know the exact second", fill=(15, 23, 42), font=font_bold_large)
        draw.text((phone_x + 75, info_y + 175), "they open it & say YES!", fill=(190, 24, 93), font=font_bold_large)
        draw.text((phone_x + 75, info_y + 260), "Real-time notification straight to your phone", fill=(100, 116, 139), font=font_regular_small)

        draw_pill(draw, (WIDTH//2 - 380, HEIGHT - 180, WIDTH//2 + 380, HEIGHT - 95), fill=(255, 255, 255, 245), outline=(225, 29, 72), width=2)
        draw.text((WIDTH//2 - 335, HEIGHT - 150), "Live WhatsApp Alert Delivered To You", fill=(190, 24, 93), font=font_bold_med)

    # ---------------------------------------------------------
    # SCENE 6: BRAND OUTRO & VIRAL CTA (14.0s - 16.5s, Frames 421 to end)
    # ---------------------------------------------------------
    else:
        st = (frame_idx - 421) / 30.0 # 0 to 2.5s

        # Celebration Confetti
        for c in CONFETTI:
            cx = int((c["x"] + c["vx"] * (st * 20)) % WIDTH)
            cy = int((c["y"] + (st * 280) + c["vy"] * 5) % HEIGHT)
            draw.rectangle((cx, cy, cx + c["size"], cy + c["size"]//2), fill=c["color"])

        # Central Brand Showcase Card
        card_w, card_h = 920, 1150
        card_x = WIDTH//2 - card_w // 2
        card_y = 300

        draw_card(draw, (card_x, card_y, card_x + card_w, card_y + card_h), 48, fill=(255, 255, 255, 252), outline=(244, 63, 94), width=4)

        # Glowing Logo Zoom
        zoom_size = int(280 + math.sin(st * 4) * 12)
        logo_zoom = logo_img.resize((zoom_size, zoom_size), Image.Resampling.LANCZOS)
        img.paste(logo_zoom, (WIDTH//2 - zoom_size//2, card_y + 80), logo_zoom)

        # Brand Headline
        draw.text((WIDTH//2 - 165, card_y + 400), "LoveDrop", fill=(225, 29, 72), font=font_bold_huge)
        draw.text((WIDTH//2 - 300, card_y + 490), "Turn Your Feelings Into Magic", fill=(15, 23, 42), font=font_bold_med)
        draw.text((WIDTH//2 - 310, card_y + 550), "Create their personalized site in 2 mins", fill=(100, 116, 139), font=font_regular_small)

        # Price Pill Offer
        price_box = (WIDTH//2 - 330, card_y + 640, WIDTH//2 + 330, card_y + 730)
        draw_pill(draw, price_box, fill=(255, 241, 242), outline=(225, 29, 72), width=3)
        draw.text((WIDTH//2 - 280, card_y + 665), "SPECIAL OFFER: JUST Rs.149", fill=(190, 24, 93), font=font_bold_large)

        # Features Checklist
        draw.text((WIDTH//2 - 340, card_y + 780), "✓ 9 Chapters  •  ✓ Custom Music  •  ✓ 1 Year Active", fill=(22, 101, 52), font=font_bold_small)

        # Pulsing CTA Button
        btn_pulse = int(math.sin(st * 6) * 6)
        btn_box = (WIDTH//2 - 380 - btn_pulse, card_y + 860, WIDTH//2 + 380 + btn_pulse, card_y + 980)
        draw_pill(draw, btn_box, fill=(225, 29, 72), outline=(159, 18, 57), width=3)
        draw.text((WIDTH//2 - 270, card_y + 895), "Visit: lovedrop.online", fill=(255, 255, 255), font=font_bold_large)

        draw.text((WIDTH//2 - 210, card_y + 1020), "Tap link in bio to start!", fill=(100, 116, 139), font=font_bold_small)
        draw.text((WIDTH//2 - 240, HEIGHT - 140), "Official Website: lovedrop.online", fill=(255, 255, 255), font=font_bold_small)

    return img.convert("RGB")


def generate_video():
    print(f"Starting Video Generation: {WIDTH}x{HEIGHT} @ {FPS}fps, Total Frames: {TOTAL_FRAMES} (~{DURATION_SEC}s)")
    start_time = time.time()

    container = av.open(OUTPUT_FILE, mode="w")

    video_stream = container.add_stream("libx264", rate=FPS)
    video_stream.width = WIDTH
    video_stream.height = HEIGHT
    video_stream.pix_fmt = "yuv420p"
    video_stream.options = {
        "preset": "veryfast",
        "crf": "21",
        "movflags": "+faststart"
    }

    audio_stream = container.add_stream("aac", rate=44100)
    audio_stream.layout = "stereo"
    resampler = av.AudioResampler(format="fltp", layout="stereo", rate=44100)

    print("Encoding video frames...")
    for idx in range(TOTAL_FRAMES):
        frame_img = render_frame(idx)
        arr = np.array(frame_img)
        vframe = av.VideoFrame.from_ndarray(arr, format="rgb24")
        vframe.pts = idx

        for packet in video_stream.encode(vframe):
            container.mux(packet)

        if idx % 60 == 0 or idx == TOTAL_FRAMES - 1:
            elapsed = time.time() - start_time
            fps_actual = (idx + 1) / elapsed if elapsed > 0 else 0
            pct = (idx + 1) / TOTAL_FRAMES * 100
            print(f"  Frame {idx+1}/{TOTAL_FRAMES} ({pct:.1f}%) - {fps_actual:.1f} fps")

    for packet in video_stream.encode():
        container.mux(packet)

    print("Muxing audio track...")
    if os.path.exists(AUDIO_FILE):
        in_audio = av.open(AUDIO_FILE)
        in_stream = in_audio.streams.audio[0]

        target_audio_pts_max = int(DURATION_SEC * 44100)
        accumulated_pts = 0

        for aframe in in_audio.decode(in_stream):
            r_frames = resampler.resample(aframe)
            for rf in r_frames:
                t_sec = accumulated_pts / 44100.0
                if t_sec > DURATION_SEC:
                    break

                for packet in audio_stream.encode(rf):
                    container.mux(packet)

                accumulated_pts += rf.samples

            if accumulated_pts >= target_audio_pts_max:
                break

        in_audio.close()

    for packet in audio_stream.encode():
        container.mux(packet)

    container.close()

    total_time = round(time.time() - start_time, 2)
    file_size_mb = round(os.path.getsize(OUTPUT_FILE) / (1024 * 1024), 2)
    print("=" * 60)
    print(f"SUCCESS! Video created at: {OUTPUT_FILE}")
    print(f"Size: {file_size_mb} MB | Duration: {DURATION_SEC}s | Time taken: {total_time}s")
    print("=" * 60)


if __name__ == "__main__":
    generate_video()
