// ─── Image Analysis Utilities ───────────────────────────────────────────────
// All analysis runs locally in the browser. No server calls.

export interface ImageAnalysis {
  fileName: string;
  fileSize: number;
  fileSizeFormatted: string;
  fileType: string;
  fileExtension: string;
  width: number;
  height: number;
  aspectRatio: string;
  aspectRatioDecimal: number;
  orientation: 'Landscape' | 'Portrait' | 'Square';
  megapixels: number;
  megapixelsFormatted: string;
  qualityRating: QualityRating;
  formatStatus: CheckStatus;
  sizeStatus: CheckStatus;
  dimensionStatus: CheckStatus;
  aspectRatioStatus: CheckStatus;
  overallStatus: 'ready' | 'attention';
  recommendations: string[];
  checks: CheckItem[];
}

export type CheckStatus = 'good' | 'warning' | 'problem';
export type QualityRating = 'excellent' | 'good' | 'warning' | 'too-small';

export interface CheckItem {
  label: string;
  value: string;
  status: CheckStatus;
  statusText: string;
}

// ─── Constants ──────────────────────────────────────────────────────────────

const SUPPORTED_FORMATS = ['image/jpeg', 'image/png', 'image/webp'];
const SUPPORTED_EXTENSIONS = ['jpg', 'jpeg', 'png', 'webp'];

// Dimension thresholds
const MIN_WIDTH = 500;
const MIN_HEIGHT = 500;
const RECOMMENDED_MIN_WIDTH = 1000;
const RECOMMENDED_MIN_HEIGHT = 1000;
const EXCELLENT_MIN_WIDTH = 2000;
const EXCELLENT_MIN_HEIGHT = 2000;

// File size thresholds
const MAX_FILE_SIZE_MB = 50; // max we allow for processing
const WARN_LARGE_FILE_SIZE_MB = 20;
const IDEAL_MAX_FILE_SIZE_MB = 10;

// Common aspect ratios
const COMMON_RATIOS: [number, number, string][] = [
  [1, 1, '1:1'],
  [4, 3, '4:3'],
  [3, 4, '3:4'],
  [5, 4, '5:4'],
  [4, 5, '4:5'],
  [3, 2, '3:2'],
  [2, 3, '2:3'],
  [16, 9, '16:9'],
  [9, 16, '9:16'],
  [5, 7, '5:7'],
  [7, 5, '7:5'],
  [2, 1, '2:1'],
  [1, 2, '1:2'],
];

// ─── Helpers ────────────────────────────────────────────────────────────────

function gcd(a: number, b: number): number {
  a = Math.abs(a);
  b = Math.abs(b);
  while (b) {
    const temp = b;
    b = a % temp;
    a = temp;
  }
  return a;
}

export function calculateAspectRatio(width: number, height: number): string {
  if (width <= 0 || height <= 0) return 'N/A';

  const divisor = gcd(width, height);
  const w = width / divisor;
  const h = height / divisor;

  // Check if it simplifies to a common ratio
  const ratioDecimal = width / height;
  for (const [rw, rh, label] of COMMON_RATIOS) {
    if (Math.abs(ratioDecimal - rw / rh) < 0.02) {
      return label;
    }
  }

  // If simplified ratio is too large, it's unusual
  if (w > 50 || h > 50) {
    return `~${(ratioDecimal).toFixed(2)}:1`;
  }

  return `${w}:${h}`;
}

export function isCommonAspectRatio(ratio: string): boolean {
  return COMMON_RATIOS.some(([, , label]) => label === ratio);
}

export function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

export function getOrientation(width: number, height: number): 'Landscape' | 'Portrait' | 'Square' {
  if (width > height) return 'Landscape';
  if (height > width) return 'Portrait';
  return 'Square';
}

export function getMegapixels(width: number, height: number): number {
  return (width * height) / 1_000_000;
}

// ─── Validation ─────────────────────────────────────────────────────────────

export function isSupportedFormat(file: File): boolean {
  const extension = file.name.split('.').pop()?.toLowerCase() ?? '';
  return SUPPORTED_FORMATS.includes(file.type) || SUPPORTED_EXTENSIONS.includes(extension);
}

export function isFileTooLarge(file: File): boolean {
  return file.size > MAX_FILE_SIZE_MB * 1024 * 1024;
}

// ─── Analysis ───────────────────────────────────────────────────────────────

