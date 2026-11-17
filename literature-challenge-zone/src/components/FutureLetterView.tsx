import { useEffect, useRef, useState, type ChangeEvent, type FormEvent } from 'react';
import {
  Camera,
  Check,
  Download,
  Feather,
  Home,
  Mail,
  Printer,
  RotateCcw,
  Sparkles,
  Upload,
  X,
} from 'lucide-react';
import { motion } from 'motion/react';
import type { LetterResponse } from '../types/challenges.ts';
import { fetchPersonalizedLetter } from '../utils/challengeApi.ts';

interface FutureLetterViewProps {
  onHome: () => void;
}

const STARTER_PROMPTS = [
  'Dear Future Me, the favorite story I am reading right now is...',
  'One brave dream I hope I have achieved by the time you read this is...',
  'Remember to stay kind, stay curious, and always make time for...',
];

function compressImageFile(file: File): Promise<{ dataUrl: string; mimeType: string }> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error('Could not read selected image file.'));
    reader.onload = () => {
      const img = new Image();
      img.onerror = () => reject(new Error('Invalid image format.'));
      img.onload = () => {
        const maxSide = 1400;
        let { width, height } = img;
        if (width > maxSide || height > maxSide) {
          const ratio = Math.min(maxSide / width, maxSide / height);
          width = Math.round(width * ratio);
          height = Math.round(height * ratio);
        }
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          resolve({ dataUrl: String(reader.result), mimeType: file.type || 'image/jpeg' });
          return;
        }
        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(0, 0, width, height);
        ctx.drawImage(img, 0, 0, width, height);
        resolve({
          dataUrl: canvas.toDataURL('image/jpeg', 0.86),
          mimeType: 'image/jpeg',
        });
      };
      img.src = String(reader.result);
    };
    reader.readAsDataURL(file);
  });
}

function wrapCanvasText(
  ctx: CanvasRenderingContext2D,
  text: string,
  maxWidth: number
): string[] {
  const paragraphs = text.split('\n');
  const lines: string[] = [];
  for (const para of paragraphs) {
    const trimmed = para.trim();
    if (!trimmed) {
      lines.push('');
      continue;
    }
    const words = trimmed.split(/\s+/);
    let current = '';
    for (const word of words) {
      const test = current ? `${current} ${word}` : word;
      if (ctx.measureText(test).width > maxWidth && current) {
        lines.push(current);
        current = word;
      } else {
        current = test;
      }
    }
    if (current) lines.push(current);
  }
  return lines;
}

