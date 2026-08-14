const sharp = require('sharp');
const path = require('path');
const fs = require('fs');

const TOTAL_FRAMES = 300;
const TARGET_WIDTH = 1920;
const TARGET_HEIGHT = 1080;
const INPUT_DIR = __dirname;
const OUTPUT_DIR = path.join(__dirname, 'frames_hd');

// Create output dir if it doesn't exist
if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

let processed = 0;
let errors = 0;

async function upscaleFrame(i) {
  const numStr = String(i).padStart(3, '0');
  const inputPath = path.join(INPUT_DIR, `ezgif-frame-${numStr}.jpg`);
  // Overwrite existing frames in the same folder
  const outputPath = path.join(OUTPUT_DIR, `ezgif-frame-${numStr}.jpg`);

  try {
    await sharp(inputPath)
      .resize(TARGET_WIDTH, TARGET_HEIGHT, {
        kernel: sharp.kernel.lanczos3,  // Best quality upscaling
        fit: 'fill',
        position: 'center'
      })
      .jpeg({
        quality: 92,          // High quality JPEG
        mozjpeg: true,        // Better compression
        chromaSubsampling: '4:4:4' // No chroma subsampling for sharpness
      })
      .toFile(outputPath);

    processed++;
    if (processed % 30 === 0 || processed === TOTAL_FRAMES) {
      process.stdout.write(`\rProgress: ${processed}/${TOTAL_FRAMES} frames (${errors} errors)`);
    }
  } catch (err) {
    errors++;
    console.error(`\nError on frame ${numStr}: ${err.message}`);
  }
}

async function main() {
  console.log(`Upscaling ${TOTAL_FRAMES} frames: 1280x720 → ${TARGET_WIDTH}x${TARGET_HEIGHT}`);
  console.log(`Output: ${OUTPUT_DIR}`);
  console.log('Using Lanczos3 resampling for best quality...\n');

  // Process in batches of 10 to avoid memory overload
  const BATCH = 10;
  for (let i = 1; i <= TOTAL_FRAMES; i += BATCH) {
    const batch = [];
    for (let j = i; j < i + BATCH && j <= TOTAL_FRAMES; j++) {
      batch.push(upscaleFrame(j));
    }
    await Promise.all(batch);
  }

  console.log(`\n\nDone! ${processed} frames upscaled successfully.`);
  if (errors > 0) console.log(`${errors} frames had errors.`);
  console.log(`\nHD frames saved to: ${OUTPUT_DIR}`);
  console.log('\nNow copying HD frames back to main folder...');

  // Copy HD frames back to replace the originals
  let copied = 0;
  for (let i = 1; i <= TOTAL_FRAMES; i++) {
    const numStr = String(i).padStart(3, '0');
    const src = path.join(OUTPUT_DIR, `ezgif-frame-${numStr}.jpg`);
    const dest = path.join(INPUT_DIR, `ezgif-frame-${numStr}.jpg`);
    if (fs.existsSync(src)) {
      fs.copyFileSync(src, dest);
      copied++;
    }
  }
  console.log(`Replaced ${copied} original frames with HD versions.`);
  console.log('\nAll done! Your frames are now 1920x1080 HD quality.');
}

main().catch(console.error);
