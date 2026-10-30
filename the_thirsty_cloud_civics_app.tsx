import React, { useState, useEffect, useRef } from 'react';
import {
  Droplet,
  Flame,
  Cpu,
  AlertTriangle,
  Scale,
  ShieldAlert,
  Check,
  Copy,
  RotateCcw,
  Zap,
  ArrowRight,
  Waves,
  Sparkles,
  Info,
  X,
  Send,
  Download,
  Share2,
  BookOpen,
  Image as ImageIcon,
  MessageSquare,
  HelpCircle,
  ExternalLink,
  Layers,
  Thermometer,
  Compass
} from 'lucide-react';

// --- DATASET: 3 TIPE TUGAS SISWA & REKAYASA PROMPT ---
type AIType = 'text' | 'deep' | 'image';

interface TaskTemplate {
  id: string;
  label: string;
  category: AIType;
  categoryLabel: string;
  badPrompt: string;
  goodPrompt: string;
  badStream: string;
  goodStream: string;
  // Water metric per 1 prompt (Scope 1 direct + Scope 2 indirect power plant cooling in ml)
  badWaterTotalMl: number;
  goodWaterTotalMl: number;
  // Direct cooling water at data center tower (Scope 1 in ml)
  badDirectMl: number;
  goodDirectMl: number;
  badTemp: number;
  goodTemp: number;
  computeTimeSec: number;
}

const TEMPLATES: TaskTemplate[] = [
  {
    id: 'sejarah',
    label: 'Essay Sejarah 1998',
    category: 'text',
    categoryLabel: 'Text Chat Ringan',
    badPrompt: 'Tolong buatin essay sejarah reformasi 1998 dong kak yang super panjang dan lengkap banget dari awal sampe akhir plis buat PR besok...',
    goodPrompt: 'Ringkas 3 faktor utama pemicu Reformasi 1998 (ekonomi moneter, politik, dan sosial) dalam 120 kata dengan poin-poin jelas.',
    badStream: 'Tentu saja! Reformasi 1998 merupakan titik balik sejarah monumental bagi bangsa Indonesia. Mari kita bedah mulai dari krisis moneter Asia 1997 yang menghantam nilai tukar Rupiah dari Rp2.500 menjadi belasan ribu per Dolar AS, disusul kejatuhan sektor perbankan, kenaikan harga bahan pokok, gelombang unjuk rasa mahasiswa, hingga pidato pengunduran diri Presiden Soeharto...',
    goodStream: '1. Krisis Moneter 1997: Rupiah terdepresiasi parah, inflasi tinggi, harga sembako melonjak tajam.\n2. Krisis Kepercayaan Politik: Tuntutan reformasi terhadap rezim Orde Baru yang telah berkuasa 32 tahun.\n3. Tragedi Trisakti & Aksi Mahasiswa: Gugurnya empat mahasiswa memicu gelombang solidaritas nasional yang berujung pergantian kepemimpinan.',
    badWaterTotalMl: 14.5,
    goodWaterTotalMl: 3.2,
    badDirectMl: 1.2,
    goodDirectMl: 0.25,
    badTemp: 64.0,
    goodTemp: 54.0,
    computeTimeSec: 1.8
  },
  {
    id: 'biologi',
    label: 'Biologi Sel & Fotosintesis',
    category: 'text',
    categoryLabel: 'Text Chat Ringan',
    badPrompt: 'Jelasin fotosintesis dari nol jangan ada yang ketinggalan ya kak biar nilaiku 100...',
    goodPrompt: 'Tabel ringkas perbandingan Reaksi Terang vs Reaksi Gelap fotosintesis: lokasi kloroplas, input bahan, dan produk akhir.',
    badStream: 'Halo! Fotosintesis adalah proses biokimia yang sangat penting bagi kehidupan di bumi di mana tumbuhan hijau mengonversi energi cahaya matahari menjadi senyawa organik glukosa. Proses ini dibagi menjadi dua tahapan besar yang berlangsung di dalam organel bernama kloroplas...',
    goodStream: '• REAKSI TERANG: Lokasi di Tilakoid | Input: Cahaya matahari + H2O | Output: O2, ATP, & NADPH.\n• REAKSI GELAP (Calvin): Lokasi di Stroma | Input: CO2 + ATP + NADPH | Output: Glukosa (C6H12O6).',
    badWaterTotalMl: 12.0,
    goodWaterTotalMl: 2.8,
    badDirectMl: 0.95,
    goodDirectMl: 0.2,
    badTemp: 62.5,
    goodTemp: 53.2,
    computeTimeSec: 1.4
  },
  {
    id: 'fisika',
    label: 'Simulasi Fisika Python',
    category: 'deep',
    categoryLabel: 'Penalaran Deep / Koding',
    badPrompt: 'Bikinin kode python lengkap banget buat simulasi gerak parabola dan gaya gesek udara sekalian jelaskan rumus kalkulusnya secara detail baris demi baris...',
    goodPrompt: 'Tulis fungsi Python ringkas menghitung jarak maksimum gerak parabola (v0, sudut) menggunakan modul math tanpa library eksternal.',
    badStream: 'Baik! Untuk memodelkan gerak parabola dengan gesekan udara, kita harus menyelesaikan persamaan diferensial orde dua. Mari kita tinjau persamaan gerak pada sumbu horizontal dan vertikal terlebih dahulu sebelum menulis kode Python 80 baris...',
    goodStream: 'import math\n\ndef jarak_maksimum(v0: float, derajat: float) -> float:\n    # R = (v0^2 * sin(2*theta)) / g\n    rad = math.radians(derajat)\n    return (v0**2 * math.sin(2 * rad)) / 9.8\n\n# Contoh: v0 = 20 m/s, sudut 45 derajat -> 40.8 meter',
    badWaterTotalMl: 38.0,
    goodWaterTotalMl: 8.5,
    badDirectMl: 3.8,
    goodDirectMl: 0.8,
    badTemp: 76.5,
    goodTemp: 61.0,
    computeTimeSec: 6.2
  },
  {
    id: 'poster',
    label: 'Desain Poster Classmeeting',
    category: 'image',
    categoryLabel: 'AI Image / Poster Generator',
    badPrompt: 'Buatkan gambar poster keren classmeeting ada robot main bola di lapangan sekolah dengan efek api cyberpunk dan lampu neon 3D (generate 4 variasi sekaligus)...',
    goodPrompt: 'Konsep poster classmeeting: ilustrasi minimalis flat-design dua siswa tos di lapangan basket dengan tipografi bersih warna toska dan krem.',
    badStream: '[AI DIFFUSION ENGINE: 50 Denoising Steps]\nMengeksekusi matriks difusi laten 1024x1024 pada GPU VRAM 80GB...\nMenghitung pencahayaan ray-tracing neon dan tekstur kulit...\nMenghasilkan 4 berkas visual berkualitas tinggi (beban komputasi ~30x lipat dari kueri teks biasa).',
    goodStream: '[AI DIFFUSION ENGINE: 20 Steps Efficient]\nMengeksekusi generasi 1 gambar flat-vector terencana sesuai deskripsi...\nPrompt spesifik mencegah siklus perulangan (*re-roll*) yang menguras daya komputasi.',
    badWaterTotalMl: 135.0,
    goodWaterTotalMl: 45.0,
    badDirectMl: 14.2,
    goodDirectMl: 4.5,
    badTemp: 84.8,
    goodTemp: 68.0,
    computeTimeSec: 14.5
  }
];

// --- MODEL KEBIJAKAN & REGULASI NEGARA ---
const POLICIES = [
  {
    id: 'status_quo',
    shortName: 'Aturan Lama (UU 17/2019)',
    tag: 'STATUS QUO',
    wue: 2.1,
    groundwaterProtected: 15,
    powerPenalty: 0,
    transparencyScore: 20,
    verdict: 'RAWAN KRISIS',
    color: 'text-red-600',
    oneLiner: 'Izin sumur dalam (SIPA) murah & minim audit publik. Akuifer Cikarang terus terkuras, laju amblas tanah Pantura tidak terkendali.'
  },
  {
    id: 'greenwash',
    shortName: 'Klaim "Water Positive"',
    tag: 'GREENWASHING',
    wue: 1.85,
    groundwaterProtected: 25,
    powerPenalty: 0,
    transparencyScore: 35,
    verdict: 'SELEKTIF / SEMU',
    color: 'text-amber-600',
    oneLiner: 'Perusahaan menguapkan air di pemukiman padat hari ini, namun "membayar" dengan menanam pohon ratusan kilometer jauhnya.'
  },
  {
    id: 'eu_directive',
    shortName: 'Transparansi Wajib (Model Uni Eropa)',
    tag: 'TRANSPARAN',
    wue: 1.3,
    groundwaterProtected: 60,
    powerPenalty: 5,
    transparencyScore: 90,
    verdict: 'PROGRESIF',
    color: 'text-sky-700',
    oneLiner: 'Wajib pasang meteran terbuka & lapor metrik WUE bulanan. Warga dapat mengaudit pemakaian air, mencegah kongkalikong izin SIPA.'
  },
  {
    id: 'rekomendasi_civics',
    shortName: 'Zonasi + Closed Loop + Standar WUE',
    tag: 'REKOMENDASI LENGKAP',
    wue: 0.25,
    groundwaterProtected: 95,
    powerPenalty: 14,
    transparencyScore: 100,
    verdict: 'BERKELANJUTAN',
    color: 'text-emerald-700',
    oneLiner: 'Larangan total air tanah untuk pendingin AI & wajib sirkulasi tertutup (Closed-Loop). Air warga aman, dengan trade-off listrik naik 14%.'
  }
];

// Helper untuk menggambar rounded rectangle dengan fallback aman
function drawRoundedRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  width: number,
  height: number,
  radius: number
) {
  if (typeof (ctx as any).roundRect === 'function') {
    (ctx as any).roundRect(x, y, width, height, radius);
  } else {
    ctx.beginPath();
    ctx.moveTo(x + radius, y);
    ctx.lineTo(x + width - radius, y);
    ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
    ctx.lineTo(x + width, y + height - radius);
    ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
    ctx.lineTo(x + radius, y + height);
    ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
    ctx.lineTo(x, y + radius);
    ctx.quadraticCurveTo(x, y, x + radius, y);
    ctx.closePath();
  }
}

