// src/admin/ImageUploader.jsx
import { useRef, useState, useEffect } from 'react';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { storage } from '../firebase/firebaseConfig';
import { ArrowLeftIcon, ArrowRightIcon, CloseIcon } from '../components/common/Icons';
import imageCompression from 'browser-image-compression'; // NEW

/**
 * Props:
 *   images: string[]         — current image URLs
 *   onChange: (urls) => void — called with updated URL array
 *   folder?: string          — storage folder prefix, default 'products'
 */
export default function ImageUploader({ images = [], onChange, folder = 'products' }) {
  const inputRef = useRef();
  const [dragging, setDragging] = useState(false);
  const [uploads, setUploads] = useState({}); // { tempId: progress }

  const imagesRef = useRef(images);
  useEffect(() => {
    imagesRef.current = images;
  }, [images]);

  async function handleFiles(files) {
    const MAX_SIZE_MB = 5;
    const MAX_SIZE_BYTES = MAX_SIZE_MB * 1024 * 1024;

    for (const file of Array.from(files)) {
      if (!file.type.startsWith('image/')) continue;
      if (file.size > MAX_SIZE_BYTES) {
        alert(`"${file.name}" is too large (${(file.size / 1024 / 1024).toFixed(1)} MB). Max allowed size is ${MAX_SIZE_MB} MB.`);
        continue;
      }

      const tempId = `${Date.now()}_${Math.random()}`;
      setUploads((prev) => ({ ...prev, [tempId]: 0 }));

      // ── NEW: auto-shrink the photo before it uploads ──
      let fileToUpload = file;
      try {
        fileToUpload = await imageCompression(file, {
          maxSizeMB: 0.4,           // target ~400KB
          maxWidthOrHeight: 1600,   // resize if larger than this
          useWebWorker: true,
          fileType: 'image/webp',  // convert to the lighter WebP format
        });
      } catch (err) {
        console.error('Compression failed, uploading original instead', err);
        // if compression fails for any reason, we still upload the original photo
        // so nothing ever gets blocked
      }

      const cleanName = file.name.replace(/\.[^/.]+$/, ''); // strip old extension
      const storageRef = ref(
        storage,
        `${folder}/${Date.now()}_${cleanName.replace(/\s+/g, '_')}.webp`
      );
      const task = uploadBytesResumable(storageRef, fileToUpload);

      task.on(
        'state_changed',
        (snap) => {
          const pct = Math.round((snap.bytesTransferred / snap.totalBytes) * 100);
          setUploads((prev) => ({ ...prev, [tempId]: pct }));
        },
        (err) => {
          console.error('Upload error', err);
          setUploads((prev) => {
            const copy = { ...prev };
            delete copy[tempId];
            return copy;
          });
        },
        async () => {
          const url = await getDownloadURL(task.snapshot.ref);
          const nextImages = [...imagesRef.current, url];
          imagesRef.current = nextImages;
          onChange(nextImages);
          setUploads((prev) => {
            const copy = { ...prev };
            delete copy[tempId];
            return copy;
          });
        }
      );
    }
  }

  function handleDrop(e) {
    e.preventDefault();
    setDragging(false);
    handleFiles(e.dataTransfer.files);
  }

  function removeImage(idx) {
    const next = images.filter((_, i) => i !== idx);
    onChange(next);
  }

  function moveImage(idx, dir) {
    const next = [...images];
    const target = idx + dir;
    if (target < 0 || target >= next.length) return;
    [next[idx], next[target]] = [next[target], next[idx]];
    onChange(next);
  }

  const activeUploads = Object.entries(uploads);

  return (
    <div className="image-uploader">
      {/* Drop Zone */}
      <div
        className={`upload-drop-zone ${dragging ? 'dragging' : ''}`}
        onClick={() => inputRef.current.click()}
        onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
        onDragLeave={() => setDragging(false)}
        onDrop={handleDrop}
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
          <polyline points="17 8 12 3 7 8" />
          <line x1="12" y1="3" x2="12" y2="15" />
        </svg>
        <p><span>Click to upload</span> or drag &amp; drop images</p>
        <p style={{ fontSize: 11, marginTop: 4 }}>First image = main product image · Max 5 MB per file</p>
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        multiple
        style={{ display: 'none' }}
        onChange={(e) => handleFiles(e.target.files)}
      />

      {/* Active Uploads */}
      {activeUploads.map(([id, pct]) => (
        <div className="upload-progress" key={id}>
          <span style={{ fontSize: 12, minWidth: 90 }}>Uploading… {pct}%</span>
          <div className="progress-bar-wrap">
            <div className="progress-bar-fill" style={{ width: `${pct}%` }} />
          </div>
        </div>
      ))}

      {/* Previews */}
      {images.length > 0 && (
        <div className="image-previews">
          {images.map((url, idx) => (
            <div className="image-preview-item" key={url + idx}>
              {idx === 0 && <div className="main-badge">Main</div>}
              <img src={url} alt={`product-${idx + 1}`} />
              <div className="img-actions">
                {idx > 0 && (
                  <button
                    type="button"
                    className="img-action-btn move"
                    title="Move left"
                    onClick={() => moveImage(idx, -1)}
                  >
                    <ArrowLeftIcon size={12} />
                  </button>
                )}
                {idx < images.length - 1 && (
                  <button
                    type="button"
                    className="img-action-btn move"
                    title="Move right"
                    onClick={() => moveImage(idx, 1)}
                  >
                    <ArrowRightIcon size={12} />
                  </button>
                )}
                <button
                  type="button"
                  className="img-action-btn del"
                  title="Remove"
                  onClick={() => removeImage(idx)}
                >
                  <CloseIcon size={12} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}