export function analyzeImage(
  file: File,
  width: number,
  height: number
): ImageAnalysis {
  const fileName = file.name;
  const fileSize = file.size;
  const fileSizeFormatted = formatFileSize(fileSize);
  const fileExtension = fileName.split('.').pop()?.toUpperCase() ?? 'Unknown';
  const fileType = mapMimeToLabel(file.type, fileExtension);

  const aspectRatio = calculateAspectRatio(width, height);
  const aspectRatioDecimal = width / height;
  const orientation = getOrientation(width, height);
  const megapixels = getMegapixels(width, height);
  const megapixelsFormatted = `${megapixels.toFixed(1)} MP`;

  // ── Status checks ──

  // Dimensions
  let dimensionStatus: CheckStatus = 'good';
  let dimensionText = 'Suitable dimensions';
  if (width < MIN_WIDTH || height < MIN_HEIGHT) {
    dimensionStatus = 'problem';
    dimensionText = 'Too small for quality listing';
  } else if (width < RECOMMENDED_MIN_WIDTH || height < RECOMMENDED_MIN_HEIGHT) {
    dimensionStatus = 'warning';
    dimensionText = 'Dimensions are relatively low';
  }

  // Format
  const formatStatus: CheckStatus = SUPPORTED_FORMATS.includes(file.type) ? 'good' : 'warning';
  const formatText = formatStatus === 'good' ? 'Supported format' : 'May not be supported';

  // File size
  let sizeStatus: CheckStatus = 'good';
  let sizeText = 'Acceptable file size';
  const fileSizeMB = fileSize / (1024 * 1024);
  if (fileSizeMB > WARN_LARGE_FILE_SIZE_MB) {
    sizeStatus = 'warning';
    sizeText = 'File is quite large';
  } else if (fileSizeMB > IDEAL_MAX_FILE_SIZE_MB) {
    sizeStatus = 'warning';
    sizeText = 'Consider compressing';
  }

  // Aspect ratio
  let aspectRatioStatus: CheckStatus = 'good';
  let aspectRatioText = 'Common aspect ratio';
  if (!isCommonAspectRatio(aspectRatio)) {
    aspectRatioStatus = 'warning';
    aspectRatioText = 'Unusual aspect ratio';
  }

  // Quality rating
  let qualityRating: QualityRating = 'excellent';
  if (width < MIN_WIDTH || height < MIN_HEIGHT) {
    qualityRating = 'too-small';
  } else if (width < RECOMMENDED_MIN_WIDTH || height < RECOMMENDED_MIN_HEIGHT) {
    qualityRating = 'warning';
  } else if (width < EXCELLENT_MIN_WIDTH || height < EXCELLENT_MIN_HEIGHT) {
    qualityRating = 'good';
  }

  // Overall
  const allStatuses: CheckStatus[] = [dimensionStatus, formatStatus, sizeStatus, aspectRatioStatus];
  const hasProblems = allStatuses.includes('problem');
  const overallStatus: 'ready' | 'attention' = hasProblems ? 'attention' : 'ready';

  // Checks list
  const checks: CheckItem[] = [
    { label: 'Dimensions', value: `${width.toLocaleString()} × ${height.toLocaleString()} px`, status: dimensionStatus, statusText: dimensionText },
    { label: 'File Format', value: fileType, status: formatStatus, statusText: formatText },
    { label: 'File Size', value: fileSizeFormatted, status: sizeStatus, statusText: sizeText },
    { label: 'Aspect Ratio', value: aspectRatio, status: aspectRatioStatus, statusText: aspectRatioText },
    { label: 'Image Size', value: megapixelsFormatted, status: getQualityCheckStatus(qualityRating), statusText: getQualityLabel(qualityRating) },
  ];

  // Recommendations
  const recommendations = generateRecommendations({
    width, height, fileSizeMB, orientation, aspectRatio, aspectRatioStatus, dimensionStatus, qualityRating,
  });

  return {
    fileName,
    fileSize,
    fileSizeFormatted,
    fileType,
    fileExtension,
    width,
    height,
    aspectRatio,
    aspectRatioDecimal,
    orientation,
    megapixels,
    megapixelsFormatted,
    qualityRating,
    formatStatus,
    sizeStatus,
    dimensionStatus,
    aspectRatioStatus,
    overallStatus,
    recommendations,
    checks,
  };
}

// ─── Sub-helpers ────────────────────────────────────────────────────────────

function mapMimeToLabel(mime: string, ext: string): string {
  switch (mime) {
    case 'image/jpeg': return 'JPEG';
    case 'image/png': return 'PNG';
    case 'image/webp': return 'WebP';
    default: return ext || 'Unknown';
  }
}

function getQualityCheckStatus(rating: QualityRating): CheckStatus {
  switch (rating) {
    case 'excellent': return 'good';
    case 'good': return 'good';
    case 'warning': return 'warning';
    case 'too-small': return 'problem';
  }
}

function getQualityLabel(rating: QualityRating): string {
  switch (rating) {
    case 'excellent': return 'Excellent image size';
    case 'good': return 'Good image size';
    case 'warning': return 'Relatively low dimensions';
    case 'too-small': return 'Too small — consider replacing';
  }
}

interface RecommendationInput {
  width: number;
  height: number;
  fileSizeMB: number;
  orientation: string;
  aspectRatio: string;
  aspectRatioStatus: CheckStatus;
  dimensionStatus: CheckStatus;
  qualityRating: QualityRating;
}

function generateRecommendations(input: RecommendationInput): string[] {
  const recs: string[] = [];

  if (input.dimensionStatus === 'problem') {
    recs.push('Your image has very low pixel dimensions. Consider using a higher-resolution version for better listing quality.');
  } else if (input.qualityRating === 'warning') {
    recs.push('Your image has relatively low pixel dimensions. Consider using a higher-resolution version.');
  }

  if (input.fileSizeMB > WARN_LARGE_FILE_SIZE_MB) {
    recs.push('This file is significantly larger than necessary. Consider compressing it to reduce file size without losing noticeable quality.');
  } else if (input.fileSizeMB > IDEAL_MAX_FILE_SIZE_MB) {
    recs.push('This file is larger than necessary. Consider compressing it to reduce file size.');
  }

  if (input.orientation === 'Portrait') {
    recs.push('Portrait images may display differently across various Etsy surfaces. Check the preview to ensure important content remains visible.');
  }

  if (input.aspectRatioStatus === 'warning') {
    recs.push('This image has an unusual aspect ratio. Consider checking your design composition to make sure important text or product details remain visible.');
  }

  if (recs.length === 0) {
    recs.push('Your image looks technically suitable. No major issues were detected.');
  }

  return recs;
}