export default function TheThirstyCloudCivicsApp() {
  // --- STATE SCENE 1: LAB MIKRO ---
  const [selectedTpl, setSelectedTpl] = useState<TaskTemplate>(TEMPLATES[0]);
  const [isSmartMode, setIsSmartMode] = useState<boolean>(true);
  const [customPrompt, setCustomPrompt] = useState<string>('');
  const [streamedText, setStreamedText] = useState<string>('');
  const [isStreaming, setIsStreaming] = useState<boolean>(false);
  const [bottleRemainingMl, setBottleRemainingMl] = useState<number>(600);
  const [sessionEvapTotalMl, setSessionEvapTotalMl] = useState<number>(0);
  const [currentGpuTemp, setCurrentGpuTemp] = useState<number>(54.0);
  const [isSessionStacked, setIsSessionStacked] = useState<boolean>(false);
  const [containerView, setContainerView] = useState<'indomie' | 'bottle' | 'battery'>('indomie');
  const streamTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // --- STATE SCENE 2: KALKULATOR SKALA ANGKATAN ---
  const [studentCount, setStudentCount] = useState<number>(150);
  const [dailyChatPrompts, setDailyChatPrompts] = useState<number>(12);
  const [weeklyImagePrompts, setWeeklyImagePrompts] = useState<number>(2);
  const [durationDays, setDurationDays] = useState<number>(120); // 1 semester = 120 hari
  const [isClosedLoopSystem, setIsClosedLoopSystem] = useState<boolean>(false);
  const [analogyMatrixMode, setAnalogyMatrixMode] = useState<'indomie' | 'boba' | 'gallon' | 'phone'>('indomie');

  // --- STATE SCENE 3: INVESTIGASI DAERAH & REGULASI ---
  const [activeRegion, setActiveRegion] = useState<'cikarang' | 'batam'>('cikarang');
  const [activeInvestigationStep, setActiveInvestigationStep] = useState<number>(1);
  const [selectedPolicy, setSelectedPolicy] = useState(POLICIES[3]);
  const [openedLegalModal, setOpenedLegalModal] = useState<'pasal33' | 'sipa' | 'triangle' | null>(null);

  // --- STATE SCENE 4: AKSI & STORY CARD GENERATOR ---
  const [studentName, setStudentName] = useState<string>('');
  const [schoolName, setSchoolName] = useState<string>('');
  const [isCopiedWA, setIsCopiedWA] = useState<boolean>(false);
  const [isGeneratingCard, setIsGeneratingCard] = useState<boolean>(false);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Helper untuk memicu simulasi streaming
  const triggerSimulation = (tpl: TaskTemplate, smart: boolean, customText = '', stackSession = false) => {
    if (streamTimerRef.current) clearInterval(streamTimerRef.current);

    const isImage = tpl.category === 'image';
    let targetText = '';
    if (customText) {
      targetText = smart
        ? 'Prompt spesifik diterima. Menghasilkan jawaban padat & langsung ke inti tanpa membuang siklus VRAM GPU.'
        : 'Halo! Pertanyaan yang luas sekali. Mari kita bahas secara bertele-tele dari latar belakang historis yang panjang hingga teori-teori tambahan yang menguras ribuan token...';
    } else {
      targetText = smart ? tpl.goodStream : tpl.badStream;
    }

    // Hitung ml yang diuapkan
    let evapIncrement = smart ? tpl.goodWaterTotalMl : tpl.badWaterTotalMl;
    if (stackSession) {
      // 1 sesi nugas = 20 chat teks + 1-2 gambar
      evapIncrement = smart ? 75 : 290;
    }

    const targetTemp = smart ? tpl.goodTemp : tpl.badTemp;

    setIsStreaming(true);
    setStreamedText('');

    let charIdx = 0;
    const totalChars = targetText.length;
    const baseRemaining = bottleRemainingMl < evapIncrement ? 600 : bottleRemainingMl;

    streamTimerRef.current = setInterval(() => {
      charIdx += Math.max(2, Math.floor(totalChars / 25));
      const progress = Math.min(1, charIdx / totalChars);
      setStreamedText(targetText.slice(0, charIdx));

      const currentDrained = Math.round(evapIncrement * progress);
      setSessionEvapTotalMl(currentDrained);
      setBottleRemainingMl(Math.max(0, baseRemaining - currentDrained));
      setCurrentGpuTemp(Number((48 + (targetTemp - 48) * progress).toFixed(1)));

      if (charIdx >= totalChars) {
        if (streamTimerRef.current) clearInterval(streamTimerRef.current);
        setIsStreaming(false);
      }
    }, 35);
  };

  useEffect(() => {
    triggerSimulation(selectedTpl, isSmartMode);
    return () => {
      if (streamTimerRef.current) clearInterval(streamTimerRef.current);
    };
  }, []);

  // Tutup modal jika tombol Escape ditekan
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpenedLegalModal(null);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // --- KALKULASI SKALA ANGKATAN SEKOLAH ---
  // Angka liter per prompt (kombinasi Scope 1 + 2)
  const chatMl = isClosedLoopSystem ? 1.5 : 8.5;
  const imageMl = isClosedLoopSystem ? 25.0 : 95.0;

  const totalChatWaterLiters = (studentCount * dailyChatPrompts * durationDays * chatMl) / 1000;
  // Gambar dihitung mingguan: durasi dalam minggu = durationDays / 7
  const totalWeeks = Math.max(1, durationDays / 7);
  const totalImageWaterLiters = (studentCount * weeklyImagePrompts * totalWeeks * imageMl) / 1000;
  const totalAngkatanLiters = Math.round(totalChatWaterLiters + totalImageWaterLiters);

  const gallonAquaCount = Math.max(1, Math.round(totalAngkatanLiters / 19));
  // Standar Bappenas/Cipta Karya: 60 liter air bersih/orang/hari (~240 L per keluarga 4 orang)
  const familyDaysSupply = Math.max(1, Math.round(totalAngkatanLiters / 240));
  const indomieBowlsCount = Math.max(1, Math.round((totalAngkatanLiters * 1000) / 400));
  const bobaCupsCount = Math.max(1, Math.round((totalAngkatanLiters * 1000) / 500));
  // 1 gambar AI = 1 full charge iPhone 15 (~0.013 kWh), 1 text prompt = ~0.03 full charge
  const phoneRechargeCount = Math.max(
    1,
    Math.round(
      studentCount * dailyChatPrompts * durationDays * 0.03 +
        studentCount * weeklyImagePrompts * totalWeeks * 1.0
    )
  );

  // --- HANDLER SALIN PESAN WHATSAPP ---
  const handleCopyWhatsApp = () => {
    const student = studentName.trim() || 'Pelajar SMA Peduli Lingkungan';
    const school = schoolName.trim() ? ` (${schoolName.trim()})` : '';

    const text = `🍜 *ANALOGI NUGAS AI GEN Z: SEBERAPA BOROS AIRNYA?* 🍜
Oleh: ${student}${school}

Ternyata kebiasaan nugas pakai AI di angkatan kami (${studentCount} siswa // ${durationDays} hari) berpotensi menguapkan:
🍜 *${indomieBowlsCount.toLocaleString('id-ID')} Mangkok Indomie Kuah* (kuah mi mendidih lenyap ke langit!)
🧋 *${bobaCupsCount.toLocaleString('id-ID')} Gelas Boba Brown Sugar*
📦 *${gallonAquaCount.toLocaleString('id-ID')} Galon Aqua 19L* (= jatah air ${familyDaysSupply.toLocaleString('id-ID')} hari keluarga pesisir)
📱 *${phoneRechargeCount.toLocaleString('id-ID')} Kali Cas Penuh Baterai iPhone*

*4 Jurus Green Prompting Pelajar:*
1. Prompt Spesifik & One-Shot (hemat 70% energi)
2. Pikirkan prompt gambar sebelum generate (stop re-roll 20x!)
3. Matikan AI untuk hal sepele yang ada di buku
4. Tuntut transparansi data center sesuai Pasal 33 UUD 1945

Kunjungi web simulasi edukatif:
The Thirsty Cloud: Literasi AI Hijau`;

    navigator.clipboard.writeText(text);
    setIsCopiedWA(true);
    setTimeout(() => setIsCopiedWA(false), 3000);
  };

  // --- CLIENT-SIDE INSTAGRAM STORY CARD GENERATOR (1080 x 1920 CANVAS) ---
  const handleDownloadStoryCard = () => {
    setIsGeneratingCard(true);
    const canvas = document.createElement('canvas');
    canvas.width = 1080;
    canvas.height = 1920;
    const ctx = canvas.getContext('2d');

    if (!ctx) {
      setIsGeneratingCard(false);
      return;
    }

    const student = studentName.trim() || 'Pelajar Indonesia';
    const school = schoolName.trim() || 'SMA Indonesia';

    // 1. Background Gradient Modern Dark
    const bgGrad = ctx.createLinearGradient(0, 0, 1080, 1920);
    bgGrad.addColorStop(0, '#0a0e17');
    bgGrad.addColorStop(0.5, '#0f172a');
    bgGrad.addColorStop(1, '#021a24');
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, 1080, 1920);

    // Grid halus latar belakang
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.04)';
    ctx.lineWidth = 2;
    for (let x = 0; x < 1080; x += 60) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, 1920);
      ctx.stroke();
    }
    for (let y = 0; y < 1920; y += 60) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(1080, y);
      ctx.stroke();
    }

    // Aksen Cahaya Cyan & Neon Amber
    const glow1 = ctx.createRadialGradient(200, 300, 50, 200, 300, 500);
    glow1.addColorStop(0, 'rgba(6, 182, 212, 0.15)');
    glow1.addColorStop(1, 'rgba(6, 182, 212, 0)');
    ctx.fillStyle = glow1;
    ctx.fillRect(0, 0, 1080, 800);

    const glow2 = ctx.createRadialGradient(880, 1500, 50, 880, 1500, 500);
    glow2.addColorStop(0, 'rgba(245, 158, 11, 0.12)');
    glow2.addColorStop(1, 'rgba(245, 158, 11, 0)');
    ctx.fillStyle = glow2;
    ctx.fillRect(400, 1000, 680, 920);

    // 2. Header Top Badge
    ctx.fillStyle = '#06b6d4';
    ctx.fillRect(80, 100, 12, 50);

    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 26px "JetBrains Mono", monospace';
    ctx.fillText('THE THIRSTY CLOUD // LITERASI AI HIJAU', 110, 135);

    ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
    ctx.font = '20px "JetBrains Mono", monospace';
    ctx.fillText('GERAKAN PELAJAR BIJAK KOMPUTASI & HAK AIR BERSIH', 110, 170);

    // 3. Main Hero Card
    ctx.fillStyle = 'rgba(15, 23, 42, 0.85)';
    ctx.strokeStyle = '#334155';
    ctx.lineWidth = 3;
    drawRoundedRect(ctx, 80, 230, 920, 330, 24);
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = '#38bdf8';
    ctx.font = 'bold 24px "JetBrains Mono", monospace';
    ctx.fillText('KARTU KOMITMEN PELAJAR', 120, 290);

    ctx.fillStyle = '#ffffff';
    ctx.font = '800 52px "Plus Jakarta Sans", sans-serif';
    ctx.fillText(student.toUpperCase(), 120, 360);

    ctx.fillStyle = '#94a3b8';
    ctx.font = '600 30px "Plus Jakarta Sans", sans-serif';
    ctx.fillText(school, 120, 410);

    ctx.fillStyle = '#06b6d4';
    ctx.font = 'bold 22px "JetBrains Mono", monospace';
    ctx.fillText('STATUS: ADVOKAT LITERASI AI HIJAU & PASAL 33 UUD 1945', 120, 480);

    // 4. Data Box: Angka Skala Sekolah (Gen Z Analogy Deck)
    ctx.fillStyle = 'rgba(30, 41, 59, 0.9)';
    ctx.strokeStyle = '#0284c7';
    ctx.lineWidth = 4;
    drawRoundedRect(ctx, 80, 590, 920, 470, 24);
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = '#f8fafc';
    ctx.font = 'bold 26px "JetBrains Mono", monospace';
    ctx.fillText(`DAMPAK 1 ANGKATAN (${studentCount} SISWA // 1 SEMESTER):`, 120, 650);

    // ANALOGI 1: MANGKOK INDOMIE
    ctx.fillStyle = '#f59e0b';
    ctx.font = '900 46px "JetBrains Mono", monospace';
    ctx.fillText(`🍜 ${indomieBowlsCount.toLocaleString('id-ID')} Mangkok`, 120, 725);
    ctx.fillStyle = '#cbd5e1';
    ctx.font = '22px "Plus Jakarta Sans", sans-serif';
    ctx.fillText('kuah Indomie rebus mendidih yang diuapkan ke atmosfer!', 120, 760);

    // Garis Pemisah 1
    ctx.strokeStyle = '#334155';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(120, 785);
    ctx.lineTo(960, 785);
    ctx.stroke();

    // ANALOGI 2: GALON AQUA & JATAH KELUARGA
    ctx.fillStyle = '#38bdf8';
    ctx.font = '900 42px "JetBrains Mono", monospace';
    ctx.fillText(`📦 ${gallonAquaCount.toLocaleString('id-ID')} Galon Aqua 19L`, 120, 840);
    ctx.fillStyle = '#cbd5e1';
    ctx.font = '22px "Plus Jakarta Sans", sans-serif';
    ctx.fillText(`= ${totalAngkatanLiters.toLocaleString('id-ID')} L air (Jatah ${familyDaysSupply.toLocaleString('id-ID')} hari warga pesisir Pantura / Batam)`, 120, 875);

    // Garis Pemisah 2
    ctx.strokeStyle = '#334155';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(120, 900);
    ctx.lineTo(960, 900);
    ctx.stroke();

    // ANALOGI 3: NGE-CHARGE IPHONE
    ctx.fillStyle = '#10b981';
    ctx.font = '900 38px "JetBrains Mono", monospace';
    ctx.fillText(`📱 ${phoneRechargeCount.toLocaleString('id-ID')}x Cas Penuh iPhone`, 120, 955);
    ctx.fillStyle = '#94a3b8';
    ctx.font = '20px "JetBrains Mono", monospace';
    ctx.fillText('Beban listrik GPU data center untuk tugas AI satu angkatan', 120, 990);

    // 5. Section 4 Jurus Green Prompting
    ctx.fillStyle = 'rgba(15, 23, 42, 0.85)';
    ctx.strokeStyle = '#334155';
    ctx.lineWidth = 2;
    drawRoundedRect(ctx, 80, 1090, 920, 580, 24);
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = '#10b981';
    ctx.font = 'bold 26px "JetBrains Mono", monospace';
    ctx.fillText('4 JURUS AKSI NYATA PELAJAR BIJAK AI:', 120, 1160);

    const tips = [
      {
        num: '01',
        title: 'Spesifik & One-Shot Prompt',
        desc: 'Batasi panjang & format sejak awal. Pangkas 70% token & energi komputasi.'
      },
      {
        num: '02',
        title: 'Pikir Matang Prompt Gambar',
        desc: '1 gambar AI = ~10-30x beban teks biasa. Hindari re-roll gambar 20x sembarangan.'
      },
      {
        num: '03',
        title: 'Gunakan AI Secara Tepat Guna',
        desc: 'Jangan pakai server GPU miliaran rupiah untuk hal dasar yang ada di kamus/buku.'
      },
      {
        num: '04',
        title: 'Kawal Hak Air & Regulasi Publik',
        desc: 'Dukung transparansi meteran WUE data center sesuai mandat Pasal 33 UUD 1945.'
      }
    ];

    tips.forEach((t, idx) => {
      const y = 1220 + idx * 105;
      ctx.fillStyle = '#0284c7';
      ctx.font = 'bold 28px "JetBrains Mono", monospace';
      ctx.fillText(t.num, 120, y);

      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 26px "Plus Jakarta Sans", sans-serif';
      ctx.fillText(t.title, 180, y);

      ctx.fillStyle = '#94a3b8';
      ctx.font = '20px "Plus Jakarta Sans", sans-serif';
      ctx.fillText(t.desc, 180, y + 32);
    });

    // 6. Footer & Watermark
    ctx.fillStyle = '#38bdf8';
    ctx.font = 'bold 26px "JetBrains Mono", monospace';
    ctx.fillText('Buka web simulasi lengkap di browser:', 120, 1750);

    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 36px "Plus Jakarta Sans", sans-serif';
    ctx.fillText('The Thirsty Cloud: Jejak Air AI & Integritas Publik', 120, 1800);

    ctx.fillStyle = '#64748b';
    ctx.font = '20px "JetBrains Mono", monospace';
    ctx.fillText('Civics Group 2 // Telkom University // Hak Asasi Air & Keadilan Ekologis', 120, 1845);

    // Download ke file PNG
    canvas.toBlob((blob) => {
      if (blob) {
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        const cleanName = (studentName || 'pelajar').toLowerCase().replace(/\s+/g, '-');
        a.href = url;
        a.download = `thirsty-cloud-komitmen-${cleanName}.png`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      }
      setIsGeneratingCard(false);
    }, 'image/png');
  };

  return (
    <div className="min-h-screen bg-[#F8F7F4] text-[#141517] font-sans selection:bg-[#141517] selection:text-[#F8F7F4]">
      {/* =================================================================
          NAVBAR: RINGKAS, RESPONSIF, & INDIKATOR DATA CENTER TROPIS
      ================================================================== */}
      <header className="sticky top-0 z-40 bg-[#F8F7F4]/95 backdrop-blur-md border-b-2 border-[#141517]">
        <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between text-xs font-mono">
          <div className="flex items-center gap-2.5 font-bold tracking-tight">
            <span className="px-2 py-0.5 bg-[#141517] text-[#F8F7F4] text-[11px] font-black tracking-wider">
              CIVICS
            </span>
            <span className="truncate max-w-[170px] sm:max-w-none text-stone-900 font-extrabold">
              THE THIRSTY CLOUD // AIR & AI
            </span>
          </div>

          <nav className="hidden lg:flex items-center gap-6 font-bold text-stone-700">
            <a href="#lab" className="hover:text-black hover:underline transition-colors">01. LAB MIKRO</a>
            <a href="#kalkulator" className="hover:text-black hover:underline transition-colors">02. SKALA ANGKATAN</a>
            <a href="#segitiga" className="hover:text-black hover:underline transition-colors">03. SEGITIGA DAMPAK</a>
            <a href="#regulasi" className="hover:text-black hover:underline transition-colors">04. PIPA & HUKUM</a>
            <a href="#aksi" className="hover:text-black hover:underline transition-colors">05. AKSI & STORY CARD</a>
          </nav>

          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-600 animate-pulse" />
            <span className="hidden sm:inline font-bold text-stone-700">WUE Tropis:</span>
            <span className="font-extrabold px-1.5 py-0.5 bg-stone-200 border border-stone-400 text-[11px]">
              1.5 – 2.2 L/kWh
            </span>
          </div>
        </div>

        {/* SUB-BAR MOBILE QUICK JUMP PILLS */}
        <div className="lg:hidden flex items-center gap-2 px-4 py-1.5 overflow-x-auto no-scrollbar border-t border-stone-200 bg-[#F8F7F4] text-[11px] font-mono font-bold whitespace-nowrap">
          <a href="#lab" className="px-2 py-0.5 bg-white border border-[#141517] shadow-[1px_1px_0px_#141517] hover:bg-stone-100">01. Lab Mikro</a>
          <a href="#kalkulator" className="px-2 py-0.5 bg-white border border-[#141517] shadow-[1px_1px_0px_#141517] hover:bg-stone-100">02. Skala Angkatan</a>
          <a href="#segitiga" className="px-2 py-0.5 bg-white border border-[#141517] shadow-[1px_1px_0px_#141517] hover:bg-stone-100">03. Segitiga Dampak</a>
          <a href="#regulasi" className="px-2 py-0.5 bg-white border border-[#141517] shadow-[1px_1px_0px_#141517] hover:bg-stone-100">04. Pipa & Hukum</a>
          <a href="#aksi" className="px-2 py-0.5 bg-white border border-[#141517] shadow-[1px_1px_0px_#141517] hover:bg-stone-100">05. Aksi Pelajar</a>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 pb-28">
        {/* =================================================================
            HERO: MINIMAL TEKS, FAKTA MENOHOK, 3 KARTU STATISTIK BESAR
        ================================================================== */}
        <section className="py-10 md:py-16 border-b-2 border-[#141517]">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-7 space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 border-2 border-[#141517] bg-white text-[11px] font-mono font-bold uppercase shadow-[2px_2px_0px_#141517]">
                <Droplet className="w-3.5 h-3.5 text-sky-600 fill-sky-600" />
                Literasi Digital & Ekologi Pelajar Indonesia
              </div>
              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-[1.08]">
                Di Balik Setiap Chat AI, Ada Air Bersih yang Menguap.
              </h1>
              <p className="text-base md:text-lg text-stone-700 max-w-xl font-normal leading-relaxed">
                Server GPU AI seperti <b>Nvidia H100</b> memanas hingga di atas 80°C. Di iklim tropis Indonesia, data center menguapkan jutaan liter air tawar setiap hari agar mesin tidak meleleh.
                Berapa banyak air yang hilang demi tugas sekolahmu?
              </p>

              {/* ANALOGI GEN Z CALLOUT */}
              <div className="p-3 bg-amber-50 border-2 border-[#141517] shadow-[2px_2px_0px_#141517] flex items-center gap-3 font-mono text-xs">
                <span className="text-2xl shrink-0">🍜</span>
                <div className="leading-snug">
                  <span className="font-extrabold text-[#141517] uppercase tracking-wide">Analogi Nyata Gen Z: </span>
                  <span className="text-stone-800">
                    1 sesi nugas AI = Kuah <b>1 Mangkok Indomie Rebus Kari</b> ludes menguap! 📱 1 gambar poster AI di Canva = Daya setara <b>nge-charge iPhone dari 0% sampai 100% penuh</b>!
                  </span>
                </div>
              </div>

              <div className="pt-2 flex flex-wrap gap-3">
                <a
                  href="#lab"
                  className="px-4 py-2.5 bg-[#141517] text-white text-xs font-mono font-bold flex items-center gap-2 shadow-[3px_3px_0px_#0284c7] hover:translate-x-0.5 hover:translate-y-0.5 transition-all"
                >
                  <Cpu className="w-4 h-4 text-sky-400" /> Uji Laboratorium Mikro
                </a>
                <a
                  href="#kalkulator"
                  className="px-4 py-2.5 bg-white border-2 border-[#141517] text-xs font-mono font-bold flex items-center gap-2 shadow-[3px_3px_0px_#141517] hover:bg-stone-50 transition-all"
                >
                  <Layers className="w-4 h-4 text-amber-600" /> Hitung Skala Sekolah
                </a>
              </div>
            </div>

            {/* 3 KARTU STATISTIK VISUAL UTAMA */}
            <div className="lg:col-span-5 grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-1 gap-3">
              <div className="bg-white border-2 border-[#141517] p-4 shadow-[4px_4px_0px_#141517] flex items-start gap-4">
                <div className="p-2.5 bg-red-100 border border-red-400 text-red-600 shrink-0">
                  <Flame className="w-6 h-6" />
                </div>
                <div>
                  <div className="font-mono text-3xl font-black tabular-nums tracking-tight">40–100 kW</div>
                  <div className="text-xs font-bold text-stone-800 mt-0.5">Panas per Rak Server GPU AI</div>
                  <div className="text-[11px] text-stone-500 font-mono mt-0.5">3–5x lebih panas dari server web biasa</div>
                </div>
              </div>

              <div className="bg-white border-2 border-[#141517] p-4 shadow-[4px_4px_0px_#141517] flex items-start gap-4">
                <div className="p-2.5 bg-sky-100 border border-sky-400 text-sky-700 shrink-0">
                  <Waves className="w-6 h-6" />
                </div>
                <div>
                  <div className="font-mono text-3xl font-black tabular-nums tracking-tight">1,1–2,5 Juta L</div>
                  <div className="text-xs font-bold text-stone-800 mt-0.5">Air Menguap per Hari / Fasilitas</div>
                  <div className="text-[11px] text-stone-500 font-mono mt-0.5">Pada fasilitas data center kapasitas 100 MW</div>
                </div>
              </div>

              <div className="bg-white border-2 border-[#141517] p-4 shadow-[4px_4px_0px_#141517] flex items-start gap-4">
                <div className="p-2.5 bg-amber-100 border border-amber-400 text-amber-700 shrink-0">
                  <AlertTriangle className="w-6 h-6" />
                </div>
                <div>
                  <div className="font-mono text-3xl font-black tabular-nums tracking-tight">5–10 cm / thn</div>
                  <div className="text-xs font-bold text-stone-800 mt-0.5">Laju Amblas Tanah Pesisir Bekasi</div>
                  <div className="text-[11px] text-stone-500 font-mono mt-0.5">Akibat penyedotan air tanah industri di Pantura</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* =================================================================
            BABAK 01: LABORATORIUM MIKRO (INTERAKTIF & AKURASI ILMIAH)
        ================================================================== */}
        <section id="lab" className="py-12 border-b-2 border-[#141517]">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6">
            <div>
              <span className="font-mono text-xs font-bold uppercase tracking-widest text-sky-700">
                01 // Laboratorium Mikro Pelajar
              </span>
              <h2 className="text-2xl md:text-3xl font-black tracking-tight">
                Uji Chatmu: Dari Sendok Teh hingga Menguras Botol
              </h2>
              <p className="text-xs md:text-sm text-stone-600 mt-1 max-w-2xl">
                Satu prompt teks pendek hanya butuh beberapa tetes air. Namun saat kita meminta AI membuat essay panjang atau me-roll gambar berulang kali, beban GPU melonjak drastis!
              </p>
            </div>

            {/* SWITCHER REKAYASA PROMPT: BOROS VS HIJAU */}
            <div className="inline-flex border-2 border-[#141517] bg-white p-1 self-start shrink-0 shadow-[2px_2px_0px_#141517]">
              <button
                onClick={() => {
                  setIsSmartMode(false);
                  triggerSimulation(selectedTpl, false, customPrompt, isSessionStacked);
                }}
                className={`px-3 py-1.5 text-xs font-mono font-bold transition-all ${
                  !isSmartMode ? 'bg-red-600 text-white' : 'text-[#141517] hover:bg-stone-100'
                }`}
              >
                PROMPT BERTELE-TELE
              </button>
              <button
                onClick={() => {
                  setIsSmartMode(true);
                  triggerSimulation(selectedTpl, true, customPrompt, isSessionStacked);
                }}
                className={`px-3 py-1.5 text-xs font-mono font-bold transition-all ${
                  isSmartMode ? 'bg-emerald-700 text-white' : 'text-[#141517] hover:bg-stone-100'
                }`}
              >
                PROMPT HIJAU (ONE-SHOT)
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
            {/* KIRI: PEMILIH TEMPLATE TUGAS SMA & TERMINAL STREAMING */}
            <div className="lg:col-span-6 bg-white border-2 border-[#141517] shadow-[4px_4px_0px_#141517] p-5 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between text-[11px] font-mono font-bold uppercase text-stone-500 mb-2">
                  <span>Pilih Tugas Sekolah:</span>
                  <span className="text-sky-700 font-extrabold">{selectedTpl.categoryLabel}</span>
                </div>

                <div className="grid grid-cols-2 gap-2 mb-4">
                  {TEMPLATES.map((tpl) => {
                    const isSelected = selectedTpl.id === tpl.id && !customPrompt;
                    return (
                      <button
                        key={tpl.id}
                        onClick={() => {
                          setSelectedTpl(tpl);
                          setCustomPrompt('');
                          triggerSimulation(tpl, isSmartMode, '', isSessionStacked);
                        }}
                        className={`p-2.5 text-left text-xs font-mono font-bold border-2 transition-all flex flex-col justify-between ${
                          isSelected
                            ? 'border-[#141517] bg-[#141517] text-white'
                            : 'border-stone-300 bg-[#F8F7F4] hover:border-[#141517]'
                        }`}
                      >
                        <div className="flex items-center gap-1.5">
                          {tpl.category === 'image' ? (
                            <ImageIcon className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                          ) : tpl.category === 'deep' ? (
                            <Zap className="w-3.5 h-3.5 text-sky-400 shrink-0" />
                          ) : (
                            <MessageSquare className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                          )}
                          <span className="truncate">{tpl.label}</span>
                        </div>
                        <div
                          className={`text-[10px] font-mono mt-1 ${
                            isSelected ? 'text-stone-300' : 'text-stone-500'
                          }`}
                        >
                          {tpl.category === 'image' ? '~45–135 ml' : tpl.category === 'deep' ? '~8–38 ml' : '~3–15 ml'}
                        </div>
                      </button>
                    );
                  })}
                </div>

                {/* BUBBLE PROMPT YANG DIKIRIM */}
                <div className="p-3 bg-[#F8F7F4] border border-stone-300 mb-3">
                  <div className="flex items-center justify-between text-[10px] font-mono font-bold uppercase text-stone-500 mb-1">
                    <span>Prompt Masuk Siswa</span>
                    <span className={isSmartMode ? 'text-emerald-700' : 'text-red-600'}>
                      {isSmartMode ? 'HEMAT DAYA (SPESIFIK)' : 'BERTELE-TELE (BOROS TOKEN)'}
                    </span>
                  </div>
                  <p className="text-xs font-mono font-medium leading-relaxed text-stone-900">
                    "{customPrompt || (isSmartMode ? selectedTpl.goodPrompt : selectedTpl.badPrompt)}"
                  </p>
                </div>

                {/* TERMINAL STREAMING OUTPUT */}
                <div className="p-3.5 bg-[#141517] text-[#F8F7F4] font-mono text-xs min-h-[140px] relative">
                  <div className="flex items-center justify-between text-[10px] text-stone-400 border-b border-stone-700 pb-1.5 mb-2">
                    <span className="flex items-center gap-1.5">
                      <Cpu className="w-3.5 h-3.5 text-sky-400" />
                      GPU CLUSTER H100 (CIKARANG KEK)
                    </span>
                    <span className={isStreaming ? 'text-amber-400 animate-pulse font-bold' : 'text-stone-400'}>
                      {isStreaming ? 'KOMPUTASI MENGEPUL...' : 'KOMPUTASI SELESAI'}
                    </span>
                  </div>
                  <p className="whitespace-pre-line leading-relaxed text-stone-200">
                    {streamedText}
                    {isStreaming && <span className="inline-block w-2 h-3.5 bg-sky-400 ml-1 animate-pulse" />}
                  </p>
                </div>
              </div>

              {/* INPUT PROMPT KUSTOM */}
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  if (!customPrompt.trim()) return;
                  triggerSimulation(selectedTpl, isSmartMode, customPrompt, isSessionStacked);
                }}
                className="mt-4 flex gap-2"
              >
                <input
                  type="text"
                  value={customPrompt}
                  onChange={(e) => setCustomPrompt(e.target.value)}
                  placeholder="Atau ketik prompt bebas tugasmu di sini..."
                  className="flex-1 px-3 py-2 text-xs font-mono border-2 border-[#141517] bg-[#F8F7F4] focus:outline-none"
                />
                <button
                  type="submit"
                  className="px-3.5 py-2 bg-[#141517] text-white text-xs font-mono font-bold flex items-center gap-1.5 hover:bg-stone-800 transition-colors"
                >
                  <Send className="w-3.5 h-3.5" /> Uji
                </button>
              </form>
            </div>

            {/* KANAN: BOTOL AIR 600ML, MIKRO VS MAKRO, & TOMBOL SESI NUGAS */}
            <div className="lg:col-span-6 bg-white border-2 border-[#141517] shadow-[4px_4px_0px_#141517] p-5 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between border-b border-stone-200 pb-2.5">
                  <div>
                    <div className="text-[10px] font-mono font-bold uppercase text-stone-500">
                      Visualisasi Nyata Gen Z
                    </div>
                    <div className="text-base font-black">
                      {isSessionStacked ? '1 Sesi Nugas (20 Chat + Gambar)' : 'Dampak 1 Prompt Tunggal'}
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      setBottleRemainingMl(600);
                      setSessionEvapTotalMl(0);
                      setIsSessionStacked(false);
                      triggerSimulation(selectedTpl, isSmartMode, customPrompt, false);
                    }}
                    className="px-2.5 py-1 border-2 border-[#141517] text-xs font-mono font-bold flex items-center gap-1 hover:bg-stone-100 transition-colors"
                  >
                    <RotateCcw className="w-3 h-3" /> Isi Ulang (Reset)
                  </button>
                </div>

                {/* CONTAINER ANALOGY SWITCHER (GEN Z TABS) */}
                <div className="flex items-center gap-1 p-1 bg-[#F8F7F4] border-2 border-[#141517] mt-3 mb-2 font-mono text-[11px] font-bold">
                  <button
                    onClick={() => setContainerView('indomie')}
                    className={`flex-1 py-1 px-1.5 flex items-center justify-center gap-1 transition-all ${
                      containerView === 'indomie'
                        ? 'bg-[#141517] text-white shadow-[1px_1px_0px_#f59e0b]'
                        : 'text-stone-700 hover:bg-stone-200'
                    }`}
                  >
                    🍜 Mangkok Indomie (400ml)
                  </button>
                  <button
                    onClick={() => setContainerView('bottle')}
                    className={`flex-1 py-1 px-1.5 flex items-center justify-center gap-1 transition-all ${
                      containerView === 'bottle'
                        ? 'bg-[#141517] text-white shadow-[1px_1px_0px_#0284c7]'
                        : 'text-stone-700 hover:bg-stone-200'
                    }`}
                  >
                    🍼 Botol Aqua (600ml)
                  </button>
                  <button
                    onClick={() => setContainerView('battery')}
                    className={`flex-1 py-1 px-1.5 flex items-center justify-center gap-1 transition-all ${
                      containerView === 'battery'
                        ? 'bg-[#141517] text-white shadow-[1px_1px_0px_#10b981]'
                        : 'text-stone-700 hover:bg-stone-200'
                    }`}
                  >
                    📱 Baterai iPhone
                  </button>
                </div>

                {/* AREA VISUALISASI DINAMIS */}
                <div className="grid grid-cols-12 gap-3 items-center my-2">
                  {/* VISUAL CONTAINER (KIRI) */}
                  <div className="col-span-5 flex flex-col items-center">
                    {containerView === 'indomie' ? (
                      /* SVG MANGKOK AYAM JAGO INDOMIE KUAH TELUR */
                      <div className="flex flex-col items-center">
                        <svg viewBox="0 0 160 160" className="w-36 h-36 overflow-visible">
                          {/* Animasi Uap Kuah Mendidih */}
                          {(isStreaming || sessionEvapTotalMl > 0) && (
                            <g className="stroke-amber-600" fill="none" strokeWidth="2.5" strokeLinecap="round">
                              <path d="M55 25 Q 48 10, 60 -5 T 52 -22" className="animate-bounce" opacity="0.8" />
                              <path d="M80 18 Q 88 5, 75 -10 T 82 -28" className="animate-pulse" opacity="0.9" />
                              <path d="M105 25 Q 112 10, 100 -5 T 106 -22" className="animate-bounce" opacity="0.8" />
                            </g>
                          )}
                          {/* Bayangan Mangkok */}
                          <ellipse cx="80" cy="142" rx="55" ry="9" fill="#000000" opacity="0.12" />
                          {/* Badan Mangkok Keramik */}
                          <path
                            d="M32 75 Q 28 135, 80 135 Q 132 135, 128 75 Z"
                            fill="#ffffff"
                            stroke="#141517"
                            strokeWidth="3.5"
                          />
                          {/* Motif Garis Mangkok Ayam Jago */}
                          <path d="M34 88 Q 80 98, 126 88" stroke="#dc2626" strokeWidth="3" fill="none" />
                          <path d="M37 96 Q 80 106, 123 96" stroke="#0284c7" strokeWidth="2" fill="none" />

                          {/* Bibir Mangkok */}
                          <ellipse cx="80" cy="75" rx="48" ry="16" fill="#F8F7F4" stroke="#141517" strokeWidth="3.5" />

                          {/* Mie Kuning Keriting di Dalam Mangkok */}
                          <g stroke="#f59e0b" strokeWidth="3" fill="none" strokeLinecap="round">
                            <path d="M48 76 Q 58 68, 68 76 T 88 76 T 108 76" />
                            <path d="M42 82 Q 52 74, 62 82 T 82 82 T 102 82 T 118 82" />
                            <path d="M46 88 Q 56 80, 66 88 T 86 88 T 106 88" />
                          </g>

                          {/* Irisan Telur Rebus */}
                          <ellipse cx="64" cy="74" rx="13" ry="9" fill="#ffffff" stroke="#141517" strokeWidth="1.5" />
                          <circle cx="64" cy="74" r="5" fill="#f97316" />

                          {/* Taburan Daun Bawang */}
                          <rect x="94" y="70" width="4" height="4" fill="#22c55e" rx="1" />
                          <rect x="104" y="74" width="4" height="4" fill="#22c55e" rx="1" />
                          <rect x="86" y="80" width="4" height="4" fill="#22c55e" rx="1" />

                          {/* Kuah Kaldu Indomie (Menyesuaikan dengan sessionEvapTotalMl) */}
                          {(() => {
                            const soupRemaining = Math.max(0, 400 - sessionEvapTotalMl);
                            const soupHeight = (soupRemaining / 400) * 16;
                            if (soupRemaining <= 0) return null;
                            return (
                              <ellipse
                                cx="80"
                                cy={75 + (16 - soupHeight) * 0.5}
                                rx={46 * (soupRemaining / 400)}
                                ry={soupHeight}
                                fill="#d97706"
                                fillOpacity="0.75"
                                className="transition-all duration-300"
                              />
                            );
                          })()}
                        </svg>
                        <div className="font-mono text-[11px] font-bold mt-1 text-center">
                          Kuah: <span className="underline">{Math.max(0, 400 - sessionEvapTotalMl)} ml</span> / 400 ml
                        </div>
                      </div>
                    ) : containerView === 'bottle' ? (
                      /* SVG BOTOL AIR 600ML */
                      <div className="flex flex-col items-center">
                        <svg viewBox="0 0 140 260" className="w-28 h-48 overflow-visible">
                          {(isStreaming || sessionEvapTotalMl > 0) && (
                            <g className="stroke-stone-400" fill="none" strokeWidth="2" strokeLinecap="round">
                              <path d="M55 12 Q 48 2, 58 -8 T 55 -24" className="animate-bounce" />
                              <path d="M70 10 Q 78 0, 68 -10 T 72 -26" className="animate-pulse" />
                              <path d="M85 12 Q 92 2, 82 -8 T 85 -24" className="animate-bounce" />
                            </g>
                          )}
                          <rect x="52" y="14" width="36" height="12" fill="#141517" />
                          <path
                            d="M55 26 L55 42 L30 68 L30 236 C30 242 35 246 42 246 L98 246 C105 246 110 242 110 236 L110 68 L85 42 L85 26 Z"
                            fill="#F8F7F4"
                            stroke="#141517"
                            strokeWidth="3"
                          />
                          <clipPath id="bottleWaterClipModal">
                            <path d="M55 26 L55 42 L30 68 L30 236 C30 242 35 246 42 246 L98 246 C105 246 110 242 110 236 L110 68 L85 42 L85 26 Z" />
                          </clipPath>
                          <g clipPath="url(#bottleWaterClipModal)">
                            {(() => {
                              const maxH = 178;
                              const h = (bottleRemainingMl / 600) * maxH;
                              const yPos = 246 - h;
                              return (
                                <rect
                                  x="25"
                                  y={yPos}
                                  width="90"
                                  height={h}
                                  fill={isSmartMode ? '#0284c7' : '#dc2626'}
                                  fillOpacity="0.85"
                                  className="transition-all duration-300"
                                />
                              );
                            })()}
                          </g>
                          <line x1="26" y1="127" x2="114" y2="127" stroke="#141517" strokeWidth="1.5" strokeDasharray="3 3" />
                          <text x="116" y="130" className="text-[9px] font-mono font-bold fill-[#141517]">
                            400ml
                          </text>
                        </svg>
                        <div className="font-mono text-[11px] font-bold mt-1 text-center">
                          Sisa: <span className="underline">{bottleRemainingMl} ml</span> / 600 ml
                        </div>
                      </div>
                    ) : (
                      /* SVG BATERAI IPHONE (CHARGING GAUGE) */
                      <div className="flex flex-col items-center">
                        <svg viewBox="0 0 120 180" className="w-28 h-44 overflow-visible">
                          {/* Smartphone Body */}
                          <rect x="15" y="10" width="90" height="160" rx="18" fill="#0f172a" stroke="#141517" strokeWidth="3" />
                          {/* Notch / Dynamic Island */}
                          <rect x="42" y="18" width="36" height="8" rx="4" fill="#000000" />
                          {/* Battery Shell */}
                          <rect x="30" y="45" width="60" height="100" rx="8" fill="#1e293b" stroke="#64748b" strokeWidth="2" />
                          <rect x="50" y="38" width="20" height="7" rx="2" fill="#64748b" />
                          {/* Battery Fill Level */}
                          {(() => {
                            const isImg = selectedTpl.category === 'image';
                            const fillPct = isImg ? 100 : selectedTpl.category === 'deep' ? 35 : 12;
                            const h = (fillPct / 100) * 88;
                            return (
                              <rect
                                x="36"
                                y={139 - h}
                                width="48"
                                height={h}
                                rx="4"
                                fill={isImg ? '#ef4444' : isSmartMode ? '#10b981' : '#f59e0b'}
                                className="transition-all duration-300"
                              />
                            );
                          })()}
                          {/* Charging Lightning Bolt */}
                          <path
                            d="M62 75 L54 95 L62 95 L58 115 L70 93 L62 93 Z"
                            fill="#ffffff"
                            stroke="#141517"
                            strokeWidth="1.5"
                          />
                        </svg>
                        <div className="font-mono text-[11px] font-bold mt-1 text-center">
                          {selectedTpl.category === 'image'
                            ? '100% Cas Penuh iPhone'
                            : selectedTpl.category === 'deep'
                            ? '~35% Daya Cas HP'
                            : '~12% Daya Cas HP'}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* DETAIL ANALOGI GEN Z (KANAN) */}
                  <div className="col-span-7 space-y-2">
                    {/* METRIK KUAH INDOMIE */}
                    <div className="p-2 bg-amber-50 border border-amber-300">
                      <div className="flex justify-between items-center text-[11px] font-mono font-bold text-amber-950">
                        <span>🍜 KUAH INDOMIE KARI</span>
                        <span className="font-extrabold text-amber-900">
                          {((sessionEvapTotalMl || (isSmartMode ? selectedTpl.goodWaterTotalMl : selectedTpl.badWaterTotalMl)) / 400).toFixed(2)}x Mangkok
                        </span>
                      </div>
                      <div className="text-[10px] text-amber-800 font-mono mt-0.5">
                        {sessionEvapTotalMl >= 400
                          ? '🔥 1 mangkok kuah Indomie mendidih habis!'
                          : '1 mangkok mi butuh 400 ml air mendidih'}
                      </div>
                    </div>

                    {/* METRIK CUP BOBA */}
                    <div className="p-2 bg-sky-50 border border-sky-300">
                      <div className="flex justify-between items-center text-[11px] font-mono font-bold text-sky-950">
                        <span>🧋 CUP BOBA / ES KOPI</span>
                        <span className="font-extrabold text-sky-900">
                          {((sessionEvapTotalMl || (isSmartMode ? selectedTpl.goodWaterTotalMl : selectedTpl.badWaterTotalMl)) / 500).toFixed(2)}x Gelas
                        </span>
                      </div>
                      <div className="text-[10px] text-sky-800 font-mono mt-0.5">Ukuran cup reguler (500 ml)</div>
                    </div>

                    {/* METRIK CAS IPHONE */}
                    <div className="p-2 bg-emerald-50 border border-emerald-300">
                      <div className="flex justify-between items-center text-[11px] font-mono font-bold text-emerald-950">
                        <span>📱 CAS PENUH IPHONE</span>
                        <span className="font-extrabold text-emerald-900">
                          {selectedTpl.category === 'image' ? '1.0x (100% Penuh)' : '0.05x Cas'}
                        </span>
                      </div>
                      <div className="text-[10px] text-emerald-800 font-mono mt-0.5">
                        {selectedTpl.category === 'image'
                          ? 'Beban difusi gambar setara ngecas HP dari 0-100%'
                          : 'Chat teks butuh daya jauh lebih kecil'}
                      </div>
                    </div>

                    {/* METRIK SUHU GPU */}
                    <div className="p-2 bg-[#F8F7F4] border border-[#141517]">
                      <div className="flex justify-between text-[11px] font-mono font-bold text-stone-700">
                        <span className="flex items-center gap-1">
                          <Thermometer className="w-3.5 h-3.5 text-red-500" />
                          SUHU CHIP GPU H100
                        </span>
                        <span className="text-red-600 font-bold">{currentGpuTemp}°C</span>
                      </div>
                      <div className="w-full h-1.5 bg-stone-200 border border-[#141517] mt-1 overflow-hidden">
                        <div
                          className="h-full bg-amber-500 transition-all duration-300"
                          style={{ width: `${Math.min(100, ((currentGpuTemp - 40) / 50) * 100)}%` }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* TOMBOL PENGUJI: TUMPUK 1 SESI NUGAS */}
              <div className="pt-2.5 border-t border-stone-200">
                <button
                  onClick={() => {
                    const nextState = !isSessionStacked;
                    setIsSessionStacked(nextState);
                    triggerSimulation(selectedTpl, isSmartMode, customPrompt, nextState);
                  }}
                  className={`w-full py-2.5 px-3 border-2 font-mono text-xs font-bold flex items-center justify-between transition-all ${
                    isSessionStacked
                      ? 'border-[#141517] bg-red-50 text-red-950'
                      : 'border-[#141517] bg-[#141517] text-white hover:bg-stone-800'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <Zap className={`w-4 h-4 ${isSessionStacked ? 'text-red-600' : 'text-amber-400'}`} />
                    <span>
                      {isSessionStacked
                        ? 'SEDANG MENAMPILKAN: 1 Sesi Nugas (20 Chat + Gambar)'
                        : 'SIMULASIKAN 1 SESI NUGAS (20 Chat + 1 Gambar)'}
                    </span>
                  </div>
                  <span className="text-[11px] underline">
                    {isSessionStacked ? 'Kembalikan ke 1 Prompt' : 'Klik untuk Uji'}
                  </span>
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* =================================================================
            BABAK 02: KALKULATOR SKALA ANGKATAN SEKOLAH
        ================================================================== */}
        <section id="kalkulator" className="py-12 border-b-2 border-[#141517]">
          <div className="mb-6">
            <span className="font-mono text-xs font-bold uppercase tracking-widest text-sky-700">
              02 // Skala Satu Angkatan Siswa
            </span>
            <h2 className="text-2xl md:text-3xl font-black tracking-tight">
              Geser Slider: Lihat Galon Air yang Lenyap di Sekolahmu
            </h2>
            <p className="text-xs md:text-sm text-stone-600 mt-1 max-w-2xl">
              Tetesan sendok teh dari tiap siswa berlipat ganda saat ratusan anak SMA nugas setiap hari. Simulasikan volume air bersih yang diuapkan angkatanmu ke atmosfer.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* KONTROL SLIDER */}
            <div className="lg:col-span-5 bg-white border-2 border-[#141517] shadow-[4px_4px_0px_#141517] p-5 space-y-4">
              {/* SLIDER SISWA */}
              <div>
                <div className="flex justify-between font-mono text-xs font-bold mb-1.5">
                  <span>JUMLAH SISWA ANGKATAN</span>
                  <span className="px-2 py-0.5 bg-[#141517] text-white">{studentCount} Siswa</span>
                </div>
                <input
                  type="range"
                  min="20"
                  max="400"
                  step="10"
                  value={studentCount}
                  onChange={(e) => setStudentCount(Number(e.target.value))}
                  className="w-full accent-[#141517] cursor-pointer"
                />
                <div className="flex justify-between text-[10px] font-mono text-stone-500 mt-0.5">
                  <span>1 Kelas (30)</span>
                  <span>1 Angkatan (150)</span>
                  <span>1 Sekolah (400)</span>
                </div>
              </div>

              {/* SLIDER CHAT TEKS HARIAN */}
              <div>
                <div className="flex justify-between font-mono text-xs font-bold mb-1.5">
                  <span>CHAT TEKS / SISWA / HARI</span>
                  <span className="px-2 py-0.5 bg-[#141517] text-white">{dailyChatPrompts} Pertanyaan</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="40"
                  value={dailyChatPrompts}
                  onChange={(e) => setDailyChatPrompts(Number(e.target.value))}
                  className="w-full accent-[#141517] cursor-pointer"
                />
              </div>

              {/* SLIDER GENERATE GAMBAR MINGGUAN */}
              <div>
                <div className="flex justify-between font-mono text-xs font-bold mb-1.5">
                  <span>GAMBAR AI / SISWA / MINGGU</span>
                  <span className="px-2 py-0.5 bg-[#141517] text-white">{weeklyImagePrompts} Gambar</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="10"
                  value={weeklyImagePrompts}
                  onChange={(e) => setWeeklyImagePrompts(Number(e.target.value))}
                  className="w-full accent-[#141517] cursor-pointer"
                />
                <div className="text-[10px] font-mono text-stone-500 mt-0.5">
                  Termasuk Canva AI, poster, atau stiker AI
                </div>
              </div>

              {/* DURASI BELAJAR */}
              <div>
                <div className="font-mono text-xs font-bold mb-1.5">DURASI BELAJAR SEKOLAH</div>
                <div className="grid grid-cols-3 gap-2 font-mono text-xs">
                  {[
                    { label: '1 Bulan', days: 30 },
                    { label: '1 Semester', days: 120 },
                    { label: '1 Tahun', days: 240 }
                  ].map((dur) => (
                    <button
                      key={dur.days}
                      onClick={() => setDurationDays(dur.days)}
                      className={`py-2 font-bold border-2 transition-all ${
                        durationDays === dur.days
                          ? 'border-[#141517] bg-[#141517] text-white'
                          : 'border-stone-300 bg-[#F8F7F4] hover:border-[#141517]'
                      }`}
                    >
                      {dur.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* TOGGLE CLOSED-LOOP SYSTEM */}
              <div className="pt-2 border-t border-stone-200">
                <button
                  onClick={() => setIsClosedLoopSystem(!isClosedLoopSystem)}
                  className={`w-full p-3 border-2 text-left font-mono text-xs flex items-center justify-between transition-colors ${
                    isClosedLoopSystem
                      ? 'border-emerald-700 bg-emerald-50 text-emerald-950'
                      : 'border-[#141517] bg-[#F8F7F4] hover:bg-stone-100'
                  }`}
                >
                  <div>
                    <div className="font-bold flex items-center gap-1.5">
                      <Droplet className={`w-3.5 h-3.5 ${isClosedLoopSystem ? 'text-emerald-700' : 'text-stone-500'}`} />
                      {isClosedLoopSystem ? 'CLOSED-LOOP AKTIF (Hemat 85% Air)' : 'SIMULASIKAN SISTEM CLOSED-LOOP'}
                    </div>
                    <div className="text-[10px] text-stone-600 mt-0.5">
                      Sirkulasi air pendingin tertutup tanpa penguapan air tanah
                    </div>
                  </div>
                  <div
                    className={`w-4 h-4 border-2 border-[#141517] flex items-center justify-center shrink-0 ${
                      isClosedLoopSystem ? 'bg-emerald-600 text-white' : 'bg-white'
                    }`}
                  >
                    {isClosedLoopSystem && <Check className="w-3 h-3" />}
                  </div>
                </button>
              </div>
            </div>

            {/* HASIL VISUAL & PIKTOGRAF GALON */}
            <div className="lg:col-span-7 bg-white border-2 border-[#141517] shadow-[4px_4px_0px_#141517] p-5 flex flex-col justify-between">
              <div className="grid grid-cols-3 gap-3 border-b-2 border-[#141517] pb-4">
                <div>
                  <div className="text-[10px] font-mono uppercase text-stone-500">Total Air Menguap</div>
                  <div className="font-mono text-2xl sm:text-3xl font-black text-sky-800 tabular-nums">
                    {totalAngkatanLiters.toLocaleString('id-ID')} L
                  </div>
                  <div className="text-[10px] font-mono text-stone-500">Air tawar lenyap</div>
                </div>
                <div>
                  <div className="text-[10px] font-mono uppercase text-stone-500">Setara Galon Aqua 19L</div>
                  <div className="font-mono text-2xl sm:text-3xl font-black text-[#141517] tabular-nums">
                    {gallonAquaCount.toLocaleString('id-ID')}
                  </div>
                  <div className="text-[10px] font-mono text-stone-500">Galon air minum</div>
                </div>
                <div>
                  <div className="text-[10px] font-mono uppercase text-stone-500">Jatah Keluarga Pesisir</div>
                  <div className="font-mono text-2xl sm:text-3xl font-black text-red-600 tabular-nums">
                    {familyDaysSupply.toLocaleString('id-ID')} Hari
                  </div>
                  <div className="text-[10px] font-mono text-stone-500">Kebutuhan pokok (240L/hr)</div>
                </div>
              </div>

              {/* ANALOGY MATRIX CONTROLLER (GEN Z TABS) */}
              <div className="my-3">
                <div className="flex items-center justify-between text-[11px] font-mono font-bold mb-1.5">
                  <span>PILIH ANALOGI VISUAL SKALA ANGKATAN:</span>
                  <span className="text-amber-800 font-extrabold uppercase">Mode Gen Z</span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5 p-1 bg-[#F8F7F4] border-2 border-[#141517] mb-2.5 font-mono text-xs font-bold">
                  <button
                    onClick={() => setAnalogyMatrixMode('indomie')}
                    className={`py-1.5 px-2 flex items-center justify-center gap-1 transition-all ${
                      analogyMatrixMode === 'indomie'
                        ? 'bg-[#141517] text-white shadow-[2px_2px_0px_#f59e0b]'
                        : 'text-stone-700 hover:bg-stone-200'
                    }`}
                  >
                    🍜 Indomie Kuah
                  </button>
                  <button
                    onClick={() => setAnalogyMatrixMode('boba')}
                    className={`py-1.5 px-2 flex items-center justify-center gap-1 transition-all ${
                      analogyMatrixMode === 'boba'
                        ? 'bg-[#141517] text-white shadow-[2px_2px_0px_#0284c7]'
                        : 'text-stone-700 hover:bg-stone-200'
                    }`}
                  >
                    🧋 Gelas Boba
                  </button>
                  <button
                    onClick={() => setAnalogyMatrixMode('gallon')}
                    className={`py-1.5 px-2 flex items-center justify-center gap-1 transition-all ${
                      analogyMatrixMode === 'gallon'
                        ? 'bg-[#141517] text-white shadow-[2px_2px_0px_#0284c7]'
                        : 'text-stone-700 hover:bg-stone-200'
                    }`}
                  >
                    📦 Galon Aqua
                  </button>
                  <button
                    onClick={() => setAnalogyMatrixMode('phone')}
                    className={`py-1.5 px-2 flex items-center justify-center gap-1 transition-all ${
                      analogyMatrixMode === 'phone'
                        ? 'bg-[#141517] text-white shadow-[2px_2px_0px_#10b981]'
                        : 'text-stone-700 hover:bg-stone-200'
                    }`}
                  >
                    📱 Cas iPhone
                  </button>
                </div>

                {/* HEADER ANALOGI AKTIF */}
                <div className="p-2 bg-white border-2 border-[#141517] mb-2 flex items-center justify-between font-mono text-xs font-bold">
                  {analogyMatrixMode === 'indomie' && (
                    <div className="flex items-center gap-2">
                      <span className="text-xl">🍜</span>
                      <span>
                        TOTAL: <b className="text-amber-800 text-sm">{indomieBowlsCount.toLocaleString('id-ID')} Mangkok Indomie</b>
                        <span className="text-stone-500 text-[10px] ml-2">(1 Ikon = 50 Mangkok)</span>
                      </span>
                    </div>
                  )}
                  {analogyMatrixMode === 'boba' && (
                    <div className="flex items-center gap-2">
                      <span className="text-xl">🧋</span>
                      <span>
                        TOTAL: <b className="text-sky-800 text-sm">{bobaCupsCount.toLocaleString('id-ID')} Gelas Boba</b>
                        <span className="text-stone-500 text-[10px] ml-2">(1 Ikon = 50 Gelas)</span>
                      </span>
                    </div>
                  )}
                  {analogyMatrixMode === 'gallon' && (
                    <div className="flex items-center gap-2">
                      <span className="text-xl">📦</span>
                      <span>
                        TOTAL: <b className="text-[#141517] text-sm">{gallonAquaCount.toLocaleString('id-ID')} Galon Aqua 19L</b>
                        <span className="text-stone-500 text-[10px] ml-2">(1 Ikon = 10 Galon)</span>
                      </span>
                    </div>
                  )}
                  {analogyMatrixMode === 'phone' && (
                    <div className="flex items-center gap-2">
                      <span className="text-xl">📱</span>
                      <span>
                        TOTAL: <b className="text-emerald-800 text-sm">{phoneRechargeCount.toLocaleString('id-ID')} Kali Cas iPhone</b>
                        <span className="text-stone-500 text-[10px] ml-2">(1 Ikon = 100 Kali Cas)</span>
                      </span>
                    </div>
                  )}
                </div>

                {/* MATRIKS DINAMIS BERDASARKAN MODE ANALOGI */}
                <div className="p-3 bg-[#F8F7F4] border border-stone-300 min-h-[130px] max-h-[170px] overflow-y-auto grid grid-cols-10 sm:grid-cols-15 gap-1.5 content-start">
                  {(() => {
                    const divisor =
                      analogyMatrixMode === 'indomie' ? 50 : analogyMatrixMode === 'boba' ? 50 : analogyMatrixMode === 'phone' ? 100 : 10;
                    const totalItems =
                      analogyMatrixMode === 'indomie'
                        ? indomieBowlsCount
                        : analogyMatrixMode === 'boba'
                        ? bobaCupsCount
                        : analogyMatrixMode === 'phone'
                        ? phoneRechargeCount
                        : gallonAquaCount;
                    const count = Math.min(150, Math.max(1, Math.ceil(totalItems / divisor)));

                    return Array.from({ length: count }).map((_, i) => (
                      <div
                        key={i}
                        title={`${(i + 1) * divisor}`}
                        className={`h-7 border border-[#141517] flex items-center justify-center text-xs transition-all ${
                          analogyMatrixMode === 'indomie'
                            ? 'bg-amber-100 hover:bg-amber-200'
                            : analogyMatrixMode === 'boba'
                            ? 'bg-sky-100 hover:bg-sky-200'
                            : analogyMatrixMode === 'phone'
                            ? 'bg-emerald-100 hover:bg-emerald-200'
                            : isClosedLoopSystem
                            ? 'bg-emerald-500 text-white'
                            : 'bg-sky-600 text-white'
                        }`}
                      >
                        {analogyMatrixMode === 'indomie' ? (
                          '🍜'
                        ) : analogyMatrixMode === 'boba' ? (
                          '🧋'
                        ) : analogyMatrixMode === 'phone' ? (
                          '⚡'
                        ) : (
                          <Droplet className="w-3.5 h-3.5 fill-white" />
                        )}
                      </div>
                    ));
                  })()}
                </div>
              </div>

              {/* KARTU PUNCHLINE GEN Z BERDASARKAN MODE */}
              <div className="text-xs font-mono text-stone-900 bg-amber-50 border-2 border-amber-400 p-3 leading-relaxed shadow-[2px_2px_0px_#141517]">
                {analogyMatrixMode === 'indomie' && (
                  <span>
                    🍜 <b>Fakta Menohok:</b> Kuah mi sebanyak <b>{indomieBowlsCount.toLocaleString('id-ID')} mangkok</b> ini cukup buat nraktir seluruh angkatanmu ({studentCount} siswa) makan Indomie kuah tiap hari selama <b>{Math.max(1, Math.round(indomieBowlsCount / (studentCount * 30)))} bulan penuh</b>!
                  </span>
                )}
                {analogyMatrixMode === 'boba' && (
                  <span>
                    🧋 <b>Fakta Menohok:</b> Setara sedotan <b>{bobaCupsCount.toLocaleString('id-ID')} gelas</b> Boba Brown Sugar ukuran medium! Gak kebayang berapa antrean boba di mall yang dihabiskan satu angkatan!
                  </span>
                )}
                {analogyMatrixMode === 'gallon' && (
                  <span>
                    📦 <b>Fakta Konstitusi & Hak Air:</b> Air sebanyak <b>{totalAngkatanLiters.toLocaleString('id-ID')} Liter ({gallonAquaCount.toLocaleString('id-ID')} Galon)</b> ini setara jatah air bersih harian bagi <b>{familyDaysSupply} hari</b> untuk satu keluarga di pesisir Pantura Cikarang/Bekasi atau Batam.
                  </span>
                )}
                {analogyMatrixMode === 'phone' && (
                  <span>
                    📱 <b>Beban Listrik Nyata:</b> Energi komputasi GPU data center untuk melayani tugas AI satu angkatanmu setara dengan mengecas baterai smartphone sebanyak <b>{phoneRechargeCount.toLocaleString('id-ID')} kali</b> dari 0% ke 100%!
                  </span>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* =================================================================
            SEGITIGA DAMPAK LINGKUNGAN AI: AIR, LISTRIK/KARBON, & E-WASTE
        ================================================================== */}
        <section id="segitiga" className="py-12 border-b-2 border-[#141517]">
          <div className="mb-6">
            <span className="font-mono text-xs font-bold uppercase tracking-widest text-sky-700">
              03 // Konteks Ekologis
            </span>
            <h2 className="text-2xl md:text-3xl font-black tracking-tight">
              Segitiga Dampak Tersembunyi: Bukan Hanya Air
            </h2>
            <p className="text-xs md:text-sm text-stone-600 mt-1 max-w-2xl">
              Memahami jejak lingkungan komputasi AI secara utuh. Ketiga faktor ini saling terkait dalam trade-off teknologi dan kebijakan energi di Indonesia.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {/* KARTU 1: JEJAK AIR */}
            <div className="bg-white border-2 border-[#141517] p-5 shadow-[4px_4px_0px_#141517] flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 bg-sky-100 border border-sky-400 text-sky-700 flex items-center justify-center mb-3">
                  <Waves className="w-5 h-5" />
                </div>
                <h3 className="font-black text-lg">1. Jejak Air (Evaporasi)</h3>
                <p className="text-xs text-stone-600 mt-2 leading-relaxed">
                  Menara pendingin terbuka (*evaporative cooling towers*) menyemprotkan air bersih ke penukar panas. Air tersebut menguap ke udara dan <b>lenyap dari daerah aliran sungai (DAS) lokal</b>, tidak kembali ke sumur warga sekitar.
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-stone-200 font-mono text-[11px] text-sky-800 font-bold">
                Metrik Kunci: WUE 1.5 – 2.2 L/kWh
              </div>
            </div>

            {/* KARTU 2: LISTRIK & KARBON */}
            <div className="bg-white border-2 border-[#141517] p-5 shadow-[4px_4px_0px_#141517] flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 bg-amber-100 border border-amber-400 text-amber-700 flex items-center justify-center mb-3">
                  <Zap className="w-5 h-5" />
                </div>
                <h3 className="font-black text-lg">2. Energi & Emisi Karbon</h3>
                <p className="text-xs text-stone-600 mt-2 leading-relaxed">
                  Jika data center beralih ke pendingin kering (*dry chiller*) demi menghemat air, konsumsi listrik justru <b>melonjak 10–15%</b> di iklim tropis yang lembap. Di Indonesia, lebih dari 60% pasokan listrik grid Jamali masih berasal dari <b>PLTU Batubara</b>.
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-stone-200 font-mono text-[11px] text-amber-800 font-bold">
                Metrik Kunci: PUE 1.3 – 1.6 & Trade-off Chiller
              </div>
            </div>

            {/* KARTU 3: E-WASTE & SILIKON */}
            <div className="bg-white border-2 border-[#141517] p-5 shadow-[4px_4px_0px_#141517] flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 bg-red-100 border border-red-400 text-red-700 flex items-center justify-center mb-3">
                  <Cpu className="w-5 h-5" />
                </div>
                <h3 className="font-black text-lg">3. Limbah Elektronik (E-Waste)</h3>
                <p className="text-xs text-stone-600 mt-2 leading-relaxed">
                  Persaingan model AI memicu percepatan ganti server (*hardware churn*). Chip GPU canggih seperti H100 dan B200 memiliki masa guna intensif hanya <b>3–5 tahun</b>, meninggalkan tumpukan papan sirkuit berlapis logam tanah jarang dan tembaga beracun.
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-stone-200 font-mono text-[11px] text-red-800 font-bold">
                Masa Pakai: 36–60 Bulan per Akselerator
              </div>
            </div>
          </div>
        </section>

        {/* =================================================================
            BABAK 03: INVESTIGASI SISTEMIK, DAERAH, & REGULASI NEGARA (PKN)
        ================================================================== */}
        <section id="regulasi" className="py-12 border-b-2 border-[#141517]">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6">
            <div>
              <span className="font-mono text-xs font-bold uppercase tracking-widest text-sky-700">
                04 // Investigasi Lapangan & Kebijakan Publik
              </span>
              <h2 className="text-2xl md:text-3xl font-black tracking-tight">
                Pipa Air Data Center: Dua Titik Panas di Indonesia
              </h2>
              <p className="text-xs md:text-sm text-stone-600 mt-1 max-w-2xl">
                Cikarang dan Batam adalah gerbang data center nasional. Di kedua wilayah ini, komputasi global bertemu langsung dengan kerentanan air warga lokal.
              </p>
            </div>

            {/* SWITCHER REGIONAL: CIKARANG VS BATAM */}
            <div className="inline-flex border-2 border-[#141517] bg-white p-1 self-start shrink-0 font-mono text-xs font-bold shadow-[2px_2px_0px_#141517]">
              <button
                onClick={() => setActiveRegion('cikarang')}
                className={`px-3 py-1.5 transition-all ${
                  activeRegion === 'cikarang' ? 'bg-[#141517] text-white' : 'hover:bg-stone-100 text-stone-800'
                }`}
              >
                KORIDOR CIKARANG (BEKASI)
              </button>
              <button
                onClick={() => setActiveRegion('batam')}
                className={`px-3 py-1.5 transition-all ${
                  activeRegion === 'batam' ? 'bg-[#141517] text-white' : 'hover:bg-stone-100 text-stone-800'
                }`}
              >
                NONGSA DIGITAL PARK (BATAM)
              </button>
            </div>
          </div>

          {/* DIAGRAM 4-NODE INTERAKTIF ALUR PIPA */}
          <div className="bg-white border-2 border-[#141517] shadow-[4px_4px_0px_#141517] p-5 mb-6">
            <div className="text-[11px] font-mono font-bold uppercase text-stone-500 mb-3">
              Alur Perjalanan Air & Panas (Klik Node 1–4 untuk melihat fakta lapangan):
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-4">
              {[
                {
                  step: 1,
                  title: 'Prompt Masuk',
                  sub: 'Jutaan Token/Detik',
                  icon: MessageSquare,
                  fact: 'Setiap pertanyaan memicu operasi matriks paralel di ribuan core CUDA/Tensor GPU secara simultan.'
                },
                {
                  step: 2,
                  title: 'Rak GPU Memanas',
                  sub: 'Hingga 80–90°C',
                  icon: Flame,
                  fact: 'Kepadatan daya rak GPU AI mencapai 40–100 kW per rak. Kipas udara biasa (*CRAC unit*) tidak lagi mampu menyerap panas di iklim tropis yang lembap.'
                },
                {
                  step: 3,
                  title: 'Menara Evaporatif',
                  sub: '1,1–2,5 Jt Liter/Hari',
                  icon: Waves,
                  fact: 'Air bersih bertekanan tinggi disemprotkan ke cooling tower. Panas dibuang ke atmosfer melalui penguapan air secara masif.'
                },
                {
                  step: 4,
                  title: activeRegion === 'cikarang' ? 'Tanah Bekasi Amblas' : 'Krisis Waduk Batam',
                  sub: activeRegion === 'cikarang' ? '-5 s/d -10 cm / thn' : '100% Waduk Hujan',
                  icon: AlertTriangle,
                  fact:
                    activeRegion === 'cikarang'
                      ? 'Penyedotan akuifer dalam memicu amblasnya tanah di Bekasi & Pantura, mempercepat banjir rob dan intrusi air asin ke sumur warga.'
                      : 'Pulau Batam tidak memiliki sungai alami. Pendingin data center bersaing langsung dengan jatah air bersih perpipaan warga kota.'
                }
              ].map((node) => {
                const Icon = node.icon;
                const isCurrent = activeInvestigationStep === node.step;
                return (
                  <button
                    key={node.step}
                    onClick={() => setActiveInvestigationStep(node.step)}
                    className={`p-3.5 text-left border-2 transition-all ${
                      isCurrent
                        ? 'border-[#141517] bg-[#141517] text-white shadow-[3px_3px_0px_#0284c7]'
                        : 'border-stone-300 bg-[#F8F7F4] hover:border-[#141517]'
                    }`}
                  >
                    <div className="flex items-center justify-between font-mono text-xs font-bold mb-1">
                      <span>FAKTA 0{node.step}</span>
                      <Icon className="w-4 h-4" />
                    </div>
                    <div className="font-bold text-sm leading-tight">{node.title}</div>
                    <div
                      className={`font-mono text-xs font-extrabold mt-1 ${
                        isCurrent ? 'text-amber-300' : 'text-sky-800'
                      }`}
                    >
                      {node.sub}
                    </div>
                  </button>
                );
              })}
            </div>

            {/* PENJELASAN NODE AKTIF & TOMBOL POPUP HUKUM PKN */}
            <div className="p-4 bg-[#F8F7F4] border-2 border-[#141517] flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="text-xs sm:text-sm font-medium leading-relaxed">
                <span className="font-mono font-bold uppercase mr-2 px-1.5 py-0.5 bg-[#141517] text-white text-[11px]">
                  FOKUS INVESTIGASI
                </span>
                {activeInvestigationStep === 1 &&
                  'Satu prompt kuis atau nugas memicu puluhan GPU beroperasi bersamaan di kluster hyperscale KEK Indonesia.'}
                {activeInvestigationStep === 2 &&
                  'Suhu ruangan chip GPU bisa melebihi 80°C. Pendingin kipas konvensional tidak sanggup mendinginkan densitas panas di atas 35 kW per rak pada kelembapan tinggi Indonesia.'}
                {activeInvestigationStep === 3 &&
                  'Air evaporatif tidak kembali ke selokan atau sungai sekitar, melainkan hilang menjadi uap atmosfer, memotong siklus air tawar regional.'}
                {activeInvestigationStep === 4 &&
                  (activeRegion === 'cikarang'
                    ? 'Pulau Jawa dihuni 56% penduduk Indonesia tapi hanya menyimpan 10% cadangan air nasional. Pengambilan air tanah industri mengorbankan ketahanan air generasi masa depan.'
                    : 'Batam mengandalkan 100% waduk tadah hujan (Dam Duriangkang, Mukakuning). Jutaan liter pendingin server mengurangi cadangan air bersih warga kepulauan.')}
              </div>

              {/* 2 TOMBOL POPUP KONSTITUSI & INTEGRITAS PKN */}
              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={() => setOpenedLegalModal('pasal33')}
                  className="px-3 py-1.5 bg-sky-100 border-2 border-[#141517] font-mono text-xs font-bold flex items-center gap-1.5 hover:bg-sky-200 transition-colors shadow-[2px_2px_0px_#141517]"
                >
                  <Scale className="w-3.5 h-3.5 text-sky-900" /> Pasal 33 UUD 1945
                </button>
                <button
                  onClick={() => setOpenedLegalModal('sipa')}
                  className="px-3 py-1.5 bg-amber-100 border-2 border-[#141517] font-mono text-xs font-bold flex items-center gap-1.5 hover:bg-amber-200 transition-colors shadow-[2px_2px_0px_#141517]"
                >
                  <ShieldAlert className="w-3.5 h-3.5 text-red-700" /> Integritas Izin SIPA
                </button>
              </div>
            </div>
          </div>

          {/* SIMULATOR REGULATOR: 4 PILIHAN KEBIJAKAN NEGARA */}
          <div className="bg-white border-2 border-[#141517] shadow-[4px_4px_0px_#141517] p-5">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 mb-4">
              <div>
                <div className="text-[11px] font-mono font-bold uppercase text-stone-500">
                  Simulasi Pengambil Kebijakan Publik (Menteri ESDM / KLHK)
                </div>
                <h3 className="text-lg font-black">
                  Uji 4 Opsi Kebijakan: Trade-Off Air vs Listrik vs Transparansi
                </h3>
              </div>
              <span className="font-mono text-xs font-extrabold px-2.5 py-1 border-2 border-[#141517] bg-[#F8F7F4]">
                STATUS: {selectedPolicy.verdict}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5 mb-5">
              {POLICIES.map((pol) => {
                const isSelected = selectedPolicy.id === pol.id;
                return (
                  <button
                    key={pol.id}
                    onClick={() => setSelectedPolicy(pol)}
                    className={`p-3 border-2 text-left transition-all ${
                      isSelected
                        ? 'border-[#141517] bg-[#141517] text-white shadow-[2px_2px_0px_#0284c7]'
                        : 'border-stone-300 bg-[#F8F7F4] hover:border-[#141517]'
                    }`}
                  >
                    <div className="text-[10px] font-mono font-bold uppercase opacity-75">{pol.tag}</div>
                    <div className="font-bold text-sm mt-0.5">{pol.shortName}</div>
                  </button>
                );
              })}
            </div>

            {/* 4 GAUGE BAR PERSENTASE & TRADE-OFF */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
              <div className="p-3 bg-[#F8F7F4] border border-[#141517]">
                <div className="flex justify-between text-[11px] font-mono font-bold">
                  <span>SKOR WUE (L/kWh)</span>
                  <span className="font-extrabold">{selectedPolicy.wue}</span>
                </div>
                <div className="w-full h-3 bg-stone-200 border border-[#141517] mt-2">
                  <div
                    className="h-full bg-sky-700 transition-all duration-300"
                    style={{ width: `${Math.min(100, (selectedPolicy.wue / 2.5) * 100)}%` }}
                  />
                </div>
                <div className="text-[10px] font-mono text-stone-500 mt-1">Makin rendah makin irit air</div>
              </div>

              <div className="p-3 bg-[#F8F7F4] border border-[#141517]">
                <div className="flex justify-between text-[11px] font-mono font-bold">
                  <span>AIR TANAH TERLINDUNGI</span>
                  <span className="text-emerald-700 font-extrabold">{selectedPolicy.groundwaterProtected}%</span>
                </div>
                <div className="w-full h-3 bg-stone-200 border border-[#141517] mt-2">
                  <div
                    className="h-full bg-emerald-600 transition-all duration-300"
                    style={{ width: `${selectedPolicy.groundwaterProtected}%` }}
                  />
                </div>
                <div className="text-[10px] font-mono text-stone-500 mt-1">Perlindungan akuifer & sumur warga</div>
              </div>

              <div className="p-3 bg-[#F8F7F4] border border-[#141517]">
                <div className="flex justify-between text-[11px] font-mono font-bold">
                  <span>TRANSPARANSI METERAN</span>
                  <span className="font-extrabold">{selectedPolicy.transparencyScore}%</span>
                </div>
                <div className="w-full h-3 bg-stone-200 border border-[#141517] mt-2">
                  <div
                    className="h-full bg-[#141517] transition-all duration-300"
                    style={{ width: `${selectedPolicy.transparencyScore}%` }}
                  />
                </div>
                <div className="text-[10px] font-mono text-stone-500 mt-1">Audit publik cegah suap SIPA</div>
              </div>

              <div className="p-3 bg-[#F8F7F4] border border-[#141517]">
                <div className="flex justify-between text-[11px] font-mono font-bold">
                  <span>PENALTI LISTRIK</span>
                  <span className="text-amber-700 font-extrabold">+{selectedPolicy.powerPenalty}%</span>
                </div>
                <div className="w-full h-3 bg-stone-200 border border-[#141517] mt-2">
                  <div
                    className="h-full bg-amber-500 transition-all duration-300"
                    style={{ width: `${Math.min(100, (selectedPolicy.powerPenalty / 15) * 100)}%` }}
                  />
                </div>
                <div className="text-[10px] font-mono text-stone-500 mt-1">Beban chiller tertutup di tropis</div>
              </div>
            </div>

            <div className="p-3 bg-stone-100 border-l-4 border-[#141517] font-mono text-xs font-bold leading-relaxed">
              KESIMPULAN ANALISIS: {selectedPolicy.oneLiner}
            </div>
          </div>
        </section>

        {/* =================================================================
            BABAK 04: AKSI PELAJAR (4 JURUS GREEN PROMPTING & STORY CARD)
        ================================================================== */}
        <section id="aksi" className="py-12 border-b-2 border-[#141517]">
          <div className="mb-6">
            <span className="font-mono text-xs font-bold uppercase tracking-widest text-sky-700">
              05 // Aksi Nyata Pelajar
            </span>
            <h2 className="text-2xl md:text-3xl font-black tracking-tight">
              4 Jurus Green Prompting & Bagikan ke Media Sosial
            </h2>
            <p className="text-xs md:text-sm text-stone-600 mt-1 max-w-2xl">
              Kita tidak harus berhenti menggunakan teknologi, melainkan menggunakannya dengan beretika, bijak, dan bertanggung jawab terhadap lingkungan sekitar.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* 4 JURUS GREEN PROMPTING */}
            <div className="lg:col-span-6 space-y-3">
              {[
                {
                  no: '01',
                  title: 'Spesifik & One-Shot Prompt',
                  desc: 'Tuliskan batas kata, format (tabel/poin), dan sudut pandang sejak pertanyaan pertama. Hindari chat berulang kali untuk hal yang bisa dijawab sekali.'
                },
                {
                  no: '02',
                  title: 'Gunakan AI Secara Tepat Guna',
                  desc: 'Jangan pakai server AI berdaya ratusan kilowatt untuk hal sepele seperti kamus kata tunggal atau rumus sederhana yang sudah ada di buku cetak.'
                },
                {
                  no: '03',
                  title: 'Pikir Matang Prompt Gambar Sebelum Generate',
                  desc: 'Pembangkitan 1 gambar AI menyedot daya setara puluhan chat teks. Pikirkan deskripsi gaya & komposisi dengan cermat, hindari me-roll 20 variasi secara sia-sia.'
                },
                {
                  no: '04',
                  title: 'Tutup Thread Obrolan & Kawal Transparansi',
                  desc: 'Buka sesi baru untuk topik baru agar konteks lama tidak membebani komputasi token. Sebagai warga negara muda, dukung keterbukaan data WUE data center.'
                }
              ].map((tip) => (
                <div key={tip.no} className="p-3.5 bg-white border-2 border-[#141517] shadow-[3px_3px_0px_#141517] flex items-start gap-3">
                  <span className="font-mono text-lg font-black text-sky-800 shrink-0">{tip.no}</span>
                  <div>
                    <h4 className="font-black text-sm text-[#141517]">{tip.title}</h4>
                    <p className="text-xs text-stone-600 mt-0.5 leading-relaxed">{tip.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* FORM STORY CARD GENERATOR (CANVAS CLIENT-SIDE) */}
            <div className="lg:col-span-6 bg-white border-2 border-[#141517] shadow-[5px_5px_0px_#141517] p-5 space-y-4">
              <div className="border-b border-stone-200 pb-3">
                <div className="inline-flex items-center gap-1.5 px-2 py-0.5 bg-sky-100 text-sky-900 font-mono text-[10px] font-bold uppercase mb-1">
                  <Sparkles className="w-3 h-3 text-sky-600" />
                  Instagram Story & WA Status Generator
                </div>
                <h3 className="text-lg font-black">Buat Kartu Komitmen Pelajar</h3>
                <p className="text-xs text-stone-600 mt-0.5">
                  Unduh gambar 9:16 berkualitas tinggi siap upload ke IG Story / status WA langsung dari browser tanpa server.
                </p>
              </div>

              {/* INPUT NAMA & SEKOLAH */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-mono font-bold text-stone-700 mb-1">Nama Kamu:</label>
                  <input
                    type="text"
                    placeholder="Contoh: Rian Pratama"
                    value={studentName}
                    onChange={(e) => setStudentName(e.target.value)}
                    className="w-full px-3 py-2 text-xs font-mono border-2 border-[#141517] bg-[#F8F7F4] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-mono font-bold text-stone-700 mb-1">Asal Sekolah:</label>
                  <input
                    type="text"
                    placeholder="Contoh: SMAN 1 Cikarang"
                    value={schoolName}
                    onChange={(e) => setSchoolName(e.target.value)}
                    className="w-full px-3 py-2 text-xs font-mono border-2 border-[#141517] bg-[#F8F7F4] focus:outline-none"
                  />
                </div>
              </div>

              {/* PREVIEW KOTAK KARTU */}
              <div className="p-4 bg-[#0a0e17] text-white border-2 border-[#141517] font-mono text-xs space-y-2 relative overflow-hidden">
                <div className="flex justify-between items-center text-[10px] text-cyan-400 border-b border-slate-700 pb-1.5">
                  <span>PREVIEW KARTU STORY IG (1080x1920)</span>
                  <span>9:16 VERTICAL HD</span>
                </div>
                <div className="font-bold text-sm text-white">
                  {studentName.trim() || 'Nama Pelajar'} — {schoolName.trim() || 'SMA Indonesia'}
                </div>
                <div className="space-y-1.5 py-1">
                  <div className="text-amber-400 font-extrabold text-sm flex items-center gap-1.5">
                    <span>🍜</span>
                    <span>{indomieBowlsCount.toLocaleString('id-ID')} Mangkok Indomie Kuah</span>
                  </div>
                  <div className="text-cyan-300 font-extrabold text-xs flex items-center gap-1.5">
                    <span>📦</span>
                    <span>{gallonAquaCount.toLocaleString('id-ID')} Galon Aqua ({totalAngkatanLiters.toLocaleString('id-ID')} Liter)</span>
                  </div>
                  <div className="text-emerald-400 font-extrabold text-xs flex items-center gap-1.5">
                    <span>📱</span>
                    <span>{phoneRechargeCount.toLocaleString('id-ID')}x Cas Penuh Baterai iPhone</span>
                  </div>
                </div>
                <div className="text-[11px] text-slate-400 leading-snug">
                  Potensi air & daya 1 angkatan ({studentCount} siswa // {durationDays} hari). Berkomitmen menerapkan Green Prompting & kawal Pasal 33 UUD 1945.
                </div>
              </div>

              {/* TOMBOL UNDUH GAMBAR & SALIN TEKS */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                <button
                  onClick={handleDownloadStoryCard}
                  disabled={isGeneratingCard}
                  className="py-2.5 px-3 bg-[#141517] text-white font-mono text-xs font-bold flex items-center justify-center gap-2 hover:bg-stone-800 transition-colors shadow-[3px_3px_0px_#0284c7]"
                >
                  <Download className="w-4 h-4 text-sky-400" />
                  {isGeneratingCard ? 'MEMPROSES GAMBAR...' : 'UNDUH GAMBAR STORY (PNG)'}
                </button>

                <button
                  onClick={handleCopyWhatsApp}
                  className="py-2.5 px-3 bg-emerald-700 text-white font-mono text-xs font-bold flex items-center justify-center gap-2 hover:bg-emerald-800 transition-colors shadow-[3px_3px_0px_#141517]"
                >
                  {isCopiedWA ? <Check className="w-4 h-4 text-emerald-200" /> : <Copy className="w-4 h-4" />}
                  {isCopiedWA ? 'TERSALIN KE CLIPBOARD!' : 'SALIN PESAN WHATSAPP'}
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* =================================================================
            REFERENSI & SUMBER ILMIAH
        ================================================================== */}
        <section id="referensi" className="pt-12">
          <div className="bg-white border-2 border-[#141517] shadow-[4px_4px_0px_#141517] p-6 space-y-4">
            <div className="flex items-center gap-2 font-mono text-xs font-bold uppercase text-stone-500">
              <BookOpen className="w-4 h-4 text-sky-700" />
              Metodologi & Daftar Referensi Ilmiah
            </div>
            <h3 className="text-lg font-black">Dasar Riset & Transparansi Data</h3>
            <p className="text-xs text-stone-600 leading-relaxed">
              Perhitungan pada web ini mengombinasikan data primer konsumsi air langsung (*Scope 1 on-site cooling*) dan konsumsi air tidak langsung pembangkitan listrik (*Scope 2 off-site power generation*) di iklim tropis Indonesia, serta merujuk pada regulasi perundang-undangan Republik Indonesia.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2 font-mono text-xs">
              <div className="p-3 bg-[#F8F7F4] border border-stone-300 space-y-1">
                <div className="font-bold text-[#141517]">1. Shaolei Ren, Pengfei Li, et al. (2023)</div>
                <div className="text-stone-600 text-[11px]">
                  <i>"Making AI Less 'Thirsty': Uncovering and Addressing the Secret Water Footprint of AI Models"</i> (UC Riverside / UT Arlington).
                </div>
              </div>

              <div className="p-3 bg-[#F8F7F4] border border-stone-300 space-y-1">
                <div className="font-bold text-[#141517]">2. Alexandra Sasha Luccioni et al. (2023)</div>
                <div className="text-stone-600 text-[11px]">
                  <i>"Estimating the Carbon and Water Footprint of Generative AI"</i> (Hugging Face & Carnegie Mellon University).
                </div>
              </div>

              <div className="p-3 bg-[#F8F7F4] border border-stone-300 space-y-1">
                <div className="font-bold text-[#141517]">3. European Union Energy Directive (EU) 2023/1791</div>
                <div className="text-stone-600 text-[11px]">
                  Kewajiban pelaporan metrik efisiensi air (WUE) dan energi (PUE) berkala untuk fasilitas data center publik.
                </div>
              </div>

              <div className="p-3 bg-[#F8F7F4] border border-stone-300 space-y-1">
                <div className="font-bold text-[#141517]">4. Konstitusi & Putusan MK No. 85/PUU-XI/2013</div>
                <div className="text-stone-600 text-[11px]">
                  Pasal 33 UUD 1945: Air sebagai *res commune* (hak publik asasi) yang tidak boleh diprivatisasi secara eksploitatif.
                </div>
              </div>
            </div>

            {/* UNDUH POSTER & MAKALAH ASLI */}
            <div className="p-4 bg-sky-50 border-2 border-[#141517] flex flex-col sm:flex-row items-center justify-between gap-3 shadow-[2px_2px_0px_#141517]">
              <div>
                <div className="font-bold text-sm text-[#141517]">Berkas Riset & Publikasi Civics Telkom University</div>
                <div className="text-xs text-stone-600">Pelajari poster akademik dan naskah kajian lengkap kelompok kami</div>
              </div>
              <div className="flex items-center gap-2 shrink-0 font-mono text-xs font-bold">
                <a
                  href="/CIVICS POSTER.png"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-1.5 bg-white border-2 border-[#141517] flex items-center gap-1.5 hover:bg-stone-100 transition-colors shadow-[2px_2px_0px_#141517]"
                >
                  <ImageIcon className="w-3.5 h-3.5 text-sky-700" /> Lihat Poster Ilmiah
                </a>
                <a
                  href="/CIVICS PROJECT.pdf"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-1.5 bg-[#141517] text-white border-2 border-[#141517] flex items-center gap-1.5 hover:bg-stone-800 transition-colors shadow-[2px_2px_0px_#0284c7]"
                >
                  <BookOpen className="w-3.5 h-3.5 text-sky-400" /> Unduh Makalah PDF
                </a>
              </div>
            </div>

            <div className="pt-3 border-t border-stone-200 flex flex-col sm:flex-row items-center justify-between text-[11px] font-mono text-stone-500 gap-2">
              <div>Civics Project Group 2 // Universitas Telkom // Kampanye Literasi AI Hijau Siswa SMA</div>
              <div className="flex gap-4 font-bold text-stone-700">
                <a href="#lab" className="hover:underline">Ke Atas</a>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* =================================================================
          MODAL DRAWER HUKUM & KONSTITUSI PKN
      ================================================================== */}
      {openedLegalModal && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
          <div className="bg-white border-2 border-[#141517] shadow-[8px_8px_0px_#141517] max-w-lg w-full p-5 space-y-3 animate-in fade-in">
            <div className="flex items-center justify-between border-b-2 border-[#141517] pb-2">
              <span className="font-mono text-xs font-bold uppercase text-stone-700">
                {openedLegalModal === 'pasal33'
                  ? 'Konstitusi RI // Hak Atas Air Bersih'
                  : 'SDG 16 // Integritas Publik & Izin SIPA'}
              </span>
              <button
                onClick={() => setOpenedLegalModal(null)}
                className="p-1 hover:bg-stone-200 transition-colors"
              >
                <X className="w-5 h-5 text-black" />
              </button>
            </div>

            {openedLegalModal === 'pasal33' ? (
              <div className="space-y-3 text-xs leading-relaxed text-stone-800">
                <h4 className="font-black text-sm text-[#141517]">
                  Pasal 33 Ayat (3) UUD 1945 & Putusan MK No. 85/PUU-XI/2013
                </h4>
                <p>
                  Konstitusi menegaskan bahwa <i>"Bumi dan air dan kekayaan alam yang terkandung di dalamnya dikuasai oleh negara dan dipergunakan untuk sebesar-besar kemakmuran rakyat."</i>
                </p>
                <p>
                  Melalui <b>Putusan MK No. 85/PUU-XI/2013</b>, Mahkamah Konstitusi menetapkan 6 Prinsip Dasar Pengelolaan Air. Salah satunya adalah <b>prioritas mutlak hak rakyat atas air minum</b> di atas segala kepentingan industri komersial.
                </p>
                <p className="bg-sky-50 border-l-4 border-sky-700 p-2.5 font-medium">
                  Menguapkan jutaan liter air tawar setiap hari demi mendinginkan server komputasi ekspor di wilayah yang mengalami krisis air merupakan bentuk ketidakadilan ekologis yang bertentangan dengan <b>Sila ke-5 Pancasila</b>.
                </p>
              </div>
            ) : (
              <div className="space-y-3 text-xs leading-relaxed text-stone-800">
                <h4 className="font-black text-sm text-[#141517]">
                  Celah Korupsi SIPA & Mandat Transparansi (SDG 16)
                </h4>
                <p>
                  <b>Surat Izin Pengambilan Air Tanah (SIPA)</b> sering kali menjadi arena negosiasi tertutup (*closed-door regulatory capture*). Tarif royalti air tanah industri di beberapa daerah jauh lebih murah daripada biaya investasi sistem sirkulasi tertutup (*closed-loop*).
                </p>
                <p>
                  Tanpa kewajiban membuka meteran air (*smart metering*) dan metrik WUE ke publik, warga sekitar tidak tahu berapa juta liter air tanah dalam yang disedot dari bawah pemukiman mereka.
                </p>
                <p className="bg-amber-50 border-l-4 border-amber-600 p-2.5 font-medium">
                  Pelajar dan masyarakat sipil berhak menuntut transparansi data air data center sebagai wujud tata kelola pemerintahan yang bersih dan berintegritas (*SDG 16: Peace, Justice, and Strong Institutions*).
                </p>
              </div>
            )}

            <button
              onClick={() => setOpenedLegalModal(null)}
              className="mt-3 w-full py-2.5 bg-[#141517] text-white font-mono text-xs font-bold hover:bg-stone-800 transition-colors"
            >
              TUTUP PENJELASAN
            </button>
          </div>
        </div>
      )}
    </div>
  );
}