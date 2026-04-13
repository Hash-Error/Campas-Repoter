import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router";
import { buildings, categoryLabels, priorityLabels, type IssueCategory, type IssuePriority } from "../data/mockData";
import { createIssue } from "../api";
import { 
  AlertCircle, CheckCircle, Loader2, Camera, X, Image as ImageIcon, 
  RotateCcw, Zap, AlertTriangle, Search, Trash2, Plus, Zap as ZapIcon,
  CloudUpload, RefreshCcw, Send
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface AttachedPhoto {
  url: string;
  name: string;
  originalSize: number;
  compressedSize: number;
  source: 'camera' | 'upload';
  isHighlyCompressed: boolean;
}

export function ReportIssue() {
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [images, setImages] = useState<AttachedPhoto[]>([]);
  const [isDragOver, setIsDragOver] = useState(false);
  
  // Camera State
  const [showCamera, setShowCamera] = useState(false);
  const [cameraStream, setCameraStream] = useState<MediaStream | null>(null);
  const [facingMode, setFacingMode] = useState<'user' | 'environment'>('environment');
  const [cameraPermission, setCameraPermission] = useState<'pending' | 'granted' | 'denied'>('pending');
  const [flashEnabled, setFlashEnabled] = useState(true);
  const [showFlash, setShowFlash] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const [lightboxImage, setLightboxImage] = useState<string | null>(null);

  // Upload State
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadStep, setUploadStep] = useState(0);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [showRetryCard, setShowRetryCard] = useState(false);

  const [formFieldErrors, setFormFieldErrors] = useState<string | null>(null);
  const [fileValidationErrors, setFileValidationErrors] = useState<string[]>([]);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'other' as IssueCategory,
    building: '',
    room: '',
    priority: 'Medium' as IssuePriority,
    reportedBy: 'Student User',
  });

  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => setToast(null), 2000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  useEffect(() => {
    if (showCamera) startCamera();
    else stopCamera();
    return () => stopCamera();
  }, [showCamera, facingMode]);

  const startCamera = async () => {
    try {
      stopCamera();
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode } });
      setCameraStream(stream);
      if (videoRef.current) videoRef.current.srcObject = stream;
      setCameraPermission('granted');
    } catch {
      setCameraPermission('denied');
    }
  };

  const stopCamera = () => {
    if (cameraStream) {
      cameraStream.getTracks().forEach(t => t.stop());
      setCameraStream(null);
    }
  };

  const compressImage = (source: string | HTMLVideoElement, originalSize: number): Promise<Omit<AttachedPhoto, 'name' | 'source'>> => {
    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;
        const maxDim = 1200;
        if (width > maxDim) {
          height = (maxDim / width) * height;
          width = maxDim;
        }
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx?.drawImage(img, 0, 0, width, height);
        const compressedUrl = canvas.toDataURL('image/jpeg', 0.82);
        const compressedSize = Math.round(compressedUrl.length * 0.75);
        const reduction = (originalSize - compressedSize) / originalSize;
        resolve({
          url: compressedUrl,
          originalSize,
          compressedSize,
          isHighlyCompressed: reduction > 0.3
        });
      };
      if (typeof source === 'string') img.src = source;
      else {
        const canvas = document.createElement('canvas');
        canvas.width = source.videoWidth;
        canvas.height = source.videoHeight;
        canvas.getContext('2d')?.drawImage(source, 0, 0);
        img.src = canvas.toDataURL('image/jpeg', 1.0);
      }
    });
  };

  const capturePhoto = async () => {
    if (videoRef.current) {
      if (flashEnabled) {
        setShowFlash(true);
        setTimeout(() => setShowFlash(false), 200);
      }
      const tempCanvas = document.createElement('canvas');
      tempCanvas.width = videoRef.current.videoWidth;
      tempCanvas.height = videoRef.current.videoHeight;
      tempCanvas.getContext('2d')?.drawImage(videoRef.current, 0, 0);
      const rawUrl = tempCanvas.toDataURL('image/jpeg', 1.0);
      const rawSize = Math.round(rawUrl.length * 0.75);
      const result = await compressImage(videoRef.current, rawSize);
      const newPhoto: AttachedPhoto = {
        ...result,
        name: `capture_${Date.now()}.jpg`,
        source: 'camera'
      };
      setImages(prev => [...prev, newPhoto].slice(0, 4));
      setToast("Photo captured and optimized");
      setTimeout(() => setShowCamera(false), 300);
    }
  };

  const handleFiles = (files: FileList | null) => {
    if (files) {
      setFileValidationErrors([]);
      setUploadError(null);
      const fileList = Array.from(files);
      const allowed = ['image/jpeg', 'image/png', 'image/webp'];
      if (images.length + fileList.length > 4) {
          setUploadError("Maximum 4 photos allowed. Only the first 4 will be used.");
      }
      const toProcess = fileList.slice(0, 4 - images.length);
      const errors: string[] = [];
      toProcess.forEach(file => {
        if (!allowed.includes(file.type)) {
          errors.push(`${file.name} — Unsupported format`);
          return;
        }
        if (file.size > 5 * 1024 * 1024) {
          errors.push(`${file.name} — File too large (max 5MB)`);
          return;
        }
        const reader = new FileReader();
        reader.onloadend = async () => {
          const result = await compressImage(reader.result as string, file.size);
          setImages(prev => [...prev, {
            ...result,
            name: file.name,
            source: 'upload'
          }]);
        };
        reader.readAsDataURL(file);
      });
      setFileValidationErrors(errors);
    }
  };

  const handleUploadZoneKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      fileInputRef.current?.click();
    }
  };

  const uploadPhotosToFirebase = async (skipUpload = false): Promise<string[]> => {
    if (images.length === 0 || skipUpload) return [];
    setUploading(true);
    setUploadProgress(0);
    setUploadStep(0);
    setShowRetryCard(false);
    const urls: string[] = [];
    try {
      for (let i = 0; i < images.length; i++) {
        setUploadStep(i + 1);
        for (let p = 0; p <= 100; p += 25) {
          setUploadProgress(p);
          await new Promise(r => setTimeout(r, 100));
        }
        urls.push(images[i].url);
      }
      return urls;
    } catch (err) {
      setShowRetryCard(true);
      throw err;
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e?: React.FormEvent, skipPhotos = false) => {
    if (e) e.preventDefault();
    setLoading(true);
    setFormFieldErrors(null);
    try {
      let photoURLs: string[] = [];
      if (!skipPhotos && images.length > 0) {
        photoURLs = await uploadPhotosToFirebase();
      }
      await createIssue({
        ...formData,
        location: `${formData.building}${formData.room ? ', ' + formData.room : ''}`,
        images: photoURLs.length > 0 ? photoURLs : images.map(i => i.url)
      } as any);
      setSubmitted(true);
      setTimeout(() => navigate('/app'), 2000);
    } catch (err) {
      if (!showRetryCard) setFormFieldErrors("Failed to submit issue. Please check your connection.");
    } finally {
      if (!showRetryCard) setLoading(false);
    }
  };

  const formatSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  const interactiveClasses = "transition-all duration-200 ease-in-out";

  if (submitted) {
    return (
      <div className="p-8 min-h-full bg-[#f0f7ec]">
        <div className="max-w-2xl mx-auto py-16 text-center bg-white border border-[#e0eed8] rounded-[12px] p-12 shadow-sm">
            <CheckCircle className="w-16 h-16 text-[#2D5016] mx-auto mb-4" />
            <h2 className="text-2xl font-black mb-2 text-[#1a1a1a] uppercase tracking-tight">Issue Reported!</h2>
            <p className="text-[#6b7280] font-medium">Your report has been saved to the database.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 bg-[#f0f7ec] min-h-full relative overflow-hidden">
      {/* Lightbox Modal */}
      <AnimatePresence>
        {lightboxImage && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-[#1a1a1a]/95 flex items-center justify-center p-8 cursor-pointer"
            onClick={() => setLightboxImage(null)}
            role="dialog"
            aria-modal="true"
            aria-label="Full size photo preview"
          >
            <button className={`absolute top-8 right-8 text-white font-bold flex items-center gap-2 bg-white/10 px-4 py-2 rounded-xl ${interactiveClasses} hover:bg-white/20`} aria-label="Close preview">
                <X className="w-5 h-5" /> Close
            </button>
            <motion.img 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              src={lightboxImage} className="max-w-full max-h-full rounded-2xl shadow-sm object-contain border border-[#e0eed8]/20" 
              onClick={(e) => e.stopPropagation()}
            />
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {toast && (
          <motion.div initial={{ y: 50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 50, opacity: 0 }}
            className="fixed bottom-8 left-1/2 -translate-x-1/2 bg-[#2D5016] text-white px-6 py-3 rounded-full shadow-sm z-[60] flex items-center gap-2 text-sm font-bold border border-white/10"
            role="status"
          >
            <CheckCircle className="w-4 h-4" /> {toast}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Camera Modal */}
      <AnimatePresence>
        {showCamera && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="absolute inset-0 z-50 bg-[#1a1a1a]/70 flex items-center justify-center p-4 min-h-[600px]"
          >
            <motion.div 
                initial={{ scale: 0.95 }} animate={{ scale: 1 }} 
                className="bg-white rounded-[12px] w-full max-w-[480px] overflow-hidden border border-[#e0eed8]"
                role="dialog"
                aria-modal="true"
                aria-label="Camera capture modal"
            >
              <div className="flex justify-between items-center px-6 py-5 border-b border-[#e0eed8]">
                <h3 className="text-base font-bold text-[#1a1a1a]">Live Camera Capture</h3>
                <button onClick={() => setShowCamera(false)} className={`text-[13px] font-bold text-[#6b7280] hover:text-[#2D5016] ${interactiveClasses} uppercase tracking-widest`} aria-label="Close camera">✕ Close</button>
              </div>
              <div className="relative aspect-[3/4] bg-black">
                {cameraPermission === 'denied' ? (
                  <div className="absolute inset-0 flex items-center justify-center p-8 bg-[#f0f7ec] text-[#2D5016] text-sm font-bold text-center" role="alert">
                    <div className="bg-white p-8 rounded-[12px] border border-[#e0eed8]">
                        <AlertTriangle className="w-12 h-12 text-amber-500 mx-auto mb-4" />
                        <p className="mb-2 uppercase tracking-wide">Access Denied</p>
                        <p className="text-[12px] font-medium text-[#6b7280]">Please enable camera in browser settings or upload existing files.</p>
                    </div>
                  </div>
                ) : (
                  <>
                    <video ref={videoRef} autoPlay playsInline className="w-full h-full object-cover" aria-label="Live camera feed" />
                    <div className="absolute top-4 left-4 bg-[#1a1a1a]/60 px-3 py-1.5 rounded-full border border-white/10 flex items-center gap-2">
                        <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" aria-hidden="true" />
                        <span className="text-[10px] font-black text-white tracking-widest uppercase">Live System</span>
                    </div>
                    {showFlash && <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-white z-10" />}
                  </>
                )}
              </div>
              <div className="p-8 text-center bg-white border-t border-[#e0eed8]">
                <div className="flex items-center justify-between mb-8 max-w-[320px] mx-auto">
                    <button onClick={() => setFacingMode(f => f === 'user' ? 'environment' : 'user')} className={`p-4 border-2 border-[#e0eed8] rounded-full text-[#6b7280] hover:bg-[#f0f7ec] hover:text-[#2D5016] ${interactiveClasses}`} aria-label="Flip camera"><RotateCcw className="w-6 h-6"/></button>
                    <button onClick={capturePhoto} className={`relative w-20 h-20 rounded-full flex items-center justify-center active:scale-95 ${interactiveClasses}`} aria-label="Take photo">
                        <div className="absolute inset-0 border-[4px] border-[#2D5016] rounded-full" />
                        <div className="w-[56px] h-[56px] bg-[#2D5016] rounded-full shadow-sm" />
                    </button>
                    <button onClick={() => setFlashEnabled(!flashEnabled)} className={`p-4 border-2 rounded-full ${interactiveClasses} ${flashEnabled ? 'text-[#2D5016] bg-[#f0f7ec] border-[#2D5016]' : 'text-[#6b7280] border-[#e0eed8]'}`} aria-label={flashEnabled ? "Disable flash" : "Enable flash"}><Zap className="w-6 h-6"/></button>
                </div>
                <p className="text-[11px] text-[#6b7280] font-black tracking-[0.2em] uppercase">Align problem area in frame</p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="max-w-2xl mx-auto">
        <div className="mb-8 p-1">
          <h1 className="text-2xl font-black text-[#2D5016] mb-1 tracking-tight uppercase">Issue Reporter</h1>
          <p className="text-sm text-[#6b7280] font-bold">Smart Campus Maintenance Terminal</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-white border border-[#e0eed8] rounded-[12px] p-8 shadow-sm space-y-6">
          <input type="file" ref={fileInputRef} multiple accept="image/*" onChange={(e) => handleFiles(e.target.files)} className="hidden" />
          
          <div>
            <label htmlFor="title" className="block text-xs font-black text-[#6b7280] mb-2 uppercase tracking-widest">Issue Subject <span className="text-red-500">*</span></label>
            <input id="title" type="text" required value={formData.title} onChange={e => setFormData({ ...formData, title: e.target.value })} 
              className={`w-full h-11 px-4 bg-white border border-[#d1d5db] rounded-[8px] text-[14px] font-medium focus:border-[#2D5016] outline-none ${interactiveClasses}`} placeholder="Brief summary of the issue" />
          </div>

          <div className="grid grid-cols-2 gap-6">
              <div>
                <label htmlFor="category" className="block text-xs font-black text-[#6b7280] mb-2 uppercase tracking-widest">Category <span className="text-red-500">*</span></label>
                <select id="category" required value={formData.category} onChange={e => setFormData({ ...formData, category: e.target.value as any })}
                  className={`w-full h-11 px-4 bg-white border border-[#d1d5db] rounded-[8px] text-[14px] font-medium outline-none cursor-pointer focus:border-[#2D5016] ${interactiveClasses}`}>
                  {Object.entries(categoryLabels).map(([v, l]) => <option key={v} value={v}>{l}</option>)}
                </select>
              </div>
              <div>
                <label htmlFor="priority" className="block text-xs font-black text-[#6b7280] mb-2 uppercase tracking-widest">Impact level <span className="text-red-500">*</span></label>
                <select id="priority" required value={formData.priority} onChange={e => setFormData({ ...formData, priority: e.target.value as any })} className={`w-full h-11 px-4 bg-white border border-[#d1d5db] rounded-[8px] text-[14px] font-medium outline-none cursor-pointer focus:border-[#2D5016] ${interactiveClasses}`}>
                    {Object.entries(priorityLabels).map(([v, l]) => <option key={v} value={v}>{l}</option>)}
                </select>
              </div>
          </div>

          <div>
            <label htmlFor="description" className="block text-xs font-black text-[#6b7280] mb-2 uppercase tracking-widest">Description <span className="text-red-500">*</span></label>
            <textarea id="description" required rows={4} value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })}
              className={`w-full p-4 bg-white border border-[#d1d5db] rounded-[8px] text-[14px] font-medium outline-none focus:border-[#2D5016] ${interactiveClasses}`} placeholder="Provide specific details about the problem..." />
          </div>

          {/* Photos Logic Section */}
          <div className="pt-2 border-t border-[#e0eed8]">
            <div className="flex justify-between items-center mb-3">
                <div className="flex items-center gap-2">
                    <CloudUpload className="w-4 h-4 text-[#2D5016]" />
                    <span className="text-[12px] font-black text-[#1a1a1a] uppercase tracking-widest">Photos & Evidence</span>
                    <span className="text-[9px] bg-[#f0f7ec] text-[#2D5016] px-2 py-0.5 rounded-full font-black border border-[#2D5016]/10">Optional</span>
                </div>
                <div className="text-[11px] font-black text-[#6b7280] uppercase tracking-widest">{images.length} / 4 PHOTOS</div>
            </div>

            {images.length === 0 ? (
              <motion.div 
                onDragOver={(e) => { e.preventDefault(); setIsDragOver(true); }}
                onDragLeave={() => setIsDragOver(false)}
                onDrop={(e) => { e.preventDefault(); setIsDragOver(false); handleFiles(e.dataTransfer.files); }}
                className={`border-2 border-dashed rounded-[12px] p-10 text-center cursor-pointer ${interactiveClasses} ${isDragOver ? 'bg-[#f0f7ec] border-[#2D5016] scale-[1.01]' : 'bg-white border-[#c4d9b8] hover:bg-[#f0f7ec] hover:border-[#4a7c2f]'}`}
                onClick={() => fileInputRef.current?.click()}
                onKeyDown={handleUploadZoneKeyPress}
                role="button"
                tabIndex={0}
                aria-label="Upload zone. Drag photos here or click to choose files."
              >
                <div className="w-12 h-12 bg-[#f0f7ec] text-[#4a7c2f] rounded-full flex items-center justify-center mx-auto mb-4 border border-[#e0eed8]" aria-hidden="true"><ImageIcon className="w-6 h-6"/></div>
                <h4 className="text-[14px] font-bold text-[#1a1a1a] mb-1">Drop photos here or choose an option</h4>
                <p className="text-[11px] text-[#6b7280] mb-8 font-medium">Supports JPG, PNG, WEBP · Max 5MB per photo</p>
                <div className="flex gap-4 justify-center" onClick={e => e.stopPropagation()}>
                    <button type="button" onClick={() => setShowCamera(true)} className={`px-6 py-2.5 bg-white border border-[#2D5016] text-[#2D5016] rounded-[8px] text-[13px] font-bold hover:bg-[#f0f7ec] ${interactiveClasses} uppercase`}>📷 Take Photo</button>
                    <button type="button" onClick={() => fileInputRef.current?.click()} className={`px-6 py-2.5 bg-[#2D5016] text-white rounded-[8px] text-[13px] font-bold hover:bg-[#1D3A10] ${interactiveClasses} uppercase`}>🖼️ From Device</button>
                </div>
              </motion.div>
            ) : (
                <div className="space-y-4">
                    <div className="grid grid-cols-[repeat(auto-fill,minmax(120px,1fr))] gap-2.5">
                        {images.map((img, i) => (
                            <motion.div layout key={i} className="group relative aspect-square bg-white border border-[#e0eed8] rounded-[10px] overflow-hidden shadow-sm">
                                <img src={img.url} className={`w-full h-full object-cover ${interactiveClasses} group-hover:scale-105`} alt={`Attached photo ${i + 1}`} />
                                <div className={`absolute inset-0 bg-[#1a1a1a]/40 opacity-0 group-hover:opacity-100 ${interactiveClasses} flex items-center justify-center gap-3`}>
                                    <button type="button" onClick={() => setLightboxImage(img.url)} className={`p-2.5 bg-white/20 hover:bg-white text-white hover:text-[#2D5016] rounded-lg ${interactiveClasses}`} aria-label="View photo"><Search className="w-4 h-4"/></button>
                                    <button type="button" onClick={() => setImages(prev => prev.filter((_, idx) => idx !== i))} className={`p-2.5 bg-white/20 hover:bg-red-500 text-white rounded-lg ${interactiveClasses}`} aria-label="Remove photo"><Trash2 className="w-4 h-4"/></button>
                                </div>
                                <div className="absolute bottom-0 left-0 right-0 bg-[#1a1a1a]/50 px-3 py-1.5 backdrop-blur-sm">
                                    <div className="flex justify-between items-center text-[10px] font-bold text-white">
                                        <span className="truncate max-w-[70%]">{img.name}</span>
                                        <span className="opacity-60">{formatSize(img.compressedSize)}</span>
                                    </div>
                                </div>
                                {img.isHighlyCompressed && (
                                    <div className="absolute top-2 left-2 bg-[#4a7c2f] text-white text-[8px] font-black px-1.5 py-0.5 rounded-md uppercase flex items-center gap-1 shadow-sm border border-white/10">
                                        <ZapIcon className="w-2 h-2 fill-white"/> Optimized
                                    </div>
                                )}
                            </motion.div>
                        ))}
                    </div>

                    {images.length < 4 && (
                        <button 
                            type="button" onClick={() => fileInputRef.current?.click()}
                            className={`w-full h-12 border-2 border-dashed border-[#c4d9b8] rounded-[10px] flex items-center justify-center gap-2 text-[#4a7c2f] hover:bg-[#f0f7ec] hover:border-[#2D5016] ${interactiveClasses} text-[11px] font-black uppercase tracking-widest bg-white`}
                        >
                            <Plus className="w-4 h-4"/> Add More Photos
                        </button>
                    )}
                </div>
            )}

            {/* Uploading Progress Block */}
            <AnimatePresence>
                {uploading && (
                    <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="mt-4 p-5 bg-[#f0f7ec] border border-[#e0eed8] rounded-[12px]" role="status">
                        <div className="flex justify-between items-center mb-2">
                            <span className="text-[13px] font-bold text-[#2D5016]">Uploading photos… {uploadStep} of {images.length}</span>
                            <span className="text-[13px] font-black text-[#2D5016]">{uploadProgress}%</span>
                        </div>
                        <div className="w-full h-1.5 bg-white rounded-full overflow-hidden border border-[#e0eed8]">
                            <motion.div 
                                initial={{ width: 0 }} animate={{ width: `${uploadProgress}%` }}
                                className="h-full bg-[#2D5016] rounded-full" 
                            />
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Retry Error Card */}
            <AnimatePresence>
                {showRetryCard && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-4 bg-red-50 border border-red-200 rounded-[12px] p-5" role="alert">
                        <div className="flex gap-4">
                            <AlertCircle className="w-6 h-6 text-red-500 flex-shrink-0" />
                            <div className="flex-1">
                                <h4 className="text-[13px] font-bold text-red-900 uppercase tracking-tight mb-1">Photo Upload Failed</h4>
                                <p className="text-[11px] text-red-700 font-medium mb-4">You can still submit without photos or try again.</p>
                                <div className="flex gap-3">
                                    <button type="button" onClick={() => handleSubmit(undefined, false)} className={`px-4 py-2 bg-red-500 text-white rounded-[8px] text-[11px] font-bold hover:bg-red-600 ${interactiveClasses} flex items-center gap-2`}>
                                        <RefreshCcw className="w-3.5 h-3.5"/> RETRY
                                    </button>
                                    <button type="button" onClick={() => handleSubmit(undefined, true)} className={`px-4 py-2 bg-white border border-red-200 text-red-700 rounded-[8px] text-[11px] font-bold hover:bg-red-50 ${interactiveClasses}`}>
                                        SUBMIT WITHOUT PHOTOS
                                    </button>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {uploadError && <div className="bg-red-50 text-red-500 text-[11px] font-bold mt-4 p-3 rounded-[8px] border border-red-100 flex items-center gap-2" role="alert"><AlertCircle className="w-4 h-4"/>{uploadError}</div>}
            <div className="flex flex-wrap gap-2 mt-2">
                {fileValidationErrors.map((e, i) => <span key={i} className="text-[10px] bg-red-50 text-red-600 px-3 py-1 rounded-full font-bold border border-red-100" role="alert">{e}</span>)}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6 pt-2">
            <div>
                <label htmlFor="building" className="block text-xs font-black text-[#6b7280] mb-2 uppercase tracking-widest">Building <span className="text-red-500">*</span></label>
                <select id="building" required value={formData.building} onChange={e => setFormData({...formData, building: e.target.value})} className={`w-full h-11 px-4 bg-white border border-[#d1d5db] rounded-[8px] text-[14px] font-medium outline-none cursor-pointer focus:border-[#2D5016] ${interactiveClasses}`}>
                    <option value="">Select location</option>
                    {buildings.map(b => <option key={b} value={b}>{b}</option>)}
                </select>
            </div>
            <div>
                <label htmlFor="room" className="block text-xs font-black text-[#6b7280] mb-2 uppercase tracking-widest">Room / Floor</label>
                <input id="room" type="text" value={formData.room} onChange={e => setFormData({...formData, room: e.target.value})} className={`w-full h-11 px-4 bg-white border border-[#d1d5db] rounded-[8px] text-[14px] font-medium focus:border-[#2D5016] ${interactiveClasses}`} placeholder="e.g. 3rd Floor, Lab 4" />
            </div>
          </div>

          <div className="flex gap-4 pt-6">
            <button 
              type="submit" disabled={loading || uploading} 
              className={`flex-1 h-12 bg-[#2D5016] text-white rounded-[8px] font-bold text-[14px] hover:bg-[#1D3A10] ${interactiveClasses} flex items-center justify-center gap-3 disabled:opacity-50`}
            >
                {loading || uploading ? <Loader2 className="animate-spin w-5 h-5"/> : (
                    <>
                        <span>Submit Report</span>
                        <Send className="w-4 h-4 opacity-50"/>
                    </>
                )}
            </button>
            <button type="button" onClick={() => navigate('/app')} className={`px-8 h-12 border border-[#d1d5db] rounded-[8px] font-bold text-[14px] text-[#6b7280] hover:bg-neutral-50 ${interactiveClasses}`}>Discard</button>
          </div>
          
          {formFieldErrors && (
            <div className="bg-red-50 p-4 rounded-[8px] border border-red-100 text-[12px] text-red-600 font-bold text-center" role="alert">
                {formFieldErrors}
            </div>
          )}
        </form>
      </div>
    </div>
  );
}