function saveKeepsakeCard(params: {
  name: string;
  age: string;
  grade: string;
  letter: string;
  signOff: string;
}) {
  const width = 1000;
  const paddingX = 96;
  const maxTextWidth = width - paddingX * 2;

  const measureCanvas = document.createElement('canvas');
  const mCtx = measureCanvas.getContext('2d');
  if (!mCtx) return;

  mCtx.font = '26px Georgia, "Times New Roman", serif';
  const bodyLines = wrapCanvasText(mCtx, params.letter, maxTextWidth);
  const signLines = wrapCanvasText(mCtx, params.signOff, maxTextWidth);

  const lineHeight = 42;
  const height = Math.max(820, 290 + bodyLines.length * lineHeight + signLines.length * 40 + 130);

  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  // Warm cream parchment background
  ctx.fillStyle = '#FDF9F0';
  ctx.fillRect(0, 0, width, height);

  // Subtle lined stationery stripes
  ctx.strokeStyle = 'rgba(214, 203, 182, 0.42)';
  ctx.lineWidth = 1;
  for (let y = 260; y < height - 90; y += lineHeight) {
    ctx.beginPath();
    ctx.moveTo(paddingX - 12, y);
    ctx.lineTo(width - paddingX + 12, y);
    ctx.stroke();
  }

  // Outer ornamental double border
  ctx.strokeStyle = '#C9A86A';
  ctx.lineWidth = 4;
  ctx.strokeRect(28, 28, width - 56, height - 56);
  ctx.strokeStyle = '#E4D5BA';
  ctx.lineWidth = 1.5;
  ctx.strokeRect(40, 40, width - 80, height - 80);

  // Masthead text
  ctx.fillStyle = '#92400E';
  ctx.font = 'bold 16px sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('SUPERNOVA 2026  ·  ENGLISH DEPARTMENT', width / 2, 92);

  ctx.fillStyle = '#1F1C18';
  ctx.font = 'bold 36px Georgia, "Times New Roman", serif';
  ctx.fillText('A Letter to Your Future Self', width / 2, 142);

  const metaParts = [
    params.name ? `Written by ${params.name}` : '',
    params.age ? `Age ${params.age}` : '',
    params.grade,
  ].filter(Boolean);
  if (metaParts.length > 0) {
    ctx.fillStyle = '#6B5E4C';
    ctx.font = 'italic 18px Georgia, "Times New Roman", serif';
    ctx.fillText(metaParts.join('  ·  '), width / 2, 178);
  }

  // Divider rule
  ctx.strokeStyle = '#D9C5A0';
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.moveTo(paddingX, 204);
  ctx.lineTo(width - paddingX, 204);
  ctx.stroke();

  // Letter body
  ctx.textAlign = 'left';
  ctx.fillStyle = '#241F19';
  ctx.font = '26px Georgia, "Times New Roman", serif';
  let y = 252;
  for (const line of bodyLines) {
    if (line) {
      ctx.fillText(line, paddingX, y);
    }
    y += lineHeight;
  }

  // Sign-off
  y += 18;
  ctx.fillStyle = '#4A3F32';
  ctx.font = 'italic 26px Georgia, "Times New Roman", serif';
  for (const line of signLines) {
    if (line) {
      ctx.fillText(line, paddingX, y);
    }
    y += 38;
  }

  // Footer
  ctx.textAlign = 'center';
  ctx.fillStyle = '#8C7D68';
  ctx.font = '14px sans-serif';
  ctx.fillText('Literature Challenge Zone  ·  Supernova 2026 Keepsake', width / 2, height - 62);

  const slug = (params.name || 'visitor').toLowerCase().replace(/[^a-z0-9]+/g, '-');
  const link = document.createElement('a');
  link.download = `future-self-letter-${slug}.png`;
  link.href = canvas.toDataURL('image/png');
  link.click();
}

export function FutureLetterView({ onHome }: FutureLetterViewProps) {
  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [grade, setGrade] = useState('');
  const [notes, setNotes] = useState('');

  const [cameraOpen, setCameraOpen] = useState(false);
  const [cameraError, setCameraError] = useState('');
  const [photoDataUrl, setPhotoDataUrl] = useState<string | null>(null);
  const [photoMimeType, setPhotoMimeType] = useState<string>('image/jpeg');

  const [loading, setLoading] = useState(false);
  const [unreadableError, setUnreadableError] = useState('');
  const [formError, setFormError] = useState('');
  const [letterResult, setLetterResult] = useState<LetterResponse | null>(null);

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const nameInputRef = useRef<HTMLInputElement | null>(null);
  const notesInputRef = useRef<HTMLTextAreaElement | null>(null);

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    setCameraOpen(false);
  };

  useEffect(() => {
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
      }
    };
  }, []);

  useEffect(() => {
    if (cameraOpen && videoRef.current && streamRef.current) {
      videoRef.current.srcObject = streamRef.current;
      videoRef.current.play().catch(() => {});
    }
  }, [cameraOpen]);

  const handleOpenCamera = async () => {
    setCameraError('');
    setFormError('');
    setUnreadableError('');

    if (!navigator.mediaDevices?.getUserMedia) {
      setCameraError(
        'Camera preview is not available in this browser. Please use Upload Photo instead.'
      );
      return;
    }

    try {
      let stream: MediaStream;
      try {
        stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: 'environment', width: { ideal: 1280 }, height: { ideal: 960 } },
          audio: false,
        });
      } catch {
        stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false });
      }
      streamRef.current = stream;
      setPhotoDataUrl(null);
      setCameraOpen(true);
    } catch {
      setCameraError(
        'Could not access the camera. You can use Upload Photo to pick an image, or type a few lines below.'
      );
    }
  };

  const handleCapturePhoto = () => {
    const video = videoRef.current;
    if (!video || video.videoWidth === 0 || video.videoHeight === 0) return;

    const maxSide = 1400;
    let width = video.videoWidth;
    let height = video.videoHeight;
    if (width > maxSide || height > maxSide) {
      const ratio = Math.min(maxSide / width, maxSide / height);
      width = Math.round(width * ratio);
      height = Math.round(height * ratio);
    }

    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.drawImage(video, 0, 0, width, height);

    const dataUrl = canvas.toDataURL('image/jpeg', 0.88);
    setPhotoDataUrl(dataUrl);
    setPhotoMimeType('image/jpeg');
    stopCamera();
  };

  const handleFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file) return;

    setFormError('');
    setCameraError('');
    setUnreadableError('');
    stopCamera();

    try {
      const { dataUrl, mimeType } = await compressImageFile(file);
      setPhotoDataUrl(dataUrl);
      setPhotoMimeType(mimeType);
    } catch {
      setFormError('Could not load that image file. Please try another photo.');
    }
  };

  const handleRetake = () => {
    setPhotoDataUrl(null);
    setUnreadableError('');
    setFormError('');
  };

  const handleConfirmPhoto = async () => {
    if (!photoDataUrl) return;
    if (!name.trim()) {
      setFormError('Please enter your name above first, then tap Confirm.');
      nameInputRef.current?.focus();
      return;
    }

    setFormError('');
    setUnreadableError('');
    setLoading(true);

    const result = await fetchPersonalizedLetter({
      name: name.trim(),
      age: age.trim(),
      grade: grade.trim(),
      notes: notes.trim(),
      imageBase64: photoDataUrl,
      imageMimeType: photoMimeType,
    });

    setLoading(false);

    if (result.readable === false || !result.letter) {
      setUnreadableError(
        result.error ||
          "We couldn't read the handwriting clearly in that photo. Please retake the photo or type a few lines below instead."
      );
      return;
    }

    setLetterResult(result);
  };

  const handleGenerateTyped = async (e: FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setFormError('Please enter your name first so we can address your letter.');
      nameInputRef.current?.focus();
      return;
    }
    setFormError('');
    setUnreadableError('');
    setLoading(true);

    const result = await fetchPersonalizedLetter({
      name: name.trim(),
      age: age.trim(),
      grade: grade.trim(),
      notes: notes.trim(),
    });
    setLoading(false);
    setLetterResult(result);
  };

  const handleReset = () => {
    stopCamera();
    setName('');
    setAge('');
    setGrade('');
    setNotes('');
    setPhotoDataUrl(null);
    setLetterResult(null);
    setFormError('');
    setUnreadableError('');
    setCameraError('');
  };

  const handleHomeClick = () => {
    stopCamera();
    onHome();
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.22 }}
      className="min-h-screen flex flex-col relative z-10"
    >
      {/* Clean Top Bar (Optional, Untimed, No Levels) */}
      <header className="w-full border-b border-[#E3D8C3] bg-[#FCF9F2]/90 backdrop-blur-sm px-4 sm:px-8 py-3.5">
        <div className="max-w-6xl mx-auto flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <motion.button
              type="button"
              whileTap={{ scale: 0.96 }}
              onClick={handleHomeClick}
              className="inline-flex items-center gap-2.5 px-5 py-3 rounded-xl bg-white border border-[#D8CCB6] text-[#1F1C18] font-semibold text-base shadow-xs hover:bg-[#F5EFE2] cursor-pointer whitespace-nowrap shrink-0 transition-colors"
            >
              <Home className="w-5 h-5" aria-hidden="true" />
              <span>Home</span>
            </motion.button>

            <div>
              <h2 className="font-serif text-xl sm:text-2xl font-bold text-[#1F1C18]">
                Letter to Your Future Self
              </h2>
              <div className="flex items-center gap-2 text-xs sm:text-sm font-medium text-amber-800">
                <span>Optional</span>
                <span aria-hidden="true">·</span>
                <span>Untimed</span>
                <span aria-hidden="true">·</span>
                <span>No Levels</span>
              </div>
            </div>
          </div>

          <motion.button
            type="button"
            whileTap={{ scale: 0.96 }}
            onClick={handleReset}
            className="inline-flex items-center gap-2 px-4 py-3 rounded-xl bg-white border border-[#D8CCB6] text-[#3F3930] font-semibold text-base hover:bg-[#F5EFE2] cursor-pointer whitespace-nowrap shrink-0 transition-colors"
          >
            <RotateCcw className="w-5 h-5" aria-hidden="true" />
            <span>Clear for Next Visitor</span>
          </motion.button>
        </div>
      </header>

      {/* Main Single-Screen Two-Zone Station */}
      <main className="flex-1 flex items-center px-4 sm:px-8 py-6">
        <div className="max-w-6xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          {/* Left Zone: Paper & Post Box Guide */}
          <section className="lg:col-span-5 bg-white/85 backdrop-blur-sm border border-[#DFD3BD] rounded-2xl p-6 sm:p-7 shadow-sm flex flex-col justify-between gap-5">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-amber-600 text-white flex items-center justify-center shrink-0">
                  <Mail className="w-6 h-6" aria-hidden="true" />
                </div>
                <div>
                  <div className="text-xs font-bold uppercase tracking-wider text-amber-800">
                    Paper &amp; Post Box Station
                  </div>
                  <h1 className="font-serif text-2xl font-bold text-[#1F1C18]">
                    Write Today, Read Tomorrow
                  </h1>
                </div>
              </div>

              <p className="text-[15px] text-[#4B4338] leading-relaxed">
                Write a handwritten letter to yourself on stationery paper, then photograph it here
                to receive a custom digital keepsake—or drop your paper note straight into our Post
                Box!
              </p>

              <ol className="space-y-3 text-[15px] text-[#3B342B]">
                <li className="flex items-start gap-3">
                  <span className="w-7 h-7 rounded-lg bg-amber-100 text-amber-900 font-bold text-sm flex items-center justify-center shrink-0">
                    1
                  </span>
                  <span>
                    <strong className="text-[#1F1C18]">Write on paper</strong> using a pen and
                    stationery from the table.
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="w-7 h-7 rounded-lg bg-amber-100 text-amber-900 font-bold text-sm flex items-center justify-center shrink-0">
                    2
                  </span>
                  <span>
                    <strong className="text-[#1F1C18]">Take a photo or upload it</strong> beside
                    this guide so AI can read your note and craft a keepsake letter.
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="w-7 h-7 rounded-lg bg-amber-100 text-amber-900 font-bold text-sm flex items-center justify-center shrink-0">
                    3
                  </span>
                  <span>
                    <strong className="text-[#1F1C18]">Print, Save, or Post it</strong>—you can also
                    fold your handwritten page for our exhibition Post Box!
                  </span>
                </li>
              </ol>
            </div>

            <div className="pt-4 border-t border-[#EAE0CE] space-y-2.5">
              <div className="text-xs font-bold uppercase tracking-wider text-[#6E6455]">
                Helpful Sentence Starters
              </div>
              <ul className="space-y-2">
                {STARTER_PROMPTS.map((line) => (
                  <li
                    key={line}
                    className="font-serif italic text-sm text-[#4A4237] bg-[#FAF4E6] border border-[#E6DAC3] rounded-lg px-3.5 py-2"
                  >
                    “{line}”
                  </li>
                ))}
              </ul>
            </div>
          </section>

          {/* Right Zone: Photo Capture / Upload / Preview / Pretty Letter Result */}
          <section className="lg:col-span-7 bg-white/85 backdrop-blur-sm border border-[#DFD3BD] rounded-2xl p-6 sm:p-7 shadow-sm flex flex-col justify-between">
            {!letterResult ? (
              <div className="space-y-4 flex-1 flex flex-col justify-between">
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-11 h-11 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center shrink-0">
                      <Feather className="w-6 h-6" aria-hidden="true" />
                    </div>
                    <div>
                      <div className="text-xs font-bold uppercase tracking-wider text-amber-800">
                        Handwritten Photo or Quick Note
                      </div>
                      <h3 className="font-serif text-2xl font-bold text-[#1F1C18]">
                        Create Your Personalized Letter
                      </h3>
                    </div>
                  </div>

                  {/* Name, Age, Grade Inputs */}
                  <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
                    <div className="sm:col-span-6">
                      <label
                        htmlFor="visitor-name"
                        className="block text-sm font-semibold text-[#3B342B] mb-1"
                      >
                        Visitor Name <span className="text-rose-600">*</span>
                      </label>
                      <input
                        ref={nameInputRef}
                        id="visitor-name"
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="e.g., Maya or Aarav"
                        className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-[#D4C7B0] text-[#1F1C18] text-base focus:outline-none focus:border-amber-600"
                      />
                    </div>

                    <div className="sm:col-span-3">
                      <label
                        htmlFor="visitor-age"
                        className="block text-sm font-semibold text-[#3B342B] mb-1"
                      >
                        Age
                      </label>
                      <input
                        id="visitor-age"
                        type="text"
                        value={age}
                        onChange={(e) => setAge(e.target.value)}
                        placeholder="e.g., 10"
                        className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-[#D4C7B0] text-[#1F1C18] text-base focus:outline-none focus:border-amber-600"
                      />
                    </div>

                    <div className="sm:col-span-3">
                      <label
                        htmlFor="visitor-grade"
                        className="block text-sm font-semibold text-[#3B342B] mb-1"
                      >
                        Grade / Stage
                      </label>
                      <input
                        id="visitor-grade"
                        type="text"
                        value={grade}
                        onChange={(e) => setGrade(e.target.value)}
                        placeholder="e.g., Grade 5"
                        className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-[#D4C7B0] text-[#1F1C18] text-base focus:outline-none focus:border-amber-600"
                      />
                    </div>
                  </div>

                  {/* Camera / Upload / Preview Zone */}
                  <div className="rounded-xl border border-[#E2D6BF] bg-[#FAF6EC]/80 p-4 space-y-3">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <span className="text-sm font-bold text-[#3B342B]">
                        Handwritten Letter Photo
                      </span>
                      <span className="text-xs text-[#6B6254]">
                        Photograph your handwritten page or pick an image
                      </span>
                    </div>

                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                      className="hidden"
                    />

                    {/* State 1: Live Camera Viewfinder */}
                    {cameraOpen && (
                      <div className="space-y-3">
                        <div className="relative rounded-xl overflow-hidden bg-stone-900 border border-[#D4C7B0] aspect-[4/3] max-h-64 w-full flex items-center justify-center">
                          <video
                            ref={videoRef}
                            autoPlay
                            playsInline
                            muted
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="flex flex-wrap items-center gap-3">
                          <button
                            type="button"
                            onClick={handleCapturePhoto}
                            className="flex-1 inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-base cursor-pointer transition-colors"
                          >
                            <Camera className="w-5 h-5" aria-hidden="true" />
                            <span>Capture Photo</span>
                          </button>
                          <button
                            type="button"
                            onClick={stopCamera}
                            className="inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-white border border-[#D4C7B0] hover:bg-[#F5EFE2] text-[#3F3930] font-semibold text-base cursor-pointer transition-colors"
                          >
                            <X className="w-5 h-5" aria-hidden="true" />
                            <span>Cancel</span>
                          </button>
                        </div>
                      </div>
                    )}

                    {/* State 2: Photo Preview with Retake & Confirm */}
                    {!cameraOpen && photoDataUrl && (
                      <div className="space-y-3">
                        <div className="rounded-xl overflow-hidden border border-[#D4C7B0] bg-white max-h-56 flex items-center justify-center">
                          <img
                            src={photoDataUrl}
                            alt="Preview of visitor handwritten letter"
                            className="max-h-56 w-auto object-contain"
                          />
                        </div>

                        {unreadableError && (
                          <div
                            role="alert"
                            className="rounded-xl border border-rose-300 bg-rose-50 px-4 py-3 text-sm font-medium text-rose-900"
                          >
                            {unreadableError}
                          </div>
                        )}

                        <div className="flex flex-wrap items-center gap-3">
                          <motion.button
                            type="button"
                            whileTap={{ scale: 0.97 }}
                            disabled={loading}
                            onClick={handleRetake}
                            className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-white border border-[#D4C7B0] hover:bg-[#F5EFE2] disabled:opacity-60 text-[#3F3930] font-semibold text-base cursor-pointer transition-colors"
                          >
                            <RotateCcw className="w-4 h-4" aria-hidden="true" />
                            <span>Retake</span>
                          </motion.button>

                          <motion.button
                            type="button"
                            whileTap={{ scale: 0.97 }}
                            disabled={loading}
                            onClick={handleConfirmPhoto}
                            className="cta-highlight flex-1 inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-amber-600 hover:bg-amber-700 disabled:opacity-60 text-white font-bold text-base shadow-xs cursor-pointer transition-colors"
                          >
                            <Check className="w-5 h-5" aria-hidden="true" />
                            <span>
                              {loading ? 'Reading Handwriting...' : 'Confirm & Read Handwriting'}
                            </span>
                          </motion.button>
                        </div>
                      </div>
                    )}

                    {/* State 3: Take Photo / Upload Buttons */}
                    {!cameraOpen && !photoDataUrl && (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <motion.button
                          type="button"
                          whileTap={{ scale: 0.97 }}
                          onClick={handleOpenCamera}
                          className="inline-flex items-center justify-center gap-2.5 px-4 py-3.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-base shadow-xs cursor-pointer transition-colors"
                        >
                          <Camera className="w-5 h-5" aria-hidden="true" />
                          <span>Take Photo</span>
                        </motion.button>

                        <motion.button
                          type="button"
                          whileTap={{ scale: 0.97 }}
                          onClick={() => fileInputRef.current?.click()}
                          className="inline-flex items-center justify-center gap-2.5 px-4 py-3.5 rounded-xl bg-white border border-[#D4C7B0] hover:bg-[#F5EFE2] text-[#1F1C18] font-bold text-base cursor-pointer transition-colors"
                        >
                          <Upload className="w-5 h-5" aria-hidden="true" />
                          <span>Upload Photo</span>
                        </motion.button>
                      </div>
                    )}

                    {cameraError && (
                      <p className="text-sm font-medium text-amber-900 bg-amber-50 border border-amber-200 rounded-lg px-3 py-2">
                        {cameraError}
                      </p>
                    )}
                  </div>

                  {/* Optional / Fallback: Type a Few Lines Instead */}
                  <form onSubmit={handleGenerateTyped} className="space-y-3">
                    <div>
                      <label
                        htmlFor="visitor-notes"
                        className="block text-sm font-semibold text-[#3B342B] mb-1"
                      >
                        Or type a few lines instead
                      </label>
                      <textarea
                        ref={notesInputRef}
                        id="visitor-notes"
                        rows={2}
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        placeholder="e.g., I love adventure books and hope to stay curious and brave..."
                        className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-[#D4C7B0] text-[#1F1C18] text-base leading-relaxed focus:outline-none focus:border-amber-600 resize-none"
                      />
                    </div>

                    {formError && (
                      <p className="text-sm font-semibold text-rose-700" role="alert">
                        {formError}
                      </p>
                    )}

                    {!photoDataUrl && (
                      <motion.button
                        type="submit"
                        whileTap={{ scale: 0.98 }}
                        disabled={loading}
                        className="w-full inline-flex items-center justify-center gap-2.5 px-5 py-3.5 rounded-xl bg-[#1F1C18] hover:bg-[#332E27] disabled:opacity-60 text-white font-bold text-base shadow-xs cursor-pointer transition-colors"
                      >
                        <Sparkles className="w-5 h-5" aria-hidden="true" />
                        <span>{loading ? 'Creating Letter...' : 'Generate from Typed Lines'}</span>
                      </motion.button>
                    )}
                  </form>
                </div>
              </div>
            ) : (
              /* Pretty Letter Display with Print & Save */
              <div className="flex-1 flex flex-col justify-between gap-4">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div className="text-xs font-bold uppercase tracking-wider text-amber-800">
                    Your Keepsake Letter
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setLetterResult(null);
                      setUnreadableError('');
                    }}
                    className="text-sm font-semibold text-amber-800 hover:text-amber-950 underline underline-offset-4 cursor-pointer"
                  >
                    Retake Photo / Edit Details
                  </button>
                </div>

                {/* Printable Pretty Stationery Card */}
                <div className="printable-letter letter-paper flex-1 border-2 border-[#DECBA8] rounded-2xl p-6 sm:p-8 overflow-y-auto max-h-[390px] shadow-inner relative">
                  <div className="text-center border-b border-[#E5D7BC] pb-3 mb-5">
                    <div className="text-[11px] font-bold uppercase tracking-[0.2em] text-amber-800">
                      Supernova 2026 · English Department
                    </div>
                    <h4 className="font-serif text-xl sm:text-2xl font-bold text-[#1F1C18] mt-1">
                      A Letter to Your Future Self
                    </h4>
                    <div className="text-xs sm:text-sm italic font-serif text-[#6B5E4C] mt-0.5">
                      {[name ? `For ${name}` : '', age ? `Age ${age}` : '', grade]
                        .filter(Boolean)
                        .join(' · ')}
                    </div>
                  </div>

                  <div className="font-serif text-lg sm:text-[19px] text-[#241F19] leading-8 whitespace-pre-line">
                    {letterResult.letter}
                  </div>

                  <div className="mt-6 font-serif italic text-lg text-[#3D342A] whitespace-pre-line">
                    {letterResult.signOff}
                  </div>
                </div>

                {/* Print & Save Actions */}
                <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
                  <div className="flex flex-wrap items-center gap-3">
                    <motion.button
                      type="button"
                      whileTap={{ scale: 0.97 }}
                      onClick={() => window.print()}
                      className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-[#1F1C18] hover:bg-[#332E27] text-white font-bold text-base shadow-xs cursor-pointer transition-colors"
                    >
                      <Printer className="w-5 h-5" aria-hidden="true" />
                      <span>Print</span>
                    </motion.button>

                    <motion.button
                      type="button"
                      whileTap={{ scale: 0.97 }}
                      onClick={() =>
                        saveKeepsakeCard({
                          name: name.trim(),
                          age: age.trim(),
                          grade: grade.trim(),
                          letter: letterResult.letter,
                          signOff: letterResult.signOff,
                        })
                      }
                      className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-base shadow-xs cursor-pointer transition-colors"
                    >
                      <Download className="w-5 h-5" aria-hidden="true" />
                      <span>Save Keepsake</span>
                    </motion.button>
                  </div>

                  <span className="text-xs sm:text-sm text-[#6B6254]">
                    Drop your paper letter in the Post Box!
                  </span>
                </div>
              </div>
            )}
          </section>
        </div>
      </main>
    </motion.div>
  );
}